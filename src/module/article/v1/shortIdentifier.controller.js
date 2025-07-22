const Article = require("../../../model/Article");

exports.redirectToArticlePage = async (req, res, next) => {
  try {
    const { shortIdentifier } = req.params;

    const article = await Article.findOne({ shortIdentifier }).lean();

    if (!article) {
      return errorResponse(res, 404, "مقاله ای یافت نشد.");
    }

    return res.redirect(`/api/v1/articles/${article._id}/${article.slug}`);
  } catch (error) {
    next(error);
  }
};
