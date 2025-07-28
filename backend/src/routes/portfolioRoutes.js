const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

/**
 * @swagger
 * /api/portfolios/{id}:
 *   delete:
 *     summary: 删除指定ID的投资组合
 *     description: 根据portfolio的ID，从数据库中删除对应的投资组合记录
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: 投资组合的ID（正整数）
 *     responses:
 *       204:
 *         description: 删除成功，无响应体
 *       400:
 *         description: 无效的ID（非正整数）
 *       404:
 *         description: 未找到该ID的投资组合
 *       500:
 *         description: 服务器内部错误
 */
router.delete('/:id', portfolioController.deletePortfolio);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   put:
 *     summary: 更新指定ID的投资组合
 *     description: 根据portfolio的ID，更新其details，并重新计算预期收益和风险
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: 投资组合的ID（正整数）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                           description: 股票代码
 *                         ratio:
 *                           type: number
 *                           format: float
 *                           example: 0.5
 *                           description: 股票在组合中的占比（正数）
 *     responses:
 *       200:
 *         description: 更新成功，返回新计算的收益和风险
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
 *         description: 参数错误（如ID无效、details格式错误）
 *       404:
 *         description: 未找到该ID的投资组合
 *       500:
 *         description: 服务器内部错误
 */
router.put('/:id', portfolioController.updatePortfolio);

module.exports = router;
