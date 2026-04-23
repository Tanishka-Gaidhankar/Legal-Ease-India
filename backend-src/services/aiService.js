import { CohereClient } from 'cohere-ai';
import graphService from './graphService.js';

let _cohere = null;

/**
 * Initialize and get the Cohere client lazily
 * This ensures process.env variables are loaded before initialization
 */
function getCohereClient() {
    if (!_cohere) {
        if (!process.env.COHERE_API_KEY) {
            console.error('❌ COHERE_API_KEY is missing from environment variables!');
        }
        _cohere = new CohereClient({
            token: process.env.COHERE_API_KEY
        });
    }
    return _cohere;
}

/**
 * Generate AI response for legal queries
 * @param {string} userMessage - The user's question
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - AI generated response
 */
export async function generateLegalResponse(userMessage, conversationHistory = []) {
    try {
        // Retrieve relevant constitutional context from Knowledge Graph
        const constitutionalContext = graphService.searchGraph(userMessage);

        
        let systemPrompt = `You are a knowledgeable legal assistant specializing in Indian law and the Indian Constitution.

## YOUR ROLE
- Provide clear, accurate information about Indian legal matters
- Explain constitutional articles and legal concepts in simple terms
- Help users understand their rights and duties under Indian law
- Always clarify that you provide general legal information, not professional legal advice

## STRICT FORMATTING RULES — FOLLOW THESE EXACTLY
NEVER write a single paragraph as your answer. ALWAYS structure your response like this:

**[Short heading that describes the topic]**

1. [First key point — one idea per line]
2. [Second key point — one idea per line]
3. [Third key point — one idea per line]

**[Second heading if needed]**

- [Sub-point or detail]
- [Sub-point or detail]

> 📌 *Always end with a note like: "For specific legal advice, please consult a qualified lawyer."*

Rules:
- Every answer MUST use numbered points (1. 2. 3.) or bullet points (-)
- Each point must be on its own line with a blank line between sections
- Use **bold** for headings and important terms
- Cite article numbers like: Article 21, Section 302 IPC, etc.
- Maximum 2 short sections per response — keep it concise
- DO NOT write prose paragraphs under any circumstance`;

        // If we found relevant constitutional context, add it to the prompt
        if (constitutionalContext) {
            systemPrompt += `\n\n${constitutionalContext}\n\nIMPORTANT: Base your answer primarily on the constitutional articles provided above. Quote specific article numbers when relevant.`;
        }

        // Build chat history in Cohere format
        // Cohere expects: { role: 'USER' | 'CHATBOT', message: string }
        const chatHistory = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'USER' : 'CHATBOT',
            message: msg.content
        }));

        // Call Cohere Chat API
        const response = await getCohereClient().chat({
            model: 'command-r-plus-08-2024',   // Cohere's powerful chat model
            message: userMessage,
            chatHistory: chatHistory,
            preamble: systemPrompt,
            temperature: 0.7,
            maxTokens: 1024,
        });

        return response.text || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
        console.error('Cohere API Error:', error);
        throw new Error('Failed to generate AI response: ' + error.message);
    }
}

/**
 * Summarize a legal document
 * @param {string} documentText - The document content to summarize
 * @param {string} filename - Original filename for context
 * @returns {Promise<string>} - AI generated summary
 */
export async function summarizeDocument(documentText, filename = 'document') {
    try {
        const preamble = `You are a legal document summarizer specializing in Indian legal documents.

## STRICT FORMATTING RULES — FOLLOW THESE EXACTLY
NEVER write prose paragraphs. ALWAYS use this exact structure with bullet points:

**📄 Document Overview:**
- [What type of document this is — e.g., contract, FIR, agreement, affidavit]
- [Parties involved and their roles]
- [Date and jurisdiction if mentioned]

**🔑 Key Points:**
1. [Most important point]
2. [Second important point]
3. [Third important point]
4. [Add more as needed]

**⚖️ Important Provisions / Clauses:**
- [Critical clause or obligation 1]
- [Critical clause or obligation 2]
- [Any penalties, deadlines, or conditions]

**✅ Conclusion:**
- [Overall assessment in 1–2 bullet points]
- [Any recommended action or legal implication]

Rules:
- Every section MUST use bullet points (-) or numbered lists (1. 2. 3.)
- Each point on its own line, blank line between sections
- Use **bold** for key legal terms, party names, dates, and article references
- DO NOT write full sentences as paragraphs — one idea per bullet point only
- Keep each bullet concise (max 15 words per point)`;


        const response = await getCohereClient().chat({
            model: 'command-r-plus-08-2024',
            message: `Please summarize this legal document (${filename}):\n\n${documentText.substring(0, 15000)}`,
            preamble: preamble,
            temperature: 0.5,
            maxTokens: 2048,
        });

        return response.text || 'Unable to generate summary.';
    } catch (error) {
        console.error('Cohere API Error:', error);
        throw new Error('Failed to summarize document: ' + error.message);
    }
}
