const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middleware/authGuard");
const optionalAuthGuard = require("../../../middleware/optionalAuthGuard");

//* Controller
const {
  create,
  getAll,
  getOne,
  update,
  remove,
  changePublishStatus,
  toggleLikeArticles,
} = require("./article.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/images/articles", 15, [".jpg", ".jpeg"]);

//* Validator
const { bodyValidator } = require("../../../middleware/validator");
const { createArticleSchema } = require("./article.validator");

//* Routes
router
  .route("/")
  .post(authGuard(["ADMIN", "AUTHOR"]), upload.array("images", 10), bodyValidator(createArticleSchema), create);
router.route("/").get(optionalAuthGuard, getAll);
router.route("/:id/:slug").get(optionalAuthGuard, getOne);
router.route("/update/:id").patch(authGuard(["ADMIN", "AUTHOR"]), upload.array("images", 10), update);
router.route("/remove/:id").delete(authGuard(["ADMIN", "AUTHOR"]), remove);
router.route("/publish/:id").patch(authGuard(["ADMIN", "AUTHOR"]), changePublishStatus);
router.route("/like/:id").post(authGuard(), toggleLikeArticles);

module.exports = router;
