const { verifyToken } = require("../helper/jwtTokens");
const User = require("../model/User");

const optionalAuthGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    const user = await User.findById(decoded.id).lean();

    if (user) {
      req.user = user;
    }
  } catch (err) {}

  next();
};

module.exports = optionalAuthGuard;
