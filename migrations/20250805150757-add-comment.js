const { ObjectId } = require("mongodb");

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const userId = new ObjectId("64f3e2fc2b66c51906b44e29");
    const articleId = new ObjectId("64f3e5ac2b66c51906b44f51");

    await db.collection("comments").insertOne({
      articleId,
      userId,
      parentId: null,
      content: "این یک کامنت تستی برای مقاله است.",
      status: "APPROVED",
      likes: {
        count: 0,
        users: [],
      },
      score: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("comments").insertOne({
      articleId,
      userId,
      parentId: userId,
      content: "این یک پاسخ تستی برای کامنت اصلی است.",
      status: "APPROVED",
      likes: {
        count: 0,
        users: [],
      },
      score: 4,
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
    await db.collection("comments").deleteMany({
      content: {
        $in: ["این یک کامنت تستی برای مقاله است.", "این یک پاسخ تستی برای کامنت اصلی است."],
      },
    });
  },
};
