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

module.exports = { deletePortfolioById };