function setRoutes(app) {
    const IndexController = require('../controllers/index');
    const indexController = new IndexController();

    app.get('/api/portfolio', indexController.getPortfolio.bind(indexController));
    app.put('/api/portfolio', indexController.updatePortfolio.bind(indexController));
}

module.exports = setRoutes;