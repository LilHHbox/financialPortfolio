const stockModel=require('../models/stockModel');

// Fetch stock data for a specific stock code
exports.fetchStockData = async (stockCode) => {



    
    const today = new Date().toISOString().slice(0, 10);
    // get the stock data for today
    let data = await stockModel.getStockDataFromSource(stockCode, today);
    if (!data || data.length === 0) {
        // if no data for today, get the latest available data
        data = await stockModel.getStockDataFromLatest(stockCode);
    }
    return data;
};

//{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3}=stocks
exports.createProfolio = async (stocks) => {
    //总收益
  
    const {totalReward, totalRisk}= calRewardAndRisk(stocks)
    const portfolioId = await stockModel.savePortfolioResult(stocks, totalReward, totalRisk);
     
    return { 
        portfolioId,
        reward: parseFloat(totalReward.toFixed(6)),  // 保留6位小数
        risk: parseFloat(totalRisk.toFixed(6))       // 保留6位小数
    };

}

exports.calRewardAndRisk = async (stocks) => {
    //总收益
    if (!Array.isArray(stocks) || stocks.length === 0) {
        throw new Error('请提供有效的股票配置数组');
    }
    
    let totalReward = 0;  // 组合总收益
    let totalRisk = 0;    // 组合总风险
    const stockReturns = [];  // 存储单只股票收益率，用于后续风险计算
    const weights = [];    // 存储权重

    for (const stock of stocks) {
        // 验证单只股票的必要参数
        // if (!stock.stockCode || typeof stock.ratio !== 'number' || stock.ratio <= 0) {
        //     throw new Error(`股票${stock.stockCode || '未知'}配置错误，需包含有效的stockCode和ratio`);
        // }
        const holdingDays = 30;
        const { stockCode, ratio } = stock;
       
        const rows = await stockModel.getStockDataFromLatest(stockCode, holdingDays);
     
        if (!rows || rows.length < 2) {
            return null;
        }
      
        // 按时间顺序排列（最早到最新）
        const sortedRows = [...rows].sort((a, b) => new Date(a.date) - new Date(b.date));
        const closes = sortedRows.map(row => row.close);

        // 计算单只股票收益：持有期收益率
        const startPrice = closes[0];
        const endPrice = closes[closes.length - 1];
        const stockReward = (endPrice - startPrice) / startPrice;

        // 存储收益率和权重，用于后续风险计算
        stockReturns.push(stockReward);
        weights.push(ratio);

        // 累加加权收益
        totalReward += stockReward * ratio;
    }

    // 计算组合风险（基于收益率的标准差）
    // 1. 计算平均收益率
    const avgReturn = stockReturns.reduce((sum, ret) => sum + ret, 0) / stockReturns.length;
    
    // 2. 计算方差
    const variance = stockReturns.reduce((sum, ret) => {
        return sum + Math.pow(ret - avgReturn, 2);
    }, 0) / (stockReturns.length - 1);
    
    // 3. 计算标准差（总风险），并结合权重调整
    totalRisk = Math.sqrt(variance) * (weights.reduce((sum, w) => sum + w, 0) / weights.length);
    
   
    return { 
        reward: parseFloat(totalReward.toFixed(6)),  // 保留6位小数
        risk: parseFloat(totalRisk.toFixed(6))       // 保留6位小数
    };

}