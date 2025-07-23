const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middleware/authGuard");

//* Controller
const {
  getAll,
  create,
  getOne,
  articleComments,
  changeStatus,
  remove,
  toggleLikeComment,
} = require("./comment.controller");

//* Validator
const { bodyValidator } = require("../../../middleware/validator");
const { createCommentSchema, updateCommentStatusSchema } = require("./comment.validator");

//* Routes
router
  .route("/")
  .get(authGuard(["ADMIN"]), getAll)
  .post(authGuard(), bodyValidator(createCommentSchema), create);

router.route("/:commentId").get(authGuard(["ADMIN"]), getOne);
router.route("/article/:articleId").get(articleComments);
router.route("/:commentId/status").patch(authGuard(["ADMIN"]), bodyValidator(updateCommentStatusSchema), changeStatus);
router.route("/:commentId/remove").delete(authGuard(["ADMIN"]), remove);
router.route("/:commentId/like").post(authGuard(), toggleLikeComment);

module.exports = router;
