const Joi = require("joi");

const updateUserRoleSchema = Joi.object({
  newRole: Joi.string().valid("ADMIN", "USER", "AUTHOR").required().messages({
    "any.only": "نقش وارد شده معتبر نمی‌باشد. نقش باید یکی از ADMIN، USER یا AUTHOR باشد.",
    "any.required": "فیلد نقش الزامی است.",
  }),
});

const paginationQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).default(10).messages({
    "number.base": "limit باید یک عدد باشد.",
    "number.integer": "limit باید یک عدد صحیح باشد.",
    "number.min": "limit باید حداقل ۱ باشد.",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page باید یک عدد باشد.",
    "number.integer": "page باید یک عدد صحیح باشد.",
    "number.min": "page باید حداقل ۱ باشد.",
  }),
});

module.exports = { updateUserRoleSchema, paginationQuerySchema };
