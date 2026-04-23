import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';
import { summarizeDocument } from '../services/aiService.js';
import { processAndStoreDocument, askDocument } from '../services/vectorDbService.js';

// pdf-parse is a CommonJS module; use createRequire to load it safely in ESM
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();

// ─── Multer Setup (in-memory storage) ─────────────────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`));
        }
    }
});

// ─── Helper: Extract Text from Buffer ─────────────────────────────────────────
async function extractText(buffer, mimetype, filename) {
    // PDF
    if (mimetype === 'application/pdf') {
        const data = await pdfParse(buffer);
        return data.text;
    }

    // Word (docx / doc)
    if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimetype === 'application/msword'
    ) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    // Plain text
    if (mimetype === 'text/plain') {
        return buffer.toString('utf-8');
    }

    // Images – we cannot do traditional OCR without a cloud vision API,
    // so we return a placeholder that the caller uses to inform the user.
    if (mimetype.startsWith('image/')) {
        return null; // signal: image file, needs special handling
    }

    throw new Error('Unsupported file type');
}

// ─── Multer error wrapper (returns JSON instead of HTML for upload errors) ────
function uploadSingle(req, res, next) {
    upload.single('document')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: 'File upload error',
                message: err.message || 'Failed to upload file',
            });
        }
        next();
    });
}

// ─── POST /api/summarizer/upload ──────────────────────────────────────────────
/**
 * Upload a document file (PDF, DOCX, TXT, or image) and summarize it.
 * The extracted text is then stored in the vector DB for RAG querying.
 */
router.post('/upload', uploadSingle, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { mimetype, originalname, buffer } = req.file;

        let documentText = await extractText(buffer, mimetype, originalname);

        // ── Image handling ──────────────────────────────────────────────────
        if (documentText === null) {
            // Convert image to base64 and send to Cohere vision endpoint.
            // For now we fall back to extracting whatever text is in the EXIF
            // or return a descriptive error so the UI can show it gracefully.
            return res.status(422).json({
                error: 'Image OCR not available',
                message: 'Image-based documents are not yet supported for automated text extraction. Please convert your image to a PDF or copy-paste the text manually.',
            });
        }

        documentText = documentText.trim();

        if (!documentText || documentText.length < 50) {
            return res.status(400).json({
                error: 'No readable text found',
                message: 'The uploaded file does not contain enough readable text to summarize.',
            });
        }

        // Generate summary
        const summary = await summarizeDocument(documentText, originalname);

        // Store in vector DB for Q&A
        const documentId = await processAndStoreDocument(documentText, summary);

        res.json({
            success: true,
            summary,
            documentId,
            originalLength: documentText.length,
            filename: originalname,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('File upload/summarize error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process uploaded file',
            message: error.message,
        });
    }
});

// ─── POST /api/summarizer/summarize ───────────────────────────────────────────
/**
 * Summarize a legal document provided as plain text.
 */
router.post('/summarize', async (req, res) => {
    try {
        const { documentText, filename } = req.body;

        if (!documentText || typeof documentText !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Document text is required',
            });
        }

        if (documentText.length < 50) {
            return res.status(400).json({
                error: 'Invalid document',
                message: 'Document is too short to summarize',
            });
        }

        const summary = await summarizeDocument(documentText, filename);
        const documentId = await processAndStoreDocument(documentText, summary);

        res.json({
            success: true,
            summary,
            documentId,
            originalLength: documentText.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Summarizer error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to summarize document',
            message: error.message,
        });
    }
});

// ─── POST /api/summarizer/ask ─────────────────────────────────────────────────
/**
 * Ask a question about a previously uploaded document.
 */
router.post('/ask', async (req, res) => {
    try {
        const { documentId, question, conversationHistory } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'documentId and question are required',
            });
        }

        const answer = await askDocument(documentId, question, conversationHistory || []);

        res.json({
            success: true,
            answer,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Ask document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to answer question',
            message: error.message,
        });
    }
});

export default router;
