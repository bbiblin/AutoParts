require("dotenv").config();

module.exports = {
  development: {
    username: "bbiblin",
    password: "12345678",
    database: "AutoParts",
    host: "localhost",
    dialect: "postgres",
    port: "5432",
  },
  test: {
    username: "bbiblin",
    password: "12345678",
    database: "autoparts_test",
    host: "localhost",
    port: "5432",
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    db_url: process.env.DB_URL,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    dialect: "postgres",
    port: process.env.DB_PORT || "5432",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
