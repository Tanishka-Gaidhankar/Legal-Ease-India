import graphService from './services/graphService.js';

/**
 * Test script for Knowledge Graph
 */
async function testGraph() {
    console.log('🧪 Testing Knowledge Graph...\n');

    try {
        // Initialize
        await graphService.initialize();
        console.log('✅ Graph initialized\n');

        // Test 1: Get stats
        console.log('📊 Graph Statistics:');
        console.log(graphService.getStats());
        console.log('');

        // Test 2: Direct article lookup
        console.log('🔍 Test 1: Direct Article Lookup (Article 21)');
        const article21 = graphService.getArticle('21');
        if (article21) {
            console.log(`Found: ${article21.name}`);
            console.log(`SubHeading: ${article21.subHeading}`);
            console.log(`Text: ${article21.fullText.substring(0, 200)}...`);
        }
        console.log('');

        // Test 3: Search with article number
        console.log('🔍 Test 2: Search Query - "What is Article 21?"');
        const context1 = graphService.searchGraph('What is Article 21?');
        console.log(`Context found: ${context1.length > 0 ? 'YES' : 'NO'}`);
        if (context1) {
            console.log(`Context length: ${context1.length} characters`);
            console.log(`Preview: ${context1.substring(0, 300)}...`);
        }
        console.log('');

        // Test 4: Keyword search
        console.log('🔍 Test 3: Search Query - "Tell me about equality"');
        const context2 = graphService.searchGraph('Tell me about equality');
        console.log(`Context found: ${context2.length > 0 ? 'YES' : 'NO'}`);
        if (context2) {
            console.log(`Context length: ${context2.length} characters`);
            // Extract article numbers from context
            const articles = context2.match(/Article \d+[A-Z]?:/g);
            console.log(`Articles found: ${articles ? articles.join(', ') : 'None'}`);
        }
        console.log('');

        // Test 5: Complex query
        console.log('🔍 Test 4: Search Query - "What are my fundamental rights?"');
        const context3 = graphService.searchGraph('What are my fundamental rights?');
        console.log(`Context found: ${context3.length > 0 ? 'YES' : 'NO'}`);
        if (context3) {
            const articles = context3.match(/Article \d+[A-Z]?:/g);
            console.log(`Articles found: ${articles ? articles.join(', ') : 'None'}`);
        }
        console.log('');

        // Test 6: Get articles by part
        console.log('🔍 Test 5: Get Articles in Part III (Fundamental Rights)');
        const partIIIArticles = graphService.getArticlesByPart('III');
        console.log(`Found ${partIIIArticles.length} articles in Part III`);
        console.log(`Sample: ${partIIIArticles.slice(0, 3).map(a => `Article ${a.number}`).join(', ')}`);
        console.log('');

        console.log('✅ All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testGraph();
