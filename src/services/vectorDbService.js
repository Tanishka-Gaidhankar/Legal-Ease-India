import { CohereClient } from 'cohere-ai';
import crypto from 'crypto';

let _cohere = null;
function getCohereClient() {
    if (!_cohere) {
        _cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
    }
    return _cohere;
}

// In-memory Vector Store for Document QA
// Map<documentId, Array<{text: string, embedding: number[]}>>
const vectorStore = new Map();
const documentSummaries = new Map(); // Store summaries for fast retrieval

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple chunking
function chunkText(text, maxChars = 1000) {
    const chunks = [];
    const paragraphs = text.split(/\n\s*\n/);
    let currentChunk = "";

    for (const p of paragraphs) {
        if (currentChunk.length + p.length > maxChars && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = p;
        } else {
            currentChunk += (currentChunk ? "\n\n" : "") + p;
        }
    }
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

/**
 * Process document into vector DB embeddings and store them for Q&A
 * @returns {Promise<string>} documentId
 */
export async function processAndStoreDocument(text, summary) {
    const documentId = crypto.randomUUID();

    const chunks = chunkText(text, 1000);
    const validChunks = chunks.filter(c => c.trim().length > 20);

    if (validChunks.length > 0) {
        try {
            const cohere = getCohereClient();

            // Cohere embed limits the number of chunks usually or batching, 
            // for simple legal docs, we can embed up to 96 chunks at once.
            // Split validChunks into batches of 90 if more than 96
            const batchSize = 90;
            let allEmbeddings = [];
            for (let i = 0; i < validChunks.length; i += batchSize) {
                const batch = validChunks.slice(i, i + batchSize);
                const embedResponse = await cohere.embed({
                    texts: batch,
                    model: 'embed-english-v3.0',
                    inputType: 'search_document'
                });
                allEmbeddings.push(...embedResponse.embeddings);
            }

            const documentData = validChunks.map((chunk, i) => ({
                text: chunk,
                embedding: allEmbeddings[i]
            }));

            vectorStore.set(documentId, documentData);
            documentSummaries.set(documentId, summary);
            console.log(`[VectorDbService] Stored ${validChunks.length} chunks for document ID: ${documentId}`);
        } catch (error) {
            console.error('[VectorDbService] Vector DB Embed error:', error);
            vectorStore.set(documentId, []);
        }
    } else {
        vectorStore.set(documentId, []);
    }

    return documentId;
}

/**
 * Chat with a document using RAG pipeline
 */
export async function askDocument(documentId, question, conversationHistory = []) {
    const documentData = vectorStore.get(documentId);
    if (!documentData) {
        throw new Error('Document context not found.');
    }
    if (documentData.length === 0) {
        return "The document does not contain enough text to search.";
    }

    const cohere = getCohereClient();

    // 1. Embed query (RAG pipemine step 1)
    const embedResponse = await cohere.embed({
        texts: [question],
        model: 'embed-english-v3.0',
        inputType: 'search_query'
    });
    const queryEmbedding = embedResponse.embeddings[0];

    // 2. Vector search (RAG pipemine step 2)
    const scoredChunks = documentData.map(doc => ({
        text: doc.text,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    scoredChunks.sort((a, b) => b.score - a.score);
    const topContexts = scoredChunks.slice(0, 3).map(c => c.text);

    // 3. Generate Answer (RAG pipeline step 3)
    let preamble = `You are a precise legal document assistant. You answer questions strictly based on the document context provided to you.

## STRICT FORMATTING RULES — FOLLOW THESE EXACTLY
NEVER write a single paragraph as your answer. ALWAYS use this structure:

**[Short heading summarising your answer]**

1. [First point — one idea per line]
2. [Second point — one idea per line]
3. [Third point — one idea per line]

**[Additional heading if needed]**

- [Detail or sub-point]
- [Detail or sub-point]

Rules:
- Every answer MUST use numbered points (1. 2. 3.) or bullet points (-)
- Each point on its own line, with a blank line between sections
- Use **bold** for key terms or clause references
- If the answer is not in the provided context, say: "The document does not contain information about this."
- DO NOT invent or assume facts not present in the document context
- DO NOT write prose paragraphs under any circumstance`;

    const contextText = topContexts.map((c, i) => `--- Chunk ${i + 1} ---\n${c}\n`).join("\n");
    const prompt = `Context from document:\n${contextText}\n\nQuestion: "${question}"\n\nAnswer (in numbered bullet points):`;

    const chatHistory = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'USER' : 'CHATBOT',
        message: msg.content
    }));

    const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        message: prompt,
        chatHistory: chatHistory,
        preamble: preamble,
        temperature: 0.1,
        maxTokens: 500,
    });

    return response.text || 'Unable to find an answer in the document.';
}
