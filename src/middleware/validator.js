const fs = require("fs");

const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path, (err) => {
            console.error(`❌ خطا در حذف فایل ${path}:`, err.message);
          });
        });
      }
      next(error);
    }
  };
};

module.exports = { bodyValidator };
