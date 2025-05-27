// src/index.js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Logger = require('koa-logger');

const router = require('./routes');
const PORT = process.env.PORT || 5374;

const app = new Koa();


app.use(cors());
app.use(bodyParser());
app.use(Logger());

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
