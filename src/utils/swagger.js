const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Code-Scope REST API Document",
    version: "1.0.0",
    description:
      "This platform is designed to be a comprehensive hub for programmers and developers to share knowledge, write articles, and collaborate on various programming topics.Users can register, log in, and interact with content like articles and comments seamlessly.The goal is to build a user-friendly environment that supports learning, discussion, and sharing in the developer community.",
  },

  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      accessToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = { swaggerDefinition, apis: ["./docs/v1/*.yaml"] };

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
