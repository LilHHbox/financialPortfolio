const express = require('express');
const router = express.Router();
const { fetchLatestNews } = require('../controllers/newsController');

router.get('/', fetchLatestNews);
console.log('fetchLatestNews is', fetchLatestNews);


module.exports = router;
