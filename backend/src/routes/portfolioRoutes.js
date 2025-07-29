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
// 定义删除投资组合的路由
router.delete('/:id', portfolioController.deletePortfolio);
// 定义更新投资组合的路由
router.put('/:id', portfolioController.updatePortfolio);
module.exports = router; // 导出路由，供 app.js 挂载使用
