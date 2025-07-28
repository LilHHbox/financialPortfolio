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
exports.calReward = async (stocks) => {
    //总收益
    let totalReturn = 0;
    for(const stock of stocks){
        const {stockCode, ratio} = stock;
        //从数据库中获取对应的股票价格
        const price = await stockModel.getStockPrice(stockCode);
        //计算收益的简单逻辑
        const stockReturn = price * ratio;
        totalReturn += stockReturn;
    }
    return totalReturn;
}
// module.exports = {
//     calReward
// };