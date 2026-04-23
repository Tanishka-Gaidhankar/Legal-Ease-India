import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, '../../../frontend/constitution-companion-main/public/constitution_enhanced.json');

try {
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    const missing = data.filter(a =>
        !a.simpleExplanation ||
        !a.realLifeExample ||
        !a.keywords ||
        a.keywords.length === 0
    );

    console.log(`📊 Constitution Data Analysis`);
    console.log(`================================`);
    console.log(`Total articles: ${data.length}`);
    console.log(`Articles with complete data: ${data.length - missing.length}`);
    console.log(`Articles with missing data: ${missing.length}`);
    console.log(`Completion rate: ${((data.length - missing.length) / data.length * 100).toFixed(1)}%`);

    console.log(`\n📋 First 10 articles with missing data:`);
    missing.slice(0, 10).forEach(a => {
        const missingFields = [];
        if (!a.simpleExplanation) missingFields.push('explanation');
        if (!a.realLifeExample) missingFields.push('example');
        if (!a.keywords || a.keywords.length === 0) missingFields.push('keywords');
        console.log(`  - Article ${a.article}: ${a.title}`);
        console.log(`    Missing: ${missingFields.join(', ')}`);
    });

} catch (error) {
    console.error('❌ Error:', error.message);
}
