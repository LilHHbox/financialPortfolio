//模型层，负责实际的数据获取（这里模拟对接第三方接口/数据库）
//实际开发中，可能是查数据库


exports.getStockDataFromSource=
async (stockCode)=>{
    const mockData=[
        {
        time:'2021-0101',price:100
        }
    ];
    return mockData;
};




// module.exports = {
//     getStockDataFromSource
// };