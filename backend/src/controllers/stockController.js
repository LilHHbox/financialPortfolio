const stockService=require('../services/stockService');
const express = require('express');
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const validCodes = [
    'sh600519', 'sz000858', 'sz300750', 'sz002594',
    'sh601012', 'sz002371', 'sh688981', 'sh600030', 'sh600036',
    'sh601318', 'sh600276', 'sz300760', 'sz000333', 'sh600588',
    'sz002415', 'sh600031', 'sh600900', 'sz002352', 'sh600309',
    'sz002475'
];


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
exports.createProfolio=async(req,res)=>{
    try{
        //从请求菜属中获取股票代码stocks
       //stocks示例
       //json
       //{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3},{stock Code：'ASA',RATIO:0.3}
        const {stocks}=req.body;

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
       
        const result=await stockService.createProfolio(stocks);
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