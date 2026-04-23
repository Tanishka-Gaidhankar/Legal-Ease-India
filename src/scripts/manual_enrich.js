import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, '../../../frontend/constitution-companion-main/public/constitution_enhanced.json');

// Sample enrichment data for important articles
const enrichmentData = {
    3: {
        simpleExplanation: "Parliament has the power to create new states, change state boundaries, or rename existing states. This requires a simple majority in Parliament.",
        realLifeExample: "In 2014, Telangana was carved out of Andhra Pradesh using this article. Similarly, Uttarakhand, Jharkhand, and Chhattisgarh were created as new states.",
        keywords: ["states", "boundaries", "formation", "parliament", "territory"]
    },
    4: {
        simpleExplanation: "Laws made under Articles 2 and 3 (about state formation) are not considered constitutional amendments. They can be passed like regular laws.",
        realLifeExample: "When new states are created, the First and Fourth Schedules of the Constitution are updated without requiring a constitutional amendment process.",
        keywords: ["amendment", "schedules", "state formation", "law"]
    },
    5: {
        simpleExplanation: "People who were living in India when the Constitution came into effect (26 January 1950) automatically became Indian citizens if they were born in India or had Indian parents.",
        realLifeExample: "Anyone born in India before 1950 and living here when the Constitution was adopted became an Indian citizen automatically.",
        keywords: ["citizenship", "domicile", "birth", "1950"]
    },
    12: {
        simpleExplanation: "This article defines what 'State' means in the Constitution. It includes the Government of India, Parliament, State Governments, and all local authorities.",
        realLifeExample: "When you file a case against a government office, municipality, or any public authority, you're filing it against the 'State' as defined by this article.",
        keywords: ["state", "definition", "government", "authority"]
    },
    13: {
        simpleExplanation: "Any law that violates fundamental rights is invalid. The State cannot make laws that take away or reduce the rights guaranteed in Part III of the Constitution.",
        realLifeExample: "If a state government passes a law that discriminates based on religion, it can be struck down by courts as it violates Article 13.",
        keywords: ["fundamental rights", "void", "inconsistent", "law"]
    },
    15: {
        simpleExplanation: "The State cannot discriminate against any citizen based on religion, race, caste, sex, or place of birth. However, special provisions can be made for women, children, and backward classes.",
        realLifeExample: "A government hospital cannot refuse treatment to someone because of their caste or religion. But the government can reserve seats for women in educational institutions.",
        keywords: ["discrimination", "equality", "religion", "caste", "sex"]
    },
    16: {
        simpleExplanation: "All citizens have equal opportunity in matters of public employment. The State cannot discriminate in government jobs based on religion, caste, sex, or place of birth.",
        realLifeExample: "Government job advertisements must be open to all citizens. However, reservations for SC/ST/OBC are allowed as they promote equality.",
        keywords: ["employment", "equality", "public service", "reservation"]
    },
    17: {
        simpleExplanation: "Untouchability is abolished and its practice in any form is forbidden. Anyone practicing untouchability can be punished by law.",
        realLifeExample: "If someone refuses to serve food to a person because of their caste, they can be prosecuted under the Protection of Civil Rights Act, 1955.",
        keywords: ["untouchability", "abolished", "social equality", "caste"]
    },
    19: {
        simpleExplanation: "Citizens have six fundamental freedoms: speech and expression, assembly, association, movement, residence, and profession. These can be restricted only for specific reasons like public order or morality.",
        realLifeExample: "You can organize a peaceful protest (freedom of assembly), but the government can impose restrictions if it threatens public order.",
        keywords: ["freedom", "speech", "expression", "movement", "profession"]
    },
    20: {
        simpleExplanation: "No person can be convicted for an act that was not a crime when it was committed. Also, no one can be punished more than once for the same offense.",
        realLifeExample: "If you did something in 2020 that became illegal in 2021, you cannot be punished for doing it in 2020. This is called 'ex post facto law' protection.",
        keywords: ["conviction", "double jeopardy", "ex post facto", "protection"]
    },
    22: {
        simpleExplanation: "If someone is arrested, they must be told the reason for arrest and have the right to consult a lawyer. They must be presented before a magistrate within 24 hours.",
        realLifeExample: "If police arrest you, they must tell you why and allow you to call a lawyer. You cannot be kept in custody for more than 24 hours without being taken to court.",
        keywords: ["arrest", "detention", "rights", "lawyer", "magistrate"]
    },
    23: {
        simpleExplanation: "Human trafficking and forced labor are prohibited. No one can be forced to work without payment (except for public service like military conscription).",
        realLifeExample: "Forcing someone to work as bonded labor is a crime. Child labor in hazardous industries is also banned under this article.",
        keywords: ["trafficking", "forced labor", "bonded labor", "exploitation"]
    },
    24: {
        simpleExplanation: "No child below 14 years can be employed in factories, mines, or any hazardous work. This protects children from exploitation.",
        realLifeExample: "A factory owner cannot hire a 12-year-old child to work in their factory. This is punishable by law.",
        keywords: ["child labor", "employment", "factory", "hazardous work"]
    },
    25: {
        simpleExplanation: "All persons have the right to freely practice, profess, and propagate any religion. The State must remain secular and not favor any religion.",
        realLifeExample: "You can follow any religion, change your religion, or choose not to follow any religion. The government cannot force you to follow a particular faith.",
        keywords: ["religion", "freedom", "conscience", "secular", "worship"]
    },
    26: {
        simpleExplanation: "Religious groups have the right to establish institutions, manage religious affairs, own property, and administer it according to law.",
        realLifeExample: "A religious organization can build a temple, church, or mosque, manage its affairs, and own the property, subject to public order and morality.",
        keywords: ["religious denomination", "institutions", "property", "affairs"]
    },
    29: {
        simpleExplanation: "Minorities (based on religion or language) have the right to conserve their distinct culture, language, and script.",
        realLifeExample: "Urdu-speaking minorities can establish schools to teach in Urdu and preserve their language and culture.",
        keywords: ["minority", "culture", "language", "protection"]
    },
    30: {
        simpleExplanation: "Minorities have the right to establish and run educational institutions of their choice. The State cannot discriminate in giving aid to these institutions.",
        realLifeExample: "Muslim, Christian, or Sikh communities can establish schools and colleges to preserve their culture and provide education.",
        keywords: ["minority", "education", "institutions", "rights"]
    },
    32: {
        simpleExplanation: "The Supreme Court and High Courts can issue writs (orders) to enforce fundamental rights. This is the right to constitutional remedies.",
        realLifeExample: "If your fundamental rights are violated, you can directly approach the Supreme Court or High Court through a writ petition like Habeas Corpus or Mandamus.",
        keywords: ["remedies", "writs", "supreme court", "enforcement"]
    }
};

async function enrichConstitution() {
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const articles = JSON.parse(rawData);

        let enrichedCount = 0;

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const enrichment = enrichmentData[article.article];

            if (enrichment) {
                article.simpleExplanation = enrichment.simpleExplanation;
                article.realLifeExample = enrichment.realLifeExample;
                article.keywords = enrichment.keywords;
                enrichedCount++;
                console.log(`✅ Enriched Article ${article.article}: ${article.title}`);
            }
        }

        fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
        console.log(`\n🎉 Successfully enriched ${enrichedCount} articles!`);
        console.log(`📊 Progress: ${((enrichedCount / 364) * 100).toFixed(1)}% of missing articles completed`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

enrichConstitution();
