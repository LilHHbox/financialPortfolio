const axios = require('axios');
const db = require('../db');   

//tock symbols to fetch
//stock name list:
// [贵州茅台,五粮液,宁德时代,比亚迪,
// 隆基绿能,北方华创,中芯国际,中信证券,招商银行,
// 中国平安,恒瑞医药,迈瑞医疗,美的集团,用友网络,
// 海康威视,三一重工,长江电力,顺丰控股,万华化学,
// 立讯精密]
const symbols = ['sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'];

const urlTpl = s =>
    `http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${s}&scale=5&ma=no&datalen=100`;

async function fetchAndSave() {
    for (const code of symbols) {
        try {
            const { data } = await axios.get(urlTpl(code), { timeout: 8000 });
            if (!Array.isArray(data) || data.length === 0) continue;

            const rows = data.map(k => [
                code,
                k.day,
                parseFloat(k.open),
                parseFloat(k.high),
                parseFloat(k.low),
                parseFloat(k.close),
                parseInt(k.volume, 10)
            ]);

            const sql = `
                INSERT IGNORE INTO stock_price
                    (code, ts, open, high, low, close, volume)
                VALUES ?
            `;
            await db.query(sql, [rows]);
            console.log(`${code} ✔ ${rows.length} rows saved`);
        } catch (e) {
            console.error(`${code} ✘ ${e.message}`);
        }
    }
}

module.exports = fetchAndSave;