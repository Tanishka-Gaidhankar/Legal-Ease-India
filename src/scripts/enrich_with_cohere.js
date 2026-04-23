import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const DATA_PATH = path.resolve(__dirname, '../data/constitution.json');

if (!COHERE_API_KEY) {
    console.error('❌ COHERE_API_KEY not found in .env');
    process.exit(1);
}

const cohere = new CohereClient({
    token: COHERE_API_KEY,
});

const BOILERPLATE_PATTERN = /This article explains the core idea of Article .* in simple terms/;

async function enrichArticle(article) {
    console.log(`🧪 Enriching Article ${article.article}: ${article.title}...`);

    const prompt = `You are a legal education expert. Your task is to provide a student-friendly explanation of an Article from the Indian Constitution.
    
Article Number: ${article.article}
Title: ${article.title}
Official Text: ${article.description}

Please provide:
1. A **Simple Explanation** (layman's terms, 2-3 sentences max).
2. A **Real Life Example** (relatable practical scenario).
3. 5-7 **Keywords** (comma separated).

Format your response as:
Explanation: [text]
Example: [text]
Keywords: [word1, word2, ...]`;

    try {
        const response = await cohere.chat({
            model: 'command-r-plus-08-2024',
            message: prompt,
            preamble: "You are a helpful legal education assistant for students.",
        });

        const text = response.text;

        const explanationMatch = text.match(/Explanation: (.*)/i);
        const exampleMatch = text.match(/Example: (.*)/i);
        const keywordsMatch = text.match(/Keywords: (.*)/i);

        if (explanationMatch) article.simpleExplanation = explanationMatch[1].trim();
        if (exampleMatch) article.realLifeExample = exampleMatch[1].trim();
        if (keywordsMatch) {
            article.keywords = keywordsMatch[1].split(',').map(k => k.trim().toLowerCase());
        }

        return true;
    } catch (error) {
        console.error(`❌ Error enriching article ${article.article}:`, error.message);
        return false;
    }
}

async function main() {
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const articles = JSON.parse(rawData);

        let count = 0;
        const limit = 500; // Enrich up to 500 articles

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];

            // Enrich if it's missing data OR has the boilerplate text
            const isMissing = !article.simpleExplanation || !article.realLifeExample || !article.keywords || article.keywords.length <= 2;
            const isBoilerplate = article.simpleExplanation && BOILERPLATE_PATTERN.test(article.simpleExplanation);

            if (isMissing || isBoilerplate) {
                const success = await enrichArticle(article);
                if (success) {
                    count++;
                    // Save progress every few articles
                    if (count % 5 === 0) {
                        fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
                        console.log(`💾 Saved progress (${count} articles enriched)`);
                    }
                }

                if (count >= limit) {
                    console.log('🛑 Reached batch limit. Stopping for now.');
                    break;
                }

                // Small delay to avoid aggressive rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
        console.log(`✅ Enrichment complete! Enriched ${count} articles.`);

    } catch (error) {
        console.error('❌ Main loop error:', error);
    }
}

main();
