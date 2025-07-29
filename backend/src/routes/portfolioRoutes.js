const express  = require('express');
const router   = express.Router(); // 创建路由实例  
const portfolioController = require('../controllers/portfolioController'); // 引入控制层

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     summary: get all portfolios
 *     description: return a all portfolios with name and id
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
 *       500:
 *         description: server side error
 */

// 定义获取所有投资组合的路由
router.get('/', portfolioController.getAllPortfolios);
// 定义删除投资组合的路由
router.delete('/:id', portfolioController.deletePortfolio);
// 定义更新投资组合的路由
router.put('/:id', portfolioController.updatePortfolio);
module.exports = router; // 导出路由，供 app.js 挂载使用
