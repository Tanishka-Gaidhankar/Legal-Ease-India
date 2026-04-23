import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.js';
import summarizerRoutes from './routes/summarizer.js';
import graphService from './services/graphService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/summarizer', summarizerRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'LegalEase India Backend is running',
        timestamp: new Date().toISOString(),
        graphStats: graphService.getStats()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Initialize Knowledge Graph and start server
async function startServer() {
    try {
        console.log('🔄 Initializing Knowledge Graph...');
        await graphService.initialize();

        const server = app.listen(PORT);

        // Set BEFORE the server starts accepting requests.
        // Node's default keepAliveTimeout (5s) is much shorter than the time
        // Cohere AI needs to respond — causing ECONNRESET mid-request.
        server.keepAliveTimeout = 120000;  // 120 seconds
        server.headersTimeout = 121000;  // must be strictly > keepAliveTimeout

        server.on('listening', () => {
            console.log(`🚀 LegalEase India Backend running on http://localhost:${PORT}`);
            console.log(`📡 Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            console.log(`📊 Knowledge Graph Stats:`, graphService.getStats());
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
