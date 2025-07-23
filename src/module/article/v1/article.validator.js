const Joi = require("joi");

const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "any.required": "عنوان الزامی است.",
    "string.empty": "عنوان نمی‌تواند خالی باشد.",
    "string.min": "عنوان باید حداقل ۳ کاراکتر باشد.",
    "string.max": "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.",
  }),

  content: Joi.string().min(10).required().messages({
    "any.required": "محتوا الزامی است.",
    "string.min": "محتوا باید حداقل ۱۰ کاراکتر باشد.",
  }),

  slug: Joi.string()
    .pattern(/^[\u0600-\u06FFa-zA-Z0-9 ]+$/)
    .required()
    .messages({
      "any.required": "اسلاگ الزامی است.",
      "string.pattern.base":
        "اسلاگ فقط باید شامل حروف فارسی، انگلیسی و عدد باشد. استفاده از خط تیره یا آندرلاین مجاز نیست.",
    }),

  tags: Joi.array()
    .items(
      Joi.string().max(30).messages({
        "string.max": "هر برچسب حداکثر ۳۰ کاراکتر باشد.",
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "برچسب‌ها الزامی هستند.",
      "array.base": "برچسب‌ها باید آرایه‌ای از رشته‌ها باشند.",
      "array.min": "حداقل باید یک برچسب وارد کنید.",
    }),

  summery: Joi.string().max(300).allow("").messages({
    "string.max": "خلاصه نباید بیشتر از ۳۰۰ کاراکتر باشد.",
  }),

  category: Joi.array()
    .items(
      Joi.string().max(30).messages({
        "string.max": "هر دسته‌بندی حداکثر ۳۰ کاراکتر باشد.",
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "دسته‌بندی الزامی است.",
      "array.base": "دسته‌بندی باید آرایه‌ای از رشته‌ها باشند.",
      "array.min": "حداقل باید یک دسته‌بندی وارد کنید.",
    }),

  readingTime: Joi.number().min(1).max(60).required().messages({
    "any.required": "زمان مطالعه الزامی است.",
    "number.min": "زمان مطالعه حداقل ۱ دقیقه باید باشد.",
    "number.max": "زمان مطالعه نمی‌تواند بیشتر از ۶۰ دقیقه باشد.",
  }),

  seoTitle: Joi.string().max(70).allow("").messages({
    "string.max": "عنوان سئو حداکثر باید 60 کاراکتر باشد.",
  }),

  seoDescription: Joi.string().max(160).allow("").messages({
    "string.max": "توضیحات سئو حداکثر باید ۱۶۰ کاراکتر باشد.",
  }),

  publishNow: Joi.boolean().required().messages({
    "any.required": "فیلد انتشار فوری الزامی است.",
  }),
});

const editArticleSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.empty": "عنوان نمی‌تواند خالی باشد.",
    "string.min": "عنوان باید حداقل ۳ کاراکتر باشد.",
    "string.max": "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.",
  }),

  content: Joi.string().min(10).messages({
    "string.min": "محتوا باید حداقل ۱۰ کاراکتر باشد.",
  }),

  slug: Joi.string()
    .pattern(/^[\u0600-\u06FFa-zA-Z0-9 ]+$/)
    .messages({
      "string.pattern.base":
        "اسلاگ فقط باید شامل حروف فارسی، انگلیسی و عدد باشد. استفاده از خط تیره یا آندرلاین مجاز نیست.",
    }),

  tags: Joi.string().max(30).messages({
    "string.max": "هر برچسب حداکثر ۳۰ کاراکتر باشد.",
  }),
  summery: Joi.string().max(300).allow("").messages({
    "string.max": "خلاصه مقاله نباید بیشتر از ۳۰۰ کاراکتر باشد.",
  }),

  category: Joi.string().max(30).messages({
    "string.max": "هر دسته‌بندی حداکثر ۳۰ کاراکتر باشد.",
  }),

  readingTime: Joi.number().min(1).max(60).messages({
    "number.min": "زمان مطالعه حداقل ۱ دقیقه باید باشد.",
    "number.max": "زمان مطالعه نمی‌تواند بیشتر از ۶۰ دقیقه باشد.",
  }),

  seoTitle: Joi.string().max(60).allow("").messages({
    "string.max": "عنوان سئو حداکثر باید ۶۰ کاراکتر باشد.",
  }),

  seoDescription: Joi.string().max(160).allow("").messages({
    "string.max": "توضیحات سئو حداکثر باید ۱۶۰ کاراکتر باشد.",
  }),

  publishNow: Joi.boolean().messages({
    "boolean.base": "مقدار انتشار فوری باید بولین باشد.",
  }),
});

module.exports = { createArticleSchema, editArticleSchema };
