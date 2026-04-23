// In dev, use relative URL so Vite's proxy forwards /api/* to localhost:3001 without CORS issues.
// In production, set VITE_BACKEND_URL to your deployed backend URL.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - AI response
 */
export async function sendChatMessage(message, conversationHistory = []) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                conversationHistory,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get AI response');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Chat API error:', error);
        throw error;
    }
}

/**
 * Summarize a document using AI
 * @param {string} documentText - The document content
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - AI generated summary
 */
export async function summarizeDocument(documentText, filename = 'document') {
    try {
        const response = await fetch(`${BACKEND_URL}/api/summarizer/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documentText,
                filename,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to summarize document');
        }

        const data = await response.json();
        return { summary: data.summary, documentId: data.documentId };
    } catch (error) {
        console.error('Summarizer API error:', error);
        throw error;
    }
}

/**
 * Analyze a custom scenario based on the Constitution
 * @param {string} scenario - The scenario to analyze
 * @returns {Promise<string>} - AI analysis
 */
export async function analyzeScenario(scenario) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Scenario: ${scenario}\n\nPlease analyze what happens in this scenario according to the Indian Constitution. Identify potential violations or relevant rights.`,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to analyze scenario');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Scenario Analysis API error:', error);
        throw error;
    }
}

/**
 * Ask AI a specific question about an article
 * @param {string} question - Student's question
 * @param {object} article - The article context
 * @returns {Promise<string>} - AI response
 */
export async function askAboutArticle(question, article) {
    try {
        const message = `I am reading Article ${article.article}: ${article.title}.
Official Text: ${article.description}
        
Student Question: ${question}`;

        const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                conversationHistory: [
                    { role: 'assistant', content: `Working with Article ${article.article} context.` }
                ]
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get answer');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Ask Article API error:', error);
        throw error;
    }
}

/**
 * Check if backend is available
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
}

// ── Helper: safely parse JSON — avoids "unexpected token '<'" when server
//    returns an HTML error page instead of JSON.
async function safeJson(response: Response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    // Server returned HTML (e.g. Express default error page) — surface status
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${response.statusText || text.slice(0, 120)}`);
}

/**
 * Upload a document file (PDF, DOCX, TXT, or image) and summarize it
 * @param {File} file - The file to upload
 * @returns {Promise<{summary: string, documentId: string, filename: string}>}
 */
export async function uploadDocument(file: File) {
    try {
        const formData = new FormData();
        formData.append('document', file);

        const response = await fetch(`${BACKEND_URL}/api/summarizer/upload`, {
            method: 'POST',
            body: formData,
            // Do NOT set Content-Type — browser sets it with the multipart boundary
        });

        if (!response.ok) {
            const error = await safeJson(response);
            throw new Error(error.message || `Upload failed (${response.status})`);
        }

        const data = await response.json();
        return { summary: data.summary, documentId: data.documentId, filename: data.filename };
    } catch (error) {
        console.error('Upload Document API error:', error);
        throw error;
    }
}

/**
 * Ask a question about an uploaded document
 * @param {string} documentId - The document ID
 * @param {string} question - Question about the document
 * @param {Array} conversationHistory - Previous context
 * @returns {Promise<string>} - AI response based on document
 */
export async function askDocumentQuestion(documentId, question, conversationHistory = []) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/summarizer/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documentId,
                question,
                conversationHistory
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to ask question');
        }

        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error('Ask Document API error:', error);
        throw error;
    }
}
