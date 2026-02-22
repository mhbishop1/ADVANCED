import { Actor } from 'apify';
import { ApifyClient } from 'apify-client';
import Sentiment from 'sentiment';

await Actor.init();

const sentiment = new Sentiment();
const input = await Actor.getInput() || {};
const apiToken = input.apiToken || process.env.APIFY_TOKEN;

if (!apiToken) {
    await Actor.fail('❌ Missing API Token!');
}

const client = new ApifyClient({ token: apiToken });

try {
    console.log("🚀 Starting the Research Orchestrator with AI Analytics...");

    const jobs = [
        { name: 'TikTok', actorId: 'clockworks/tiktok-scraper', input: { searchQueries: ["AI student conflict"], resultsPerPage: 500 } },
        { name: 'Reddit-Relevance', actorId: 'comchat/reddit-api-scraper', input: { searchList: ["AI university argument"], resultsLimit: 250, sortBy: "relevance" } },
        { name: 'Reddit-New', actorId: 'comchat/reddit-api-scraper', input: { searchList: ["AI university argument"], resultsLimit: 250, sortBy: "new" } },
        { name: 'X', actorId: 'apidojo/twitter-scraper-lite', input: { searchTerms: ["ChatGPT cheating university"], maxItems: 500 } }
    ];

    const runPromises = jobs.map(job => client.actor(job.actorId).call(job.input, { waitSecs: 900 }));
    const runs = await Promise.all(runPromises);

    let masterDataset = [];
    const seenUrls = new Set();

    for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        const platformName = jobs[i].name;

        console.log(`📥 Analyzing ${platformName} data...`);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) continue;

        const normalized = items.map(item => {
            const rawContent = item.text || item.body || item.selftext || item.full_text || "";
            const cleanContent = rawContent.replace(/\n/g, ' ').trim();
            const url = item.url || item.webVideoUrl || (item.id ? `https://x.com/i/web/status/${item.id}` : "");

            // --- DATA PROCESSING: SENTIMENT ---
            const result = sentiment.analyze(cleanContent);
            let mood = "Neutral";
            if (result.score > 2) mood = "Positive";
            if (result.score < -2) mood = "Negative";

            // --- DATA PROCESSING: KEYWORDS ---
            // Grabs the most important words found by the sentiment analyzer
            const keywords = [...new Set([...result.positive, ...result.negative])].join(', ');

            return {
                platform: platformName,
                sentiment_score: result.score,
                mood: mood,
                keywords: keywords || "N/A",
                content: cleanContent || "No text found",
                user: item.author || item.username || "Anonymous",
                url: url,
                engagement: item.diggCount || item.upVotes || item.favorite_count || 0,
                collected_at: new Date().toISOString()
            };
        });

        for (const post of normalized) {
            if (!seenUrls.has(post.url)) {
                seenUrls.add(post.url);
                masterDataset.push(post);
            }
        }
    }

    await Actor.pushData(masterDataset);
    console.log(`🏁 Done! ${masterDataset.length} unique rows analyzed.`);

} catch (error) {
    console.error("❌ Error:", error.message);
    await Actor.fail(error.message);
}

await Actor.exit();