// src/models/stockModel.js
const db = require('../db');
const validCodes = [
    'sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'
];
const codeNameMap = {
    'sh600519': 'Kweichow Moutai',
    'sz000858': 'Wuliangye',
    'sz300750': 'CATL (Contemporary Amperex Technology Co., Limited)',
    'sz002594': 'BYD (Build Your Dreams)',
    'sh601012': 'Longi Green Energy Technology',
    'sz002371': 'Naura Technology Group',
    'sh688981': 'SMIC (Semiconductor Manufacturing International Corporation)',
    'sh600030': 'CITIC Securities',
    'sh600036': 'China Merchants Bank',
    'sh601318': 'Ping An Insurance (Group) Company of China',
    'sh600276': 'Hengrui Medicine',
    'sz300760': 'Mindray Medical International Limited',
    'sz000333': 'Midea Group',
    'sh600588': 'Yonyou Network Technology',
    'sz002415': 'Hikvision Digital Technology',
    'sh600031': 'Sany Heavy Industry',
    'sh600900': 'Yangtze Power',
    'sz002352': 'SF Holding',
    'sh600309': 'Wanhua Chemical Group',
    'sz002475': 'Luxshare Precision Industry'
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
                `SELECT  ts   AS datetime,
               open, high, low, close, volume
               FROM    stock_price
               WHERE   code = ?                       
             AND   DATE(ts) = (                  
              SELECT DISTINCT DATE(ts)      
              FROM   stock_price
              WHERE  code = ?
              ORDER  BY DATE(ts) DESC
              LIMIT  1 OFFSET 1             
            )
            ORDER BY ts ASC;`,
                [code, code]
            );

            return rows;
        }
    }
    static savePortfolioResult = async (stocks, reward, risk, name) => {


        try {
            // 直接使用已有的 db 连接执行查询，和 getStockDataFromSource 保持一致
            const [result] = await db.query(
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