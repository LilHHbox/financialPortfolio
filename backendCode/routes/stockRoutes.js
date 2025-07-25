const expess=require('express');
const router=expess.Router();//创建路由实例
const stockController=require('../controllers/stockController');//引入控制层


//定义get清秀，路径/：stockCode
//当访问/api/stock/60000时，会执行stock Controller.getStockData方法
router.get('/getStockInfList/:stockCode',stockController.getStockData);


router.post('/calReward',stockController.calReward);
//到处路由，给app.js挂载
module.exports=router;