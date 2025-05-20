const Router = require('koa-router');
const productos_routes = require('./routes/productos');


const router = new Router();

router.use('/productos', productos_routes.routes());
module.exports = router;