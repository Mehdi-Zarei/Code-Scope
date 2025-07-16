const jwt = require("jsonwebtoken");

const generateAccessToken = async (userID, userRole) => {
  try {
    return jwt.sign({ id: userID, role: userRole }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES,
    });
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = async (userID, userRole) => {
  try {
    return jwt.sign({ id: userID, role: userRole }, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    });
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
