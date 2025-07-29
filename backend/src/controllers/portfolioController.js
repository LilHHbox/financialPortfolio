const portfolioService = require('../services/portfolioService');

//get all portfolios
const getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await portfolioService.getAllPortfolios();
        res.status(200).json(portfolios);
        if (portfolios.length === 0) {
            res.status(404).json({ message: 'No portfolios found' });
        }
    } catch (error) {
        console.error('get all portfolios error:', error);
        res.status(500).json({ message: 'server side error' });
    }
};

// get portfolio by id
const getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolioId = Number(id);
        const portfolio = await portfolioService.getPortfolioById(portfolioId);
        res.status(200).json(portfolio);
    } catch (error) {
        if (error.message.includes('Invalid portfolio ID')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('Portfolio not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error('failed to get portfolio by id:', error);
        res.status(500).json({ message: 'server side error' });
    }
};

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


const validCodes = [
    'sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'
];





const createPortfolio=async(req,res)=>{
    try{
        //从请求菜属中获取股票代码stocks
       //stocks示例
       //json
       //{name: dt ;details: [{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3}]}
       const { name, details } = req.body;
    
        const stocks=details;
        const stockCodeRegex = /^[a-z]{2}\d{6}$/;
        if(stocks==null)
        {
            return res.status(400).json({
                success: false,
                message: 'Please submit the stock code and corresponding allocation percentage'
            });
        }

      
        stocks.forEach((stock,index) => {
            const stockCode = stock.stockCode; 
            if (!stockCodeRegex.test(stockCode)){
                return res.status(400).json({
                    success: false,
                    message: 'Invalid stock code format. Required: 2 lowercase letters followed by 6 digits'
                });
            }


            
            if (!validCodes.includes(stockCode)) {
              
                return res.status(404).json({
                    success: false,
                    message: 'Stock data not found'
                });
            }

        });
      
     
        const totalRatio=stocks.reduce((sum,stock)=>sum+stock.ratio,0);
        if(Math.abs(totalRatio-1)>0.01){
            return res.status(400).json({
                success: false,
                message: 'The sum of stock allocation ratios must equal 1 (100%).'
            });
    
        }

        //调用Service层的业务逻辑，传入股票代码，获取数据
       
        const result=await portfolioService.createPortfolio(name,stocks);
        res.status(200).json({
            success:true,
            message:'收益计算成功',
            data:{portfolioId:result.portfolioId,
                reward:result.reward,//总收益
                risk:result.risk}
        });


    }catch(error){
            console.log(error)
            res.status(500).json({
            success:false,
        
            message:'计算失败'
        });
    }
};


module.exports = {
    getAllPortfolios,
    getPortfolioById,
    deletePortfolio,
    updatePortfolio,
    createPortfolio
};