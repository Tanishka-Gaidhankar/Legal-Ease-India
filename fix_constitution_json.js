const fs = require('fs');

const filePath = './frontend/constitution-companion-main/public/constitution_enhanced.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Known correct part mappings based on article number ranges
function getCorrectPart(articleNum) {
    const num = parseFloat(String(articleNum));
    if (articleNum === 0 || articleNum === 'Preamble') return 'Preamble';
    if (num >= 1 && num <= 4) return 'Part I: The Union and Its Territory';
    if (num >= 5 && num <= 11) return 'Part II: Citizenship';
    if (num >= 12 && num <= 35) return 'Part III: Fundamental Rights';
    if (num >= 36 && num <= 51) return 'Part IV: Directive Principles of State Policy';
    if (num === '51A' || (typeof articleNum === 'string' && articleNum.startsWith('51A'))) return 'Part IVA: Fundamental Duties';
    if (num >= 52 && num <= 78) return 'Part V: The Union';
    if (num >= 79 && num <= 122) return 'Part V: The Union';
    if (num >= 123 && num <= 151) return 'Part V: The Union';
    if (num >= 152 && num <= 237) return 'Part VI: The States';
    if (num >= 239 && num <= 242) return 'Part VIII: The Union Territories';
    if (num >= 243 && num <= 243.99) return 'Part IX: The Panchayats';
    if (num >= 244 && num <= 244.99) return 'Part X: The Scheduled and Tribal Areas';
    if (num >= 245 && num <= 263) return 'Part XI: Relations between the Union and the States';
    if (num >= 264 && num <= 300) return 'Part XII: Finance, Property, Contracts and Suits';
    if (num >= 301 && num <= 307) return 'Part XIII: Trade, Commerce and Intercourse within the Territory of India';
    if (num >= 308 && num <= 323) return 'Part XIV: Services Under the Union and the States';
    if (num >= 324 && num <= 329) return 'Part XV: Elections';
    if (num >= 330 && num <= 342) return 'Part XVI: Special Provisions Relating to Certain Classes';
    if (num >= 343 && num <= 351) return 'Part XVII: Official Language';
    if (num >= 352 && num <= 360) return 'Part XVIII: Emergency Provisions';
    if (num >= 361 && num <= 367) return 'Part XIX: Miscellaneous';
    if (num >= 368 && num <= 368) return 'Part XX: Amendment of the Constitution';
    if (num >= 369 && num <= 392) return 'Part XXI: Temporary, Transitional and Special Provisions';
    if (num >= 393 && num <= 395) return 'Part XXII: Short Title, Commencement, Authoritative Text in Hindi and Repeals';
    return null; // keep existing
}

// Fix corrupt data - entries that incorrectly have "part": "Preamble"
// but are NOT actually the preamble (article 0)
let fixedCount = 0;
const seen = new Set();
const uniqueArticles = [];

for (const article of data) {
    const artKey = String(article.article) + '::' + article.title;

    // Fix incorrect "Preamble" part assignment for non-preamble articles
    if (article.part === 'Preamble' && article.article !== 0 && article.article !== 'Preamble') {
        const correctPart = getCorrectPart(article.article);
        if (correctPart) {
            article.part = correctPart;
            fixedCount++;
        }

        // Also fix the corrupt keywords/simpleExplanation that were copy-pasted from Preamble
        const corruptKeywords = ['preamble', 'sovereign', 'democratic', 'republic', 'justice'];
        if (article.keywords && article.keywords.length === 5 &&
            JSON.stringify(article.keywords.sort()) === JSON.stringify(corruptKeywords.sort())) {
            // These keywords are from the preamble - clear them so the article title/description are used for search
            article.keywords = [];
        }

        // Fix corrupt simpleExplanation 
        const preambleExplanation = "This is the opening statement of India's Constitution. It declares that India is a sovereign, socialist, secular, democratic republic that aims to provide justice, liberty, equality, and brotherhood to all its citizens.";
        if (article.simpleExplanation === preambleExplanation) {
            article.simpleExplanation = '';
        }

        // Fix corrupt realLifeExample
        const preambleExample = "The Preamble sets the vision and values that guide all the articles in the Constitution. It's like the mission statement of the Indian government.";
        if (article.realLifeExample === preambleExample) {
            article.realLifeExample = '';
        }
    }

    // Deduplicate: keep only the first occurrence of each article+title combo
    // But keep multiple entries for the same article number if they have different titles
    if (!seen.has(artKey)) {
        seen.add(artKey);
        uniqueArticles.push(article);
    }
}

console.log(`Fixed ${fixedCount} articles with wrong 'Preamble' part`);
console.log(`Original count: ${data.length}, After dedup: ${uniqueArticles.length}`);

// Add a unique id to each article for React keys
const articlesWithIds = uniqueArticles.map((article, index) => ({
    id: index,
    ...article
}));

fs.writeFileSync(filePath, JSON.stringify(articlesWithIds, null, 2), 'utf8');
console.log('Done! File written successfully.');
