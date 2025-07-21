const Joi = require("joi");

const registerValidator = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "نام باید یک رشته باشد.",
    "string.empty": "نام الزامی است.",
    "string.min": "نام باید حداقل ۳ کاراکتر باشد.",
    "string.max": "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد.",
    "any.required": "نام الزامی است.",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "ایمیل باید یک رشته باشد.",
    "string.empty": "ایمیل الزامی است.",
    "string.email": "فرمت ایمیل معتبر نیست.",
    "any.required": "ایمیل الزامی است.",
  }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/[a-z]/, { name: "حروف کوچک" })
    .pattern(/[A-Z]/, { name: "حروف بزرگ" })
    .pattern(/[0-9]/, { name: "اعداد" })
    .pattern(/[^a-zA-Z0-9]/, { name: "کاراکتر های خاص" })
    .required()
    .messages({
      "string.empty": "رمز عبور الزامی است.",
      "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      "string.max": "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد.",
      "string.pattern.name": "رمز عبور باید شامل {#name} باشد.",
    }),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "ایمیل باید یک رشته باشد.",
    "string.empty": "ایمیل الزامی است.",
    "string.email": "فرمت ایمیل معتبر نیست.",
    "any.required": "ایمیل الزامی است.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "رمز عبور الزامی است.",
  }),
});

const forgetPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "ایمیل باید یک رشته باشد.",
    "string.empty": "ایمیل الزامی است.",
    "string.email": "فرمت ایمیل معتبر نیست.",
    "any.required": "ایمیل الزامی است.",
  }),
});

const resetPasswordValidator = Joi.object({
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/[a-z]/, { name: "حروف کوچک" })
    .pattern(/[A-Z]/, { name: "حروف بزرگ" })
    .pattern(/[0-9]/, { name: "اعداد" })
    .pattern(/[^a-zA-Z0-9]/, { name: "کاراکتر های خاص" })
    .required()
    .messages({
      "string.empty": "رمز عبور الزامی است.",
      "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      "string.max": "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد.",
      "string.pattern.name": "رمز عبور باید شامل {#name} باشد.",
    }),
});

const resetPasswordTokenValidator = Joi.object({
  token: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "توکن ارسالی معتبر نمی‌باشد.",
      "any.required": "توکن الزامی است.",
    }),
});

module.exports = { registerValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, resetPasswordTokenValidator };
