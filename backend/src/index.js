// src/index.js
const Koa = require('koa');
const cors = require('@koa/cors');
const Logger = require('koa-logger');
const router = require('./routes');
const PORT = process.env.PORT || 3000;

const app = new Koa();
app.use(cors());

app.use(Logger());

app.use(router.routes());


app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
