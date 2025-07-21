const express = require("express");
const router = express.Router();

//* Controller
const { register, login, refreshToken, logout, forgetPassword, resetPassword } = require("./auth.controller");

//* Middleware
const authGuard = require("../../../middleware/authGuard");
const { bodyValidator } = require("../../../middleware/validator");
const { registerValidator, loginValidator, resetPasswordValidator, forgetPasswordValidator } = require("./auth.validator");

//* Routes
router.route("/register").post(bodyValidator(registerValidator), register);
router.route("/login").post(bodyValidator(loginValidator), login);
router.route("/refresh-accessToken").post(refreshToken);
router.route("/logout").post(authGuard(), logout);
router.route("/forget-password").post(bodyValidator(forgetPasswordValidator), forgetPassword);
router.route("/reset-password/:token").post(bodyValidator(resetPasswordValidator), resetPassword);

module.exports = router;
