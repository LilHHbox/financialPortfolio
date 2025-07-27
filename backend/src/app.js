const express = require('express');
require('dotenv').config();
const stockRoutes=require('./routes/stockRoutes');
const portfolioRoutes=require('./routes/portfolioRoutes');
const cors = require('cors');

// Importing the cron package to schedule tasks
const cron = require('node-cron');          

const bodyParser = require('body-parser');
const fetchAndSave = require('./jobs/fetchPrice'); 



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/stocks',stockRoutes);
//用资源复数形式（portfolios）表示资源集合
app.use('/api/portfolios',portfolioRoutes);


// Schedule a cron job to run every 5 minutes from 9 AM to 3 PM, Monday to Friday
// cron.schedule('*/5 9-15 * * 1-5', () => {
cron.schedule('* * * * *', () => {

    console.log('Running scheduled task to fetch and save stock prices...');
    fetchAndSave();
}, { timezone: 'Asia/Shanghai' });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});