const stockModel=require('../models/stockModel');
//业务层函数：获取股票10天数据的逻辑

exports.fetchStockData=async(stockCode)=>{
    console.log('90');
    //调用Model层，获取原始数据（这里模拟对接第三方接口/数据库）
    const rawData=await stockModel.getStockDataFromSource(stockCode);
    //业务逻辑处理：比如筛选10填数据、格式化、校验
    //假设 rawData是数组，取最后10条
    // const tenDayData=rawData(-10);

    //返回处理后的数据给控制层
    return rawData;
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