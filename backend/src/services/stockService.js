


const stockModel=require('../models/stockModel');

// Fetch stock data for a specific stock code
exports.fetchStockData = async (stockCode) => {

    
    const today = new Date().toISOString().slice(0, 10);
    // get the stock data for today
    // let data = await stockModel.getStockDataFromSource(stockCode, today);
    // if (!data || data.length === 0) {
        // if no data for today, get the latest available data
        data = await stockModel.getStockDataFromLatest(stockCode);
    // }
    return data;
};





exports.fetchAllStockData =async(timeStep)=>{
    

        const result=await stockModel.getAllStockData(timeStep);
        return result;

}