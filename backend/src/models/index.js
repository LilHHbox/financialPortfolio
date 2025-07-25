const PortfolioModel = {
    portfolios: [],

    createPortfolio(portfolio) {
        this.portfolios.push(portfolio);
        return portfolio;
    },

    getPortfolio(id) {
        return this.portfolios.find(portfolio => portfolio.id === id);
    },

    updatePortfolio(id, updatedPortfolio) {
        const index = this.portfolios.findIndex(portfolio => portfolio.id === id);
        if (index !== -1) {
            this.portfolios[index] = { ...this.portfolios[index], ...updatedPortfolio };
            return this.portfolios[index];
        }
        return null;
    },

    deletePortfolio(id) {
        const index = this.portfolios.findIndex(portfolio => portfolio.id === id);
        if (index !== -1) {
            return this.portfolios.splice(index, 1)[0];
        }
        return null;
    },

    getAllPortfolios() {
        return this.portfolios;
    }
};

module.exports = PortfolioModel;