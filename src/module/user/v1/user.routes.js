const express = require("express");
const authGuard = require("../../../middleware/authGuard");
const router = express.Router();

//* Controller
const { getAll, changeRole, toggleRestrictStatus, getMe } = require("./user.controller");

//* Middleware
const { bodyValidator } = require("../../../middleware/validator");
const { updateUserRoleSchema } = require("./user.validator");

//*Routes
router.route("/").get(authGuard("ADMIN"), getAll);
router.route("/role/:id").patch(authGuard("ADMIN"), bodyValidator(updateUserRoleSchema), changeRole);
router.route("/restrict/:id").patch(authGuard("ADMIN"), toggleRestrictStatus);
router.route("/me").get(authGuard(), getMe);

module.exports = router;
