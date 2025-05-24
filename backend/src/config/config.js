require('dotenv').config();

module.exports = {
  development: {
    username: 'bbiblin',
    password: '12345678',
    database: 'AutoParts',
    host: 'localhost',
    dialect: 'postgres',
    port: '5432'
  },
  test: {
    username: 'bbiblin',
    password: '12345678',
    database: 'AutoParts',
    host: 'localhost',
    dialect: 'postgres',
    port: '5432'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || '5432',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
