const pool = require('../db'); //使用项目已有的数据库连接池

const deletePortfolioById = async (id) => {
    const sql = 'DELETE FROM portfolio WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows; // 直接返回受影响的行数
};  


const updatePortfolioById = async (id, portfolioName, details, expectedReturn, expectedVolatility) => {
    const sql = 'UPDATE portfolio SET portfolioName = ?, details = ?, expected_return = ?, expected_volatility = ?, updated_at = CURRENT_TIMESTAMP  WHERE id = ?';
    // 将details对象转化为json字符串（因为数据库中details是一个json类型）
    const [result] =await pool.query(
        sql, [portfolioName, JSON.stringify(details), expectedReturn, expectedVolatility, id]
    );
    return result.affectedRows === 1; // 返回是否更新成功
};


module.exports = {
    deletePortfolioById,
    updatePortfolioById
};
