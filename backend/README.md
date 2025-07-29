##

Database init
```bash
# 首次启动
docker compose up --build -d

# 以后每次启动（已有数据卷时）
docker compose up -d
```

how to run
```bash
#切换到backend目录下
cd backend
#执行以下命令
node src/app.js
```

current url
```bash
#swagger
http://localhost:3000/api-docs
#getStockPricewithId
http://localhost:3000/api/stocks/getStockInfoList/:stockCode
#getAllPortfolios
http://localhost:3000/api/portfolios/
```