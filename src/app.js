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
const userRoutes = require("./module/user/v1/user.routes.js");
const articleRoutes = require("./module/article/v1/article.route.js");
const commentRoutes = require("./module/comment/v1/comment.routes.js");
const { redirectToArticlePage } = require("./module/article/v1/shortIdentifier.controller.js");

//* Swagger Doc
const { swaggerUi, swaggerSpec } = require("./utils/swagger.js");

//* Built-in Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "..", "public")));

//* Import Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/comments", commentRoutes);
app.get("/api/v1/p/:shortIdentifier", redirectToArticlePage);
app.use("/apis/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* 404 handler for API routes (must come BEFORE the SPA catch-all)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "صفحه مورد نظر یافت نشد." });
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
