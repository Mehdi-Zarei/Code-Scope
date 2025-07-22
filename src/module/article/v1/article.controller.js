const Article = require("../../../model/Article");
const { nanoid } = require("nanoid");
const fs = require("fs");
const { errorResponse, successResponse } = require("../../../helper/responseMessage");
const { paginationQuerySchema } = require("../../user/v1/user.validator");
const { createPagination } = require("../../../helper/pagination");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const { title, content, slug, tags, summery, category, readingTime, seoTitle, seoDescription, publishNow } =
      req.body;

    const user = req.user;

    let images = [];

    if (req.files) {
      images = req.files.map((images) => `${process.env.DOMAIN}/public/images/articles/${images.filename}`);
    }

    const isArticleExist = await Article.findOne({ title }).lean();

    if (isArticleExist) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path, (err) => {
            console.error(`❌ خطا در حذف فایل ${path}:`, err.message);
          });
        });
      }
      return errorResponse(res, 409, "این مقاله قبلا ثبت شده و تکراری می باشد.");
    }

    let generateSlug = slug
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, "")
      .toLowerCase();

    const isSlugExist = !!(await Article.findOne({ generateSlug }).lean());

    if (isSlugExist) {
      generateSlug = generateSlug + "-" + Date.now().toString().slice(-4);
    }

    let shortIdentifier = nanoid(6);

    const isShortIdentifierExist = !!(await Article.findOne({ shortIdentifier }).lean());

    if (isShortIdentifierExist) {
      shortIdentifier = shortIdentifier + "-" + Date.now().toString().slice(-2);
    }

    const generateSummery = summery || content.split(" ").slice(0, 50).join(" ") + "...";

    await Article.create({
      title,
      content,
      author: user._id,
      slug: generateSlug,
      images,
      tags,
      summery: generateSummery,
      shortIdentifier,
      category,
      readingTime,
      isPublished: publishNow,
      seoTitle,
      seoDescription,
    });

    return successResponse(res, 201, "مقاله با موفقیت منتشر گردید.");
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { error } = paginationQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "خطا در اعتبارسنجی اطلاعات صفحه‌بندی",
        errors: error.details.map((e) => e.message),
      });
    }

    const filter = req.user?.role === "ADMIN" ? {} : { isPublished: true };

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name")
      .select("-content -shortIdentifier -slug -reviews -seoTitle -seoDescription -likes.users")
      .lean();

    if (!articles.length) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    const pagination = createPagination(page, limit, articles.length, "Articles");

    return successResponse(res, 200, { articles, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id, slug } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه مقاله معتبر نمی باشد.");
    }

    const article = await Article.findById(id).populate("author", "name").select("-seoTitle -seoDescription").lean();
    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد");
    }

    if (article.slug !== slug) {
      return res.redirect(`/api/v1/articles/${article._id}/${article.slug}`);
    }

    const isLiked = article.likes.users?.some((userId) => userId.toString() === req.user._id.toString());

    return successResponse(res, 200, { article, isLiked });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه مقاله معتبر نمی باشد.");
    }

    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    if (user.role === "AUTHOR" && article.author !== user._id) {
      return errorResponse(res, 403, "شما مجاز به حذف این مقاله نیستید.");
    }

    await article.deleteOne();

    return successResponse(res, 200, "مقاله با موفقیت حذف گردید.");
  } catch (error) {
    next(error);
  }
};

exports.changePublishStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه مقاله معتبر نمی باشد.");
    }

    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    if (user.role === "AUTHOR" && article.author !== user._id) {
      return errorResponse(res, 403, "شما دسترسی لازم به این مقاله را ندارید.");
    }

    article.isPublished = !article.isPublished;
    await article.save();

    const responseMessage = article.isPublished ? "مقاله با موفقیت منتشر شد" : " مقاله از حالت انتشار خارج گردید.";

    return successResponse(res, 200, responseMessage);

    return;
  } catch (error) {
    next(error);
  }
};

exports.toggleLikeArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه مقاله معتبر نمی باشد.");
    }

    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    const hasLike = article.likes.users.includes(user._id);

    let message = "";

    if (hasLike) {
      await Article.findByIdAndUpdate(id, {
        $pull: { "likes.users": user._id },
        $inc: { "likes.count": -1 },
      });

      message = "لایک مقاله برداشته شد.";
    } else {
      article.likes.count++;
      article.likes.users.push(user._id);
      await article.save();

      message = "مقاله با موفقیت لایک شد.";
    }

    return successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};
