const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`✅ Connected to MongoDB successfully on : ${mongoose.connection.host}.`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
