module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection("users").insertOne({
      name: "Admin",
      email: "admin@example.com",
      password: "admin@123",
      role: "ADMIN",
      isRestrict: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("users").insertOne({
      name: "User",
      email: "user@example.com",
      password: "user@123",
      role: "USER",
      isRestrict: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("users").insertOne({
      name: "Author",
      email: "author@example.com",
      password: "author@123",
      role: "AUTHOR",
      isRestrict: false,
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
    db.collection("users").deleteMany();
  },
};
