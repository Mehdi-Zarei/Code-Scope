const { errorResponse, successResponse } = require("../../../helper/responseMessage");
const Comment = require("../../../model/Comment");
const Article = require("../../../model/Article");
const { isValidObjectId } = require("mongoose");
const { createPagination } = require("../../../helper/pagination");
const { paginationSchema } = require("./comment.validator");

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { error } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const comments = await Comment.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (!comments.length) {
      return successResponse(res, 200, "کامنتی یافت نشد");
    }

    const pagination = createPagination(page, limit, comments.length, "Comments");

    return successResponse(res, 200, { comments, pagination });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { articleId, parentId, content, score } = req.body;
    const userId = req.user._id;

    const isArticleExist = await Article.findById(articleId);
    if (!isArticleExist) {
      return errorResponse(res, 404, "مقاله ای با این شناسه یافت نشد.");
    }

    if (parentId) {
      const mainComment = await Comment.findOne({ _id: parentId, status: "APPROVED" });
      if (!mainComment) {
        return errorResponse(res, 404, "کامنت اصلی با این شناسه یافت نشد.");
      }
    }

    const isRepetitive = await Comment.findOne({ content, userId });
    if (isRepetitive) {
      return errorResponse(res, 409, "این نظر قبلا توسط شما ثبت شده است.");
    }

    await Comment.create({
      articleId,
      content,
      parentId,
      score,
      userId,
      status: "PENDING",
    });

    return successResponse(res, 201, "نظر شما با موفقیت ثبت و پس از بازبینی توسط مدیر نمایش داده میشود.");
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 409, "شناسه کامنت معتبر نمی باشد.");
    }

    const mainComment = await Comment.findById(commentId)
      .populate("articleId", "title")
      .populate("userId", "name")
      .populate("parentId", "content")
      .select("-likes.users")
      .lean();

    if (!mainComment) {
      return errorResponse(res, 404, "کامنتی با این شناسه یافت نشد.");
    }

    return successResponse(res, 200, mainComment);
  } catch (error) {
    next(error);
  }
};

exports.articleComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { articleId } = req.params;

    const { error } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    if (!isValidObjectId(articleId)) {
      return errorResponse(res, 409, "شناسه کامنت معتبر نمی باشد.");
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    const articleComments = await Comment.find({ articleId, status: "APPROVED" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name")
      .lean();

    if (!articleComments.length) {
      return successResponse(res, 200, "اولین نفری باشید که برای این مقاله نظر میدهید.");
    }

    const commentMap = {};
    let tree = [];

    articleComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id.toString()] = comment;
    });

    articleComments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId.toString()];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        tree.push(comment);
      }
    });

    tree = articleComments.filter((comment) => !comment.parentId);

    const pagination = createPagination(page, limit, articleComments.length, "Comments");

    return successResponse(res, 200, { articleComments: tree, pagination });

    return;
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 409, "شناسه کامنت معتبر نمی باشد.");
    }

    const isCommentExist = await Comment.findByIdAndUpdate(commentId, { status });
    if (!isCommentExist) {
      return errorResponse(res, 404, "کامنتی با این شناسه یافت نشد.");
    }

    return successResponse(res, 200, "عملیات با موفقیت انجام شد.");
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 409, "شناسه کامنت معتبر نمی باشد.");
    }

    const remove = await Comment.findByIdAndDelete(commentId);
    if (!remove) {
      return errorResponse(res, 404, "کامنتی با این شناسه یافت نشد.");
    }

    return successResponse(res, 200, "کامنت مورد نظر با موفقیت حذف گردید.");
  } catch (error) {
    next(error);
  }
};

exports.toggleLikeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 409, "شناسه کامنت معتبر نمی باشد.");
    }

    const mainComment = await Comment.findById(commentId);
    if (!mainComment) {
      return errorResponse(res, 404, "کامنتی با این شناسه یافت نشد.");
    }

    const hasLike = mainComment.likes.users.includes(user._id);

    let message = "";

    if (hasLike) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { "likes.users": user._id },
        $inc: { "likes.count": -1 },
      });
      message = "لایک کامنت با موفقیت برداشته شد.";
    } else {
      mainComment.likes.count++;
      mainComment.likes.users.push(user._id);
      await mainComment.save();
      message = "کامنت با موفقیت لایک شد.";
    }

    return successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};
