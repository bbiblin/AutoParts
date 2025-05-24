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
    username: 'bbiblin',
    password: '12345678',
    database: 'AutoParts',
    host: 'localhost',
    dialect: 'postgres',
    port: '5432'
  }
};