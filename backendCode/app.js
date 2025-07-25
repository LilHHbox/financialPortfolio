const express = require('express');
const stockRoutes=require('./routes/stockRoutes');

const app=express( );
app.use(express.json());
app.use('/api/stocks',stockRoutes);

const PORT=3000;
app.listen(PORT,()=>{console.log(`服务器已启动：http://localhost:${PORT}`)});


