const Router = require('koa-router');
const productos_routes = require('../routes/productos');
const categories_routes = require('../routes/category');
const brands_routes = require('../routes/brands');



const router = new Router();
router.use('/productos', productos_routes.routes());
router.use('/categories', categories_routes.routes());
router.use('/brands', brands_routes.routes());
module.exports = router;