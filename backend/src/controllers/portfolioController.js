const portfolioService = require('../services/portfolioService');

const deletePortfolio = async (req, res) => {
    try {
        // 从请求参数中获取ID
        const {id} = req.params;
        //转为数字
        const portfolioId = Number(id);

        // 调用服务层方法删除投资组合
        const isDeleted = await portfolioService.deletePortfolioById(portfolioId);

        //返回restful状态码
        if(isDeleted) {
            return res.sendStatus(204); // 成功删除
        }else{
            return res.sendStatus(404); // 资源未找到
        }
    } catch (error) {
        
        // 处理异常情况
        if(error.message.includes('Invalid portfolio ID')){
            return res.sendStatus(400); // 参数错误
        }
        console.error('Deletion failed', error);
        return res.sendStatus(500); // 服务器错误
    }
};


const updatePortfolio = async (req, res) => {
  try {
    // 1. 获取路径参数id和请求体details
    const { id } = req.params;
    const portfolioId = Number(id);
    // 从请求体中获取 portfolioName 和 details（新增 portfolioName）
    const {portfolioName, details} = req.body;

    // 2. 调用服务层执行更新
    const result = await portfolioService.updatePortfolio(portfolioId, portfolioName, details);

    // 3. 返回200和计算结果
    res.status(200).json(result);
  } catch (error) {
    // 4. 错误处理
    if (error.message.includes('Invalid') || error.message.includes('Format error') || error.message.includes('portfolioName')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('ID does not exist')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('Failed to update the portfolio', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
    deletePortfolio,
    updatePortfolio
};