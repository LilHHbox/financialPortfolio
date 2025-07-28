// src/models/stockModel.js
const db = require('../db');
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
class StockModel {
    /** 按指定日期查 */
    static async getStockDataFromSource(code, date) {
        //check if code is in the code list
    
            const [rows] = await db.query(
                `SELECT ts AS datetime, open, high, low, close, volume
           FROM stock_price
           WHERE code = ? AND DATE(ts) = ?
           ORDER BY ts ASC`,
                [code, date]
            );
            return rows;

        

    }

    /** 最近一天 */
    static async getStockDataFromLatest(code) {
        //check if code is in the code list
        if (!validCodes.includes(code)) {
            return null;
        } else {
            const [rows] = await db.query(
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
    }
    static  savePortfolioResult = async (stocks, reward, risk) => {
        try {
            // 直接使用已有的 db 连接执行查询，和 getStockDataFromSource 保持一致
            const [result] = await db.query(
                `INSERT INTO portfolio 
                 (details, expected_return, expected_volatility, created_at) 
                 VALUES (?, ?, ?, NOW())`,
                [
                    JSON.stringify(stocks),  // 存储股票配置详情
                    parseFloat(reward.toFixed(5)),  // 保留5位小数
                    parseFloat(risk.toFixed(5))     // 保留5位小数
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error('存储投资组合结果失败:', error);
            throw new Error(`数据库操作失败: ${error.message}`);
        }
        // 因为使用的是连接池（pool），不需要手动关闭连接，连接池会自动管理连接的复用和释放
    };
    static async getAllStockData(timeStep) {
        //check if code is in the code list
       
            const [rows] = await db.query(
                `SELECT code, close
                FROM stock_price
                WHERE ts = ?
                  
                  `,
       [timeStep]
            );
        const result = rows.map(row => ({
                stockCode: row.code,
                chineseName: codeNameMap[row.code], // 根据 code 映射中文名称
                close: row.close
            }));    
            return result;
        
    }
    

}
module.exports = StockModel;
// module.exports = {
//     savePortfolioResult
// };