const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Portfolio Management API',
      version: '1.0.0',
      description: "this is the API documentation for the financial portfolio management system",
    },
    servers: [
      {
        url: 'http://localhost:3000',  // 注意这里要和你的PORT一致
      }
    ],
  },
  apis: ['./src/routes/*.js']  // 确保路径正确
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerDocs, swaggerUi };