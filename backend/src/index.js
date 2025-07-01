const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Logger = require('koa-logger');
const router = require('./routes');
const PORT = process.env.PORT || 5374;

const app = new Koa();

// ✅ CORS explícito para evitar errores de red en solicitudes multipart/form-data
app.use(cors({
  origin: 'https://autoparts-frontend.onrender.com', // Cambia según tu dominio
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(bodyParser());
app.use(Logger());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
