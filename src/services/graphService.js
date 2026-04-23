import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class GraphService {
    constructor() {
        this.articles = new Map(); // Map<articleNo (number), articleData>
        this.parts = new Map();    // Map<partName (string), partData>
        this.keywordIndex = new Map(); // Map<keyword, Set<articleNos>>
        this.initialized = false;
    }

    /**
     * Initialize the graph by loading and parsing constitution.json
     */
    async initialize() {
        if (this.initialized) return;

        try {
            const dataPath = path.join(__dirname, '../data/constitution.json');
            const rawData = fs.readFileSync(dataPath, 'utf-8');
            const constitutionData = JSON.parse(rawData);

            // constitution.json is a flat array of article objects
            if (!Array.isArray(constitutionData)) {
                throw new TypeError('constitution.json must be a JSON array');
            }

            // Build Articles Map from flat array
            this._buildArticlesMap(constitutionData);

            // Build Parts Map by grouping articles by their 'part' field
            this._buildPartsMap(constitutionData);

            // Build Keyword Index
            this._buildKeywordIndex();

            this.initialized = true;
            console.log(`✅ Knowledge Graph initialized: ${this.articles.size} articles, ${this.parts.size} parts`);
        } catch (error) {
            console.error('❌ Failed to initialize Knowledge Graph:', error);
            throw error;
        }
    }

    /**
     * Build articles map from flat array
     * Expected fields: article (number), title, description, part,
     *   simpleExplanation, realLifeExample, keywords (array)
     */
    _buildArticlesMap(articlesArray) {
        for (const article of articlesArray) {
            const artNo = article.article; // numeric key (0 = Preamble)

            // Build a readable full-text block for this article
            let fullText = artNo === 0
                ? `Preamble: ${article.title}\n\n`
                : `Article ${artNo}: ${article.title || ''}\n\n`;

            if (article.description) {
                fullText += article.description + '\n';
            }

            if (article.simpleExplanation) {
                fullText += `\nSimple Explanation: ${article.simpleExplanation}\n`;
            }

            if (article.realLifeExample) {
                fullText += `\nReal-Life Example: ${article.realLifeExample}\n`;
            }

            this.articles.set(artNo, {
                number: artNo,
                name: article.title || '',
                part: article.part || '',
                fullText: fullText.trim(),
                keywords: Array.isArray(article.keywords) ? article.keywords : [],
                rawData: article
            });
        }
    }

    /**
     * Build parts map by grouping articles by their 'part' field
     */
    _buildPartsMap(articlesArray) {
        for (const article of articlesArray) {
            const partName = article.part || 'Unknown';
            if (!this.parts.has(partName)) {
                this.parts.set(partName, {
                    name: partName,
                    articles: []
                });
            }
            this.parts.get(partName).articles.push(article.article);
        }
    }

    /**
     * Build keyword index for semantic search.
     * Uses both the built-in 'keywords' array from each article
     * and a predefined list of common legal terms.
     */
    _buildKeywordIndex() {
        const commonKeywords = [
            'equality', 'freedom', 'speech', 'expression', 'religion', 'life', 'liberty',
            'education', 'property', 'discrimination', 'minority', 'fundamental rights',
            'directive principles', 'citizenship', 'arrest', 'detention', 'exploitation',
            'untouchability', 'president', 'parliament', 'supreme court', 'high court',
            'preamble', 'sovereignty', 'republic', 'justice', 'fraternity', 'right to vote',
            'right to information', 'bail', 'habeas corpus', 'trade', 'profession'
        ];

        for (const [artNo, article] of this.articles) {
            const searchText = (article.name + ' ' + article.part + ' ' + article.fullText).toLowerCase();

            // Index using common keyword list
            for (const keyword of commonKeywords) {
                if (searchText.includes(keyword.toLowerCase())) {
                    if (!this.keywordIndex.has(keyword)) {
                        this.keywordIndex.set(keyword, new Set());
                    }
                    this.keywordIndex.get(keyword).add(artNo);
                }
            }

            // Also index using the article's own keywords array
            for (const kw of article.keywords) {
                const kwLower = kw.toLowerCase();
                if (!this.keywordIndex.has(kwLower)) {
                    this.keywordIndex.set(kwLower, new Set());
                }
                this.keywordIndex.get(kwLower).add(artNo);
            }
        }
    }

    /**
     * Search the graph for relevant context based on user query
     * @param {string} query - User's question
     * @returns {string} - Relevant constitutional context
     */
    searchGraph(query) {
        if (!this.initialized) {
            console.warn('⚠️ Graph not initialized. Call initialize() first.');
            return '';
        }

        const queryLower = query.toLowerCase();
        const relevantArticles = new Set();

        // Strategy 1: Direct article number mention (e.g., "Article 21", "Art 14")
        const articleMatches = query.match(/article\s*(\d+[A-Za-z]?)/gi);
        if (articleMatches) {
            articleMatches.forEach(match => {
                const artNo = parseInt(match.replace(/article\s*/i, '').trim(), 10);
                if (this.articles.has(artNo)) {
                    relevantArticles.add(artNo);
                }
            });
        }

        // Strategy 2: Keyword index matching
        for (const [keyword, articleSet] of this.keywordIndex) {
            if (queryLower.includes(keyword)) {
                articleSet.forEach(artNo => relevantArticles.add(artNo));
            }
        }

        // Strategy 3: Part name matching (e.g., "Fundamental Rights")
        for (const [partName, partData] of this.parts) {
            if (queryLower.includes(partName.toLowerCase())) {
                partData.articles.forEach(artNo => relevantArticles.add(artNo));
            }
        }

        // Strategy 4: Title substring matching
        for (const [artNo, article] of this.articles) {
            if (article.name && queryLower.includes(article.name.toLowerCase())) {
                relevantArticles.add(artNo);
            }
        }

        // Limit to top 5 most relevant articles to avoid context overflow
        const topArticles = Array.from(relevantArticles).slice(0, 5);

        if (topArticles.length === 0) {
            return ''; // No specific context found, LLM will use general knowledge
        }

        // Build context string
        let context = '=== RELEVANT CONSTITUTIONAL ARTICLES ===\n\n';
        topArticles.forEach(artNo => {
            const article = this.articles.get(artNo);
            context += `${article.fullText}\n\n---\n\n`;
        });

        return context;
    }

    /**
     * Get article by number
     * @param {number} articleNo
     * @returns {object|null}
     */
    getArticle(articleNo) {
        return this.articles.get(Number(articleNo)) || null;
    }

    /**
     * Get all articles in a part
     * @param {string} partName
     * @returns {array}
     */
    getArticlesByPart(partName) {
        const part = this.parts.get(partName);
        if (!part) return [];
        return part.articles.map(artNo => this.articles.get(artNo)).filter(Boolean);
    }

    /**
     * Get graph statistics
     */
    getStats() {
        return {
            totalArticles: this.articles.size,
            totalParts: this.parts.size,
            indexedKeywords: this.keywordIndex.size,
            initialized: this.initialized
        };
    }
}

// Singleton instance
const graphService = new GraphService();

export default graphService;
