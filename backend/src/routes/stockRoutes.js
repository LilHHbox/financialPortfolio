const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

/**
 * @swagger
 * /getStockInfoList/{stockCode}:
 *   get:
 *     summary: 获取该只股票每五分钟相关数据
 *     description: 根据股票代码,返回当天每隔五分钟的股价记录
 *     parameters:
 *       - in: path
 *         name: stockCode
 *         required: true
 *         schema:
 *           type: string
 *         description: 股票代码
 *     responses:
 *       200:
 *         description: 成功返回,股票区分钟的列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         example: "2025-07-26 09:35:00"
 *                       open:
 *                         type: number
 *                         example: 284.17
 *                       high:
 *                         type: number
 *                         example: 285.10
 *                       close:
 *                         type: number
 *                         example: 283.05
 *                       volume:
 *                         type: number
 *                         example: 342342
 *       400:
 *         description: 股票代码无效
 *       404:
 *         description: 未找到该股票数据
 */
router.get('/getStockInfoList/:stockCode', stockController.getStockData);
router.post('/calReward', stockController.calReward);

module.exports = router;