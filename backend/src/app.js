require('dotenv').config();
const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('./routes.js');
const orm = require('./models');

app.use(cors());

const app = new Koa();

app.context.orm = orm;

app.use(bodyParser());

app.use(KoaLogger());
app.use(koaBody());

app.use(router.routes());

module.exports = app;