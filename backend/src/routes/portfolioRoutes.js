const express = require('express');
const router = express.Router(); // 创建路由实例  
const portfolioController = require('../controllers/portfolioController'); // 引入控制层

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     summary: get all portfolios
 *     description: return a all portfolios with name and id
 *     tags:
 *       - get all portfolios
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   portfolioName:
 *                     type: string
 *                     example: portfolio1
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: server side error
 */
// 定义获取所有投资组合的路由
router.get('/', portfolioController.getAllPortfolios);
/**
 * @swagger
 * /api/portfolios/{id}:
 *   get:
 *     summary: get portfolio by id
 *     description: return a portfolio by id
 *     tags:
 *       - get portfolio details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: portfolio id
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 portfolioName:
 *                   type: string
 *                   example: portfolio1
 *                 details:
 *                   type: array
 *                   description: Portfolio details including codes and ratios
 *                   items:
 *                     type: object
 *                     required: [stockCode, ratio]
 *                     properties:
 *                       stockCode:
 *                         type: string
 *                         example: sh600030
 *                       ratio:
 *                         type: number
 *                         format: float
 *                         example: 0.3
 *                 expected_return:
 *                   type: number
 *                   format: float
 *                   example: 0.07
 *                 expected_volatility:
 *                   type: number
 *                   format: float
 *                   example: 0.15
 *       400:
 *         description: Invalid portfolio ID
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: server side error
 */
// 定义获取某个投资组合的路由
router.get('/:id', portfolioController.getPortfolioById);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   delete:
 *     summary: Delete a portfolio by ID
 *     description: Remove the specified portfolio record from the database using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Portfolio ID (positive integer)
 *     responses:
 *       204:
 *         description: Portfolio deleted successfully (no content)
 *       400:
 *         description: Invalid ID (not a positive integer)
 *       404:
 *         description: Portfolio with specified ID not found
 *       500:
 *         description: Internal server error
 */

// 定义删除投资组合的路由
router.delete('/:id', portfolioController.deletePortfolio);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   put:
 *     summary: Update a portfolio by ID
 *     description: Update portfolioName, details, and recalculate expected return and volatility for the specified portfolio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Portfolio ID (positive integer)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portfolioName:
 *                 type: string
 *                 example: "Tech Leader Portfolio"
 *                 description: Portfolio name (non-empty string, max length 255)
 *               details:
 *                 type: object
 *                 required: true
 *                 properties:
 *                   stocks:
 *                     type: array
 *                     required: true
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: "AAPL"
 *                           description: Stock code
 *                         ratio:
 *                           type: number
 *                           format: float
 *                           example: 1
 *                           description: Allocation ratio of the stock in the portfolio (positive number)
 *     responses:
 *       200:
 *         description: Portfolio updated successfully, returns recalculated return and volatility
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expected_return:
 *                   type: number
 *                   format: float
 *                   example: 1.0
 *                 expected_volatility:
 *                   type: number
 *                   format: float
 *                   example: 0.25
 *       400:
 *         description: Invalid parameters (e.g., invalid ID, empty or too long portfolioName, invalid details format)
 *       404:
 *         description: Portfolio with specified ID not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', portfolioController.updatePortfolio);


/**
 * @swagger
 * /api/portfolios/createProfolio:
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
 *               - name
 *               - details
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the portfolio, used to identify and distinguish different portfolios
 *                 example: "My Growth Portfolio"
 *                 minLength: 1
 *                 maxLength: 100
 *               details:
 *                 type: array
 *                 description: Array of stock codes and their weight ratios, the sum of all weights should equal 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - stockCode
 *                     - ratio
 *                   properties:
 *                     stockCode:
 *                       type: string
 *                       description: Unique identifier of the stock (e.g., stock code)
 *                       example: "600036"
 *                       minLength: 1
 *                       maxLength: 20
 *                     ratio:
 *                       type: number
 *                       format: float
 *                       description: Weight ratio of the stock in the portfolio, ranging from 0 to 1
 *                       example: 0.3
 *                       minimum: 0
 *                       maximum: 1
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
 *                 name:
 *                   type: string
 *                   description: Name of the portfolio
 *                   example: "My Growth Portfolio"
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
 *                   examples:
 *                     invalidRatio:
 *                       value: "Invalid stock allocation - please provide valid codes and ratios (0-1 range)"
 *                     sumNotOne:
 *                       value: "Sum of weights must equal 1"
 *                     missingName:
 *                       value: "Portfolio name is required"
 *       404:
 *         description: Stock data not found for one or more codes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Stock data not found for: 600036, 601318"
 *       500:
 *         description: Server error during calculation or storage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     dbError:
 *                       value: "Failed to process portfolio: database connection error"
 *                     calculationError:
 *                       value: "Failed to process portfolio: error occurred during calculation"
 */

router.post('/createProfolio', portfolioController.createProfolio);


module.exports = router;
