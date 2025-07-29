const pool = require('../db'); //使用项目已有的数据库连接池

// get all portfolios.name and id from portfolio table
const getAllPortfolios = async () => {
    const sql = 'SELECT id, portfolioName FROM portfolio';
    const [rows] = await pool.query(sql);
    return rows; // 返回所有投资组合的id和name
};

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


const  savePortfolioResult = async (stocks, reward, risk,name) => {


        try {
            // 直接使用已有的 db 连接执行查询，和 getStockDataFromSource 保持一致
            const [result] = await pool.query(
                `INSERT INTO portfolio 
                 (details, expected_return, expected_volatility, created_at,portfolioName) 
                 VALUES (?, ?, ?, NOW(),?)`,
                [
                    JSON.stringify(stocks),  // 存储股票配置详情
                    parseFloat(reward),  // 保留5位小数
                    parseFloat(risk),     // 保留5位小数
                    name
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error('存储投资组合结果失败:', error);
            throw new Error(`数据库操作失败: ${error.message}`);
        }
        // 因为使用的是连接池（pool），不需要手动关闭连接，连接池会自动管理连接的复用和释放
};

const validCodes = [
    'sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'
];
const codeNameMap = {
    'sh600519': '贵州茅台',
    'sz000858': '五粮液',
    'sz300750': '宁德时代',
    'sz002594': '比亚迪',
    'sh601012': '隆基绿能',
    'sz002371': '北方华创',
    'sh688981': '中芯国际',
    'sh600030': '中信证券',
    'sh600036': '招商银行',
    'sh601318': '中国平安',
    'sh600276': '恒瑞医药',
    'sz300760': '迈瑞医疗',
    'sz000333': '美的集团',
    'sh600588': '用友网络',
    'sz002415': '海康威视',
    'sh600031': '三一重工',
    'sh600900': '长江电力',
    'sz002352': '顺丰控股',
    'sh600309': '万华化学',
    'sz002475': '立讯精密'
};


const  getStockDataFromLatest= async(code) => {
    //check if code is in the code list 
      //check if code is in the code list
        if (!validCodes.includes(code)) {
            return null;
        } else {
            const [rows] = await pool.query(
                `SELECT ts AS datetime, open, high, low, close, volume
       FROM stock_price
       WHERE code = ?
         AND DATE(ts) = (
           SELECT DATE(MAX(ts)) FROM stock_price WHERE code = ?
         )
       ORDER BY ts ASC`,
                [code, code]
            );
            
            return rows;
        }
};


module.exports = {
    getAllPortfolios,
    deletePortfolioById,
    updatePortfolioById,
    savePortfolioResult,
    getStockDataFromLatest
};
