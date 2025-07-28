# 🚀 Code-Scope

```
Hey there! 👋
This is a space for curious developers who love to build, learn, and share.
We publish practical articles, share real-world experiences, and explore topics across the programming world — from clean code and architecture to DevOps, frontend, backend, testing, and beyond.
Whether you're just getting started or you’ve been coding for years, you’ll find something valuable here.
No buzzwords, no fluff — just honest, useful content for developers who care about their craft.
```

![Code-Scope Banner](https://img.shields.io/badge/Code--Scope-Backend-blueviolet?style=for-the-badge&logo=javascript)

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis (ioredis)
- **Authentication**: JWT (Access + Refresh Tokens)
- **Validation**: Joi
- **File Upload**: Multer
- **API Docs**: Swagger

---

## 🛠️ Features

- 🔐 **User Authentication**

  - Register with email and password
  - Secure password hashing with `bcrypt`
  - JWT-based access and refresh tokens
  - Refresh tokens stored hashed in Redis (30 days)
  - Password reset via email with `nodemailer`

- 📚 **Articles**

  - Only admins and authors can create articles
  - Public access to read articles
  - Like & view counters for each article
  - Pagination for listing articles

- 💬 **Comments**

  - Nested (tree-like) comments and replies
  - Comment status: `APPROVED`, `PENDING`, `REJECTED`

- 👥 **Users**

  - User listing with pagination
  - Roles: `admin`, `author`, `user`

- ⚙️ **Utilities**
  - Environment config with `dotenv`
  - Cookie management with `cookie-parser`
  - CORS support
  - UUID and NanoID for unique ID generation

---

## 📁 Project Structure

```
docs-v1-\*yaml
public/
src/
├── config/
├── helper/
├── middleware/
├── model/
├── module/
├── templates/
├── utils/
├── app.js
└── server.js
.envExample
.gitignore
package.json
```

---

## 📄 API Documentation

Interactive Swagger UI available at:  
`http://localhost:5000/apis/v1/swagger` 🧩

Generated with `swagger-jsdoc` & `swagger-ui-express`.

---

## 🔑 Authentication

- Access Token: short-lived, sent via headers
- Refresh Token: stored hashed in Redis, valid for 30 days
- Login required for like/comment
- Role-based access control (RBAC)

---

## 🧪 Dependencies

```json
"bcrypt": "^6.0.0",
"cookie-parser": "^1.4.7",
"cors": "^2.8.5",
"dotenv": "^17.0.1",
"express": "^5.1.0",
"ioredis": "^5.6.1",
"joi": "^17.13.3",
"jsonwebtoken": "^9.0.2",
"mongoose": "^8.16.1",
"multer": "^2.0.2",
"nanoid": "^3.3.11",
"nodemailer": "^7.0.5",
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.1",
"uuid": "^11.1.0"
```

🚧 Getting Started

- [git clone https://github.com/your-username/code-scope.git](https://github.com/Mehdi-Zarei/Code-Scope.git)
- cd code-scope
- npm install
- cp .env.example .env
- npm start

📬 Contact
For feature requests, bugs, or questions, open an issue or reach out on GitHub.

Made with ❤️ by Code-Scope Team
