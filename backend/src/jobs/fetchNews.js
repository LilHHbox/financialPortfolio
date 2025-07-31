const axios = require("axios");
const db = require("../db");

const NEWS_API_URL = `https://financialmodelingprep.com/stable/fmp-articles?page=0&limit=20&apikey=oKyeBMXARIUHbO90DI0XoVYDg2qS5YE1`;

async function fetchNewsArticles() {
    try {
        const response = await axios.get(NEWS_API_URL);
        const articles = response.data;

        let insertedCount = 0;

        for (const article of articles) {
            const {
                title,
                date,
                content,
                tickers,
                image,
                link,
                author,
                site,
            } = article;

            // ✅ 用 MySQL 的 exists 判断方式
            const [exists] = await db.query(
                "SELECT 1 FROM market_news WHERE link = ? LIMIT 1",
                [link.trim()]
            );

            if (exists.length > 0) continue;

            await db.query(
                `INSERT INTO market_news 
                (title, date, content, tickers, image_url, link, author, site)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, date, content, tickers?.trim(), image?.trim(), link?.trim(), author, site]
            );

            insertedCount++;
        }

        console.log(`[✅] Inserted ${insertedCount} new article(s)`);
    } catch (err) {
        console.error("[❌] Error fetching/saving news:", err.message);
        if (err.response) {
            console.error("Response status:", err.response.status);
            console.error("Response data:", err.response.data);
        }
    }
}

module.exports = fetchNewsArticles;
