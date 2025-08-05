const { ObjectId } = require("mongodb");

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const authorId = new ObjectId("64f3e2fc2b66c51906b44e29"); // ← جایگزین با آیدی واقعی User

    await db.collection("articles").insertOne({
      title: "تایتل مقاله تستی",
      content: "این یک محتوای تستی برای مقاله است.",
      author: authorId,
      images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      slug: "test-article-slug",
      shortIdentifier: "test-art-001",
      summery: "این خلاصه‌ای از مقاله تستی است.",
      tags: ["روانشناسی", "توسعه فردی"],
      category: ["سبک زندگی", "موفقیت"],
      isPublished: true,
      views: 5,
      likes: {
        count: 1,
        users: [authorId],
      },
      readingTime: 3,
      seoTitle: "مقاله تستی برای سئو",
      seoDescription: "توضیح کوتاه سئو برای مقاله تستی.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("articles").deleteOne({ slug: "test-article-slug" });
  },
};
