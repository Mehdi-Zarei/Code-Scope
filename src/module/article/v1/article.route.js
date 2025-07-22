const express = require("express");
const authGuard = require("../../../middleware/authGuard");
const router = express.Router();
//* Middlewares

//* Controller
const {
  create,
  getAll,
  getOne,
  update,
  remove,
  changePublishStatus,
  toggleLikeArticles,
  redirectToArticlePage,
} = require("./article.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const { bodyValidator } = require("../../../middleware/validator");
const { createArticleSchema } = require("./article.validator");
const optionalAuthGuard = require("../../../middleware/optionalAuthGuard");
const upload = multerStorage("public/images/articles", 15, [".jpg", ".jpeg"]);

//* Validator

//* Routes
router
  .route("/")
  .post(authGuard(["ADMIN", "AUTHOR"]), upload.array("images", 10), bodyValidator(createArticleSchema), create);
router.route("/").get(optionalAuthGuard, getAll);
router.route("/:id/:slug").get(optionalAuthGuard, getOne);
router.route("/update/:id").patch(authGuard(["ADMIN", "AUTHOR"]), upload.array("images", 10), update);
router.route("/remove/:id").delete(authGuard(["ADMIN", "AUTHOR"]), remove);
router.route("/publish/:id").patch(authGuard(), changePublishStatus);
router.route("/like/:id").post(authGuard(), toggleLikeArticles);

module.exports = router;
