import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, '../data/constitution.json');

const missingArticles = [
    {
        "article": "21A",
        "title": "Right to Education",
        "description": "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.",
        "part": "Part III: Fundamental Rights",
        "simpleExplanation": "Every child between 6 and 14 years has the right to free and compulsory education in a school.",
        "realLifeExample": "A government school cannot charge fees for children under 14, and every child in this age group must be enrolled in school.",
        "keywords": ["education", "children", "free education", "fundamental right"]
    },
    {
        "article": "51A",
        "title": "Fundamental Duties",
        "description": "It shall be the duty of every citizen of India—\n(a) to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem;\n(b) to cherish and follow the noble ideals which inspired our national struggle for freedom;\n(c) to uphold and protect the sovereignty, unity and integrity of India;\n(d) to defend the country and render national service when called upon to do so...",
        "part": "Part IVA: Fundamental Duties",
        "simpleExplanation": "These are the moral obligations of every Indian citizen to help promote a spirit of patriotism and uphold the unity of India.",
        "realLifeExample": "Standing up for the National Anthem and respecting public property are examples of fundamental duties.",
        "keywords": ["duties", "citizen", "national flag", "patriotism", "constitution"]
    }
];

try {
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const articles = JSON.parse(rawData);

    // Check if already exists
    missingArticles.forEach(item => {
        const exists = articles.some(a => String(a.article) === String(item.article));
        if (!exists) {
            articles.push(item);
            console.log(`✅ Added Article ${item.article}`);
        } else {
            console.log(`ℹ️ Article ${item.article} already exists`);
        }
    });

    // Sort articles (numeric if possible, else alphabetical)
    articles.sort((a, b) => {
        const aNum = parseInt(String(a.article));
        const bNum = parseInt(String(b.article));
        if (aNum !== bNum) return aNum - bNum;
        return String(a.article).localeCompare(String(b.article));
    });

    fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
    console.log('✅ Final constitution.json updated with missing articles.');
} catch (error) {
    console.error('❌ Error updating missing articles:', error);
}
