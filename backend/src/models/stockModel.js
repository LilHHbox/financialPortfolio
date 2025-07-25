// src/models/stockModel.js
const db = require('../db');
const validCodes = [
    'sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'
];

class StockModel {
    /** 按指定日期查 */
    static async getStockDataFromSource(code, date) {
        //check if code is in the code list
        if (!validCodes.includes(code)) {
            throw new Error(`Invalid stock code: ${code}`);
        } else {
            const [rows] = await db.query(
                `SELECT ts AS datetime, open, high, low, close, volume
           FROM stock_price
           WHERE code = ? AND DATE(ts) = ?
           ORDER BY ts ASC`,
                [code, date]
            );
            return rows;

        }

    }

    /** 最近一天 */
    static async getStockDataFromLatest(code) {
        //check if code is in the code list
        if (!validCodes.includes(code)) {
            throw new Error(`Invalid stock code: ${code}`);
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
}
module.exports = StockModel;