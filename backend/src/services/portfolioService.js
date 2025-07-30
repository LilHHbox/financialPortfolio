const portfoliosModel = require('../models/portfolioModel');

// get all portfolios
const getAllPortfolios = async () => {
    // calling model layer method to fetch all portfolios
    const portfolios = await portfoliosModel.getAllPortfolios();
    return portfolios;
}

// get portfolio by id
const getPortfolioById = async (id) => {
    // validate the id, must be a positive integer
    if (typeof id !== 'number' || id <= 0 || Number.isNaN(id) || !Number.isInteger(id)) {
        throw new Error('Invalid portfolio ID');
    }
    // calling model layer method to fetch portfolio details
    const portfolio = await portfoliosModel.getPortfolioById(id);
    return portfolio; 
};

const deletePortfolioById = async (id) => {
    // 校验
    // 确保ID是一个正整数（非数字、0、负数、NaN、非整数等全部排除在外）
    if(typeof id !== 'number' || id <= 0 || Number.isNaN(id) || !Number.isInteger(id)) {
        throw new Error('Invalid portfolio ID');
    }

    //调用模型层方法
    const affectedRows = await portfoliosModel.deletePortfolioById(id);

    //业务判断
    return affectedRows === 1;
};



const updatePortfolio = async (id, name, details) => {
  // 1. 参数校验
  if (typeof id !== 'number' || Number.isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    throw new Error('Invalid portfolio ID (must be a positive integer)');
  }
  if (typeof name !== 'string' || name.trim () === '' || name.length > 255) {
    throw new Error ('portfolioName must be a non-empty string and its length must not exceed 255');
  }
  // 3. 校验details（新格式：必须是数组且非空）
  if (!Array.isArray(details) || details.length === 0) {
    throw new Error('details must be a non-empty array');
  }

  // 4. 校验数组中每个股票的格式（stockCode和ratio）
  details.forEach((stock, index) => {
    if (!stock.stockCode || typeof stock.ratio !== 'number' || stock.ratio <= 0) {
      throw new Error(`Stock at index ${index} is invalid (requires stockCode and positive ratio)`);
    }
  });
 
  // 2. 计算预期收益和风险
  const { totalReward, totalRisk } = await exports.calRewardAndRisk(details);  // ✅ 正确写法（直接调用函数）
  const expectedReturn = totalReward.toFixed(5);// 保留5位小数
  const expectedVolatility = totalRisk.toFixed(5);// 保留5位小数
  // const expectedReturn = calculateExpectedReturn(details);
  // const expectedVolatility = calculateExpectedVolatility(details);

  // 3. 调用模型层更新数据库
  const isUpdated = await portfoliosModel.updatePortfolioById(
    id,
    name.trim (), // 去除首尾空格后存入
    details,
    expectedReturn,
    expectedVolatility
  );

  if (!isUpdated) {
    throw new Error('The update failed. It is possible that the ID does not exist');
  }

  // 4. 返回计算结果
  return {"data":{
    reward: expectedReturn, // 保留4位小数
    risk: expectedVolatility
  }};
};



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
       
        const rows = await portfoliosModel.getStockDataFromLatest(stockCode, holdingDays);
     
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
        totalReward,  // 保留6位小数
        totalRisk     // 保留6位小数
    };

}



//{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3}=stocks
const createPortfolio = async (name,stocks) => {
    //总收益
  
    const { totalReward, totalRisk } = await exports.calRewardAndRisk(stocks);  // ✅ 正确写法（直接调用函数）
    const formattedReward = totalReward.toFixed(5);// 保留5位小数
    const formattedRisk = totalRisk.toFixed(5);// 保留5位小数
    const portfolioId = await portfoliosModel.savePortfolioResult(stocks, formattedReward, formattedRisk,name);
     
    return { 
        portfolioId,
        formattedReward,  
        formattedRisk      
    };

}

module.exports = { 
    getAllPortfolios,
    getPortfolioById,
    deletePortfolioById,
    updatePortfolio,
    createPortfolio
};