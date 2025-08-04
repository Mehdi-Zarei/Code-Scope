const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../../../helper/responseMessage");
const User = require("../../../model/User");
const Comment = require("../../../model/Comment");
const Article = require("../../../model/Article");
const { createPagination } = require("../../../helper/pagination");
const { paginationQuerySchema } = require("./user.validator");

exports.getAll = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const { error } = paginationQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "خطا در اعتبارسنجی اطلاعات صفحه‌بندی",
        errors: error.details.map((e) => e.message),
      });
    }

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");

    const pagination = createPagination(page, limit, users.length, "Users");

    return successResponse(res, 200, { users, pagination });
  } catch (error) {
    next(error);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { newRole } = req.body;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه کاربر معتبر نمی باشد.");
    }

    const user = await User.findOneAndUpdate({ _id: id }, { role: newRole });
    if (!user) {
      return errorResponse(res, 404, "کاربری یافت نشد.");
    }

    return successResponse(res, 200, "نقش کاربر با موفقیت تغییر پیدا کرد.");
  } catch (error) {
    next(error);
  }
};

exports.toggleRestrictStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "شناسه کاربر معتبر نمی باشد.");
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "کاربری یافت نشد.");
    }

    user.isRestrict = !user.isRestrict;
    await user.save();

    const message = user.isRestrict ? "کاربر با موفقیت مسدود شد." : "دسترسی کاربر با موفقیت آزاد شد.";

    return successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    const userComments = await Comment.find({ userId: user._id });
    const userArticle = await Article.find({ author: user._id });

    return successResponse(res, 200, { user, userComments, userArticle });
  } catch (error) {
    next(error);
  }
};
