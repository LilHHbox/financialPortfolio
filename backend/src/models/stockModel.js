// src/models/stockModel.js
const db = require('../db');

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
    

}
module.exports = StockModel;
// module.exports = {
//     savePortfolioResult
// };