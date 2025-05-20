const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const router = require('./routes.js');
const orm = require('./models');

const app = new Koa();

app.context.orm = orm;

app.use(cors({
  origin: 'http://127.0.0.1:5173', // asegúrate que coincida con tu frontend
  credentials: true // si vas a usar cookies/sesiones
}));

app.use(KoaLogger());
app.use(koaBody());

app.use(router.routes());

app.listen(4000, () => {
  console.log('Servidor corriendo en http://127.0.0.1:4000');
});

module.exports = app;