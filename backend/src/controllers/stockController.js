const stockService=require('../services/stockService');

//控制层函数，，处理“获取股票数据”的请求
exports.getStockData=async(req,res)=>{
    // try{
        //从请求菜属中获取股票代码stockCode
        const stockCode=req.params.stockCode;
        const stockCodeRegex = /^[a-z]{2}\d{6}$/;
        if (!stockCodeRegex.test(stockCode)) {
            return res.status(400).json({
                success: false,
                message: '股票代码无效，需为两位小写字母加6个数字格式'
            });
        }
 
        //调用Service层的业务逻辑，传入股票代码，获取数据
        const data=await stockService.fetchStockData(stockCode);
        if (!data) { 
            return res.status(404).json({
                success: false,
                message: '未找到该股票数据'
            });
        }
        res.status(200).json({
            success:true,
            data:data,
            message:'股票数据获取成功'
        });

    // }catch(error){
        
    //         res.status(500).json({
    //         success:false,
        
    //         message:'股票数据获取失败'
    //     });
    // }
};
exports.calReward=async(req,res)=>{
    try{
        //从请求菜属中获取股票代码stocks
       //stocks示例
       //json
       //{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3}
        const {stocks}=req.body;

        if(!stocks||stocks.length!==3)
        {
            throw new Error('请传入3只股票的代码和比例')
        }
        stocks.forEach((stock,index) => {
            if(!stock.stockCode||typeof stock.stockCode!=='string'){
                throw new Error('股票代码格式错误');
            }
            
        });
        const totalRatio=stocks.reduce((sum,stock)=>sum+stock.ratio,0);
        if(Math.abs(totalRatio-1)>0.01){
            throw new Error('三只股票比例综合必须为1');
        }

        //调用Service层的业务逻辑，传入股票代码，获取数据
        const result=await stockService.calReward(stocks);
        res.status(200).json({
            success:true,
            message:'收益计算成功',
            data:{totalReturn:result.totalReturn,//总收益
                stocks:stocks.result.stocks}
        });


    }catch(error){
        
            res.status(500).json({
            success:false,
        
            message:'计算失败'
        });
    }
};