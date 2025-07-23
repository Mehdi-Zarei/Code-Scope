const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("شناسه معتبر نیست.");
  }
  return value;
};

const createCommentSchema = Joi.object({
  articleId: Joi.string().required().custom(objectIdValidator).messages({
    "any.required": "شناسه مقاله الزامی است.",
    "string.empty": "شناسه مقاله نمی‌تواند خالی باشد.",
  }),

  parentId: Joi.string()
    .allow(null)
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("شناسه کامنت اصلی معتبر نیست.");
      }
      return value;
    }),

  content: Joi.string().trim().required().messages({
    "string.empty": "محتوای کامنت الزامی است.",
  }),

  score: Joi.number().min(1).max(5).default(5).messages({
    "number.base": "امتیاز باید عدد باشد.",
    "number.min": "امتیاز نمی‌تواند کمتر از ۱ باشد.",
    "number.max": "امتیاز نمی‌تواند بیشتر از ۵ باشد.",
  }),
});

const updateCommentStatusSchema = Joi.object({
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").required().messages({
    "any.only": "وضعیت وارد شده نامعتبر است. فقط یکی از گزینه‌های 'PENDING'، 'APPROVED' یا 'REJECTED' مجاز است.",
    "string.empty": "وارد کردن وضعیت اجباری است.",
    "any.required": "فیلد وضعیت الزامی است.",
  }),
});

module.exports = { createCommentSchema, updateCommentStatusSchema };
