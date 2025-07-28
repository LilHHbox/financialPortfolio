const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

/**
 * @swagger
 * /api/stocks/getStockInfoList/{stockCode}:
 *   get:
 *     summary: Fetch stock data at 5-minute intervals
 *     description: Returns intraday stock price records at 5-minute intervals for the specified stock code, including open, high, close prices and trading volume
 *     tags: 
 *       - Stock Data
 *     parameters:
 *       - in: path
 *         name: stockCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "sg091082"
 *         description: Unique stock identifier (e.g., sg091082)
 *     responses:
 *       200:
 *         description: Successful retrieval of stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                   description: Status code indicating success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-26 09:35:00"
 *                         description: End time of the 5-minute interval
 *                       open:
 *                         type: number
 *                         format: float
 *                         example: 284.17
 *                         description: Opening price of the interval
 *                       high:
 *                         type: number
 *                         format: float
 *                         example: 285.10
 *                         description: Highest price in the interval
 *                       close:
 *                         type: number
 *                         format: float
 *                         example: 283.05
 *                         description: Closing price of the interval
 *                       volume:
 *                         type: integer
 *                         example: 342342
 *                         description: Trading volume in the interval (shares)
 *       400:
 *         description: Invalid stock code format
 *       404:
 *         description: No stock data found for the given code
 */
router.get('/getStockInfoList/:stockCode', stockController.getStockData);

/**
 * @swagger
 * /api/stocks/getAllStockInfo:
 *   get:
 *     summary: Get all stock information for the latest trading day
 *     description: Returns stock information for all stocks from the most recent working day, including stock code, Chinese name, and opening price
 *     tags:
 *       - Stock Information
 *     responses:
 *       200:
 *         description: Successfully retrieved all latest stock information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockcode:
 *                     type: string
 *                     description: Stock code identifier
 *                     example: "600000"
 *                   chineseName:
 *                     type: string
 *                     description: Chinese name of the stock
 *                     example: "浦发银行"
 *                   openPrice:
 *                     type: number
 *                     format: float
 *                     description: Opening price from the latest trading day
 *                     example: 8.56
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Failed to retrieve stock information"
 */
router.get('/getAllStockInfo', stockController.getAllStockInfo);

/**
 * @swagger
 * /api/stocks/createProfolio:
 *   post:
 *     summary: Calculate portfolio returns and risk, then store results
 *     description: Computes portfolio expected return and risk metrics using input stock codes and their weight ratios, then persists the results to database
 *     tags:
 *       - Portfolio Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stocks
 *             properties:
 *               stocks:
 *                 type: array
 *                 description: Array of stock allocations with codes and weight ratios
 *                 items:
 *                   type: object
 *                   required:
 *                     - stockCode
 *                     - ratio
 *                   properties:
 *                     stockCode:
 *                       type: string
 *                       description: Unique stock identifier
 *                       example: "600036"
 *                     ratio:
 *                       type: number
 *                       format: float
 *                       description: Weight ratio of the stock in portfolio (0-1)
 *                       example: 0.3
 *     responses:
 *       200:
 *         description: Successful calculation and storage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolioId:
 *                   type: number
 *                   description: Unique identifier of the created portfolio
 *                   example: 123
 *                 reward:
 *                   type: number
 *                   format: float
 *                   description: Expected return rate of the portfolio
 *                   example: 0.052367
 *                 risk:
 *                   type: number
 *                   format: float
 *                   description: Risk rate (volatility) of the portfolio
 *                   example: 0.021543
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid stock allocation - please provide valid codes and ratios (0-1 range)"
 *       404:
 *         description: Stock data not found for one or more codes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Stock data not found for: 600036"
 *       500:
 *         description: Server error during calculation or storage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to process portfolio: database connection error"
 */
router.post('/createProfolio', stockController.createProfolio);




module.exports = router;
