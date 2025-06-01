const Router = require('koa-router');
const productos_routes = require('./routes/productos');
const categories_routes = require('./routes/category');
const brands_routes = require('./routes/brands');
const users_routes = require('./routes/users');
const cart_routes = require('./routes/cart');
const payment_routes = require ('./routes/payment');


const router = new Router();
router.use('/productos', productos_routes.routes());
router.use('/categories', categories_routes.routes());
router.use('/brands', brands_routes.routes());
router.use('/users', users_routes.routes());
router.use('/cart', cart_routes.routes());
module.exports = router;