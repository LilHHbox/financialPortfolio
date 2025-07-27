const pool = require('../db'); //使用项目已有的数据库连接池

const deletePortfolioById = async (id) => {
    const sql = 'DELETE FROM portfolio WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows; // 直接返回受影响的行数
};  


module.exports = {deletePortfolioById};