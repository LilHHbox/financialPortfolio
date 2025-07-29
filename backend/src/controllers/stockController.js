const stockService=require('../services/stockService');
const express = require('express');
const app = express();
const dayjs = require('dayjs');
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
        if (!validCodes.includes(stockCode)){
            return res.status(404).json({
                success: false,
                message: '未找到该股票数据'
            });
        }
        //调用Service层的业务逻辑，传入股票代码，获取数据
        const data=await stockService.fetchStockData(stockCode);
     
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
       
        const result=await stockService.createProfolio(name,stocks);
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
exports.getAllStockInfo=async(req,res)=>{
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // 月份 0~11，需 +1
    const day = String(yesterday.getDate()).padStart(2, '0');
    const timeStep = `${year}-${month}-${day} 15:00:00`;
    let targetDate = dayjs(timeStep); // 转为 dayjs 对象
    const dayOfWeek = targetDate.day(); // 获取星期：0(周日) ~ 6(周六)
    // 判断是否为周末：周六(6) 或 周日(0)，则回溯到上周五
    if (dayOfWeek === 6) { // 周六
      targetDate = targetDate.subtract(1, 'day'); // 减1天到周五
    } else if (dayOfWeek === 0) { // 周日
      targetDate = targetDate.subtract(2, 'day'); // 减2天到周五
    }
    // （如需处理法定节假日，可在此处扩展：判断是否在节假日列表，再回溯最近工作日）
    
    // 2. 拼接最终要查询的日期字符串（假设 ts 字段是 DATETIME 或 DATE 类型）
    const queryDate = targetDate.format('YYYY-MM-DD')+ ' 15:00:00';

    console.log(queryDate)
    const result =await stockService.fetchAllStockData(queryDate);
    return res.status(200).json({
        success:true,
        result:result,
        message:'return successful'
        
     
    });

}