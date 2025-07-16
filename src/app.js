const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//* Import Files
const { corsOptions } = require("./middleware/corsOptions");
const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./module/auth/v1/auth.routes");

//* Swagger Doc
const { swaggerUi, swaggerSpec } = require("./utils/swagger.js");

//* Built-in Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(cors(corsOptions));
app.use(cookieParser());

//* Import Routes

app.use("/api/v1/auth", authRoutes);
app.use("/apis/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "متاسفیم!صفحه مورد نظر یافت نشد." });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
