import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

async function generateFacts() {
    const prompt = `Generate 3 interesting "Did You Know?" facts about each of the three pillars of Indian Democracy:
    1. Legislative (Parliament)
    2. Executive (President/PM)
    3. Judiciary (Supreme Court)
    
    Make them student-friendly and engaging.
    Format as JSON: { "legislative": [...], "executive": [...], "judiciary": [...] }`;

    try {
        const response = await cohere.chat({
            model: 'command-r-plus-08-2024',
            message: prompt,
            response_format: { type: "json_object" }
        });

        console.log(response.text);
    } catch (error) {
        console.error(error);
    }
}

generateFacts();
