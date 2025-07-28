const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '股票API文档',
      version: '1.0.0',
      description: "获取股票五分钟数据的接口文档"
    },
    servers: [
      {
        url: 'http://localhost:3000',  // 注意这里要和你的PORT一致
      }
    ],
  },
  apis: ['./routes/*.js']  // 确保路径正确
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerDocs, swaggerUi };