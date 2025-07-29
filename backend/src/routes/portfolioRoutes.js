const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

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
 *                           example: 0.5
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

module.exports = router;
