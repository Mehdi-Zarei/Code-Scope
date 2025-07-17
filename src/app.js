const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//* Import Files
const frontendPath = path.join(__dirname, "..", "public", "index.html");
const { corsOptions } = require("./middleware/corsOptions");
const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./module/auth/v1/auth.routes");

//* Swagger Doc
const { swaggerUi, swaggerSpec } = require("./utils/swagger.js");

//* Built-in Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

//* Import Routes
app.use("/api/v1/auth", authRoutes);
app.use("/apis/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* 404 handler for API routes (must come BEFORE the SPA catch-all)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  next();
});

//* SPA - serve index.html for all other routes (non-API)
// app.get("*", (req, res) => {
//   res.sendFile(frontendPath);
// });

//* Global Error Handler
app.use(errorHandler);

module.exports = app;
