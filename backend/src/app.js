require('dotenv').config();
const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('./routes.js');
const orm = require('./models');

const app = new Koa(); // ✅ Primero instanciar

// Inyectar ORM en contexto
app.context.orm = orm;

// ✅ CORS completo y correcto
app.use(cors({
  origin: '*', // o 'https://autoparts-frontend.onrender.com'
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Otros middlewares
app.use(bodyParser());
app.use(KoaLogger());
app.use(koaBody());

// Rutas
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
