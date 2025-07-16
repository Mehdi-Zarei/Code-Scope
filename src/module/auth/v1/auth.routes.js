const express = require("express");
const { register, login, refreshToken, logout, forgetPassword, resetPassword } = require("./auth.controller");
const authGuard = require("../../../middleware/authGuard");
const router = express.Router();

//* Routes

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-accessToken").post(refreshToken);
router.route("/logout").post(authGuard(), logout);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
