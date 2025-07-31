const { getLatestDate, getNewsByDate } = require('../models/newsModel');

async function getLatestNews() {
  const latestDate = await getLatestDate();
  if (!latestDate) {
    // 数据库没新闻，返回空数组
    return [];
  }
  return await getNewsByDate(latestDate);
}

module.exports = {
  getLatestNews,
};
