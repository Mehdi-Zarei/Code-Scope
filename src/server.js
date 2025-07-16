require("dotenv").config();
const app = require("./app");
const connectToDatabase = require("./configs/db");
const { connectRedis } = require("./configs/redis");

const startServer = async (app, port) => {
  try {
    await Promise.all([connectToDatabase(), connectRedis()]);

    app.listen(port, () => {
      console.log(`🚀 Server is up and running at: ${process.env.DOMAIN}`);
      console.log(`🚀 Swagger Documentation: ${process.env.DOMAIN}/apis/v1/swagger`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer(app, process.env.PORT || 4000);
