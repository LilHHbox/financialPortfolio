const portfoliosModel = require('../models/portfolioModel');

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

// 计算预期收益率
// 简化的收益计算：所有股票比例之和
const calculateExpectedReturn = (stocks) => {
  return stocks.reduce((sum, stock) => sum + stock.ratio, 0);
};

//简化的风险计算：所有股票比例的乘积
const calculateExpectedVolatility = (stocks) => {
  return stocks.reduce((product, stock) => product * stock.ratio, 1);
};

const updatePortfolio = async (id, portfolioName, details) => {
  // 1. 参数校验
  if (typeof id !== 'number' || Number.isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    throw new Error('Invalid portfolio ID (must be a positive integer)');
  }
  if (typeof portfolioName !== 'string' || portfolioName.trim () === '' || portfolioName.length > 255) {
    throw new Error ('portfolioName must be a non-empty string and its length must not exceed 255');
  }
  if (!details || !details.stocks || !Array.isArray(details.stocks) || details.stocks.length === 0) {
    throw new Error('details must contain a non-empty stocks array');
  }
  // 校验每个股票是否包含code和ratio
  details.stocks.forEach((stock, index) => {
    if (!stock.code || typeof stock.ratio !== 'number' || stock.ratio <= 0) {
      throw new Error(`${index+1}Only stock format error (must include code and positive ratio)`);
    }
  });

  // 2. 计算预期收益和风险
  const expectedReturn = calculateExpectedReturn(details.stocks);
  const expectedVolatility = calculateExpectedVolatility(details.stocks);

  // 3. 调用模型层更新数据库
  const isUpdated = await portfoliosModel.updatePortfolioById(
    id,
    portfolioName.trim (), // 去除首尾空格后存入
    details,
    expectedReturn,
    expectedVolatility
  );

  if (!isUpdated) {
    throw new Error('The update failed. It is possible that the ID does not exist');
  }

  // 4. 返回计算结果
  return {
    expected_return: parseFloat(expectedReturn.toFixed(4)), // 保留4位小数
    expected_volatility: parseFloat(expectedVolatility.toFixed(4))
  };
};


module.exports = { 
    deletePortfolioById,
    updatePortfolio
};