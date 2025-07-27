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
        console.error('删除失败：', error);
        return res.sendStatus(500); // 服务器错误
    }
};
module.exports = { deletePortfolio };