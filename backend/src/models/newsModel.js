const db = require('../db');

/**
 * 查询数据库中最新的日期（只含年月日部分，格式YYYY-MM-DD）
 * @returns {Promise<string|null>} 最新日期字符串，找不到返回null
 */
async function getLatestDate() {
    const sql = `
    SELECT DATE(MAX(date)) AS latestDate FROM market_news
  `;
    const [rows] = await db.query(sql);
    return rows[0]?.latestDate || null;
}

/**
 * 查询指定日期的所有新闻
 * @param {string} dateStr - 格式 'YYYY-MM-DD'
 * @returns {Promise<Array>}
 */
async function getNewsByDate(dateStr) {
    const sql = `
    SELECT * FROM market_news
    WHERE DATE(date) = ?
    ORDER BY date DESC
  `;
    const [rows] = await db.query(sql, [dateStr]);
    return rows;
}

module.exports = {
    getLatestDate,
    getNewsByDate,
};
