const { getLatestNews } = require('../services/newsService');

async function fetchLatestNews(req, res) {
    try {
        const newsList = await getLatestNews();
        res.json({ success: true, data: newsList });
    } catch (err) {
        console.error('Fetch latest news error:', err);
        res.status(500).json({ success: false, message: '获取最新新闻失败' });
    }
}

module.exports = {
    fetchLatestNews,
};
