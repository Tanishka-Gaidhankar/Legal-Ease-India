import express from 'express';
import { generateLegalResponse } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/chat/message
 * Generate AI response for a legal query
 */
router.post('/message', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Message is required and must be a string'
            });
        }

        // Generate AI response
        const aiResponse = await generateLegalResponse(message, conversationHistory || []);

        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate response',
            message: error.message
        });
    }
});

export default router;
