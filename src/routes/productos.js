const Router = require('koa-router');
const router = new Router();
const { producto } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');

// GET para productos
router.get('/', async (ctx) => {
    try {
        const allProducts = await producto.findAll();
        if (allProducts) {
            ctx.status = 200;
            ctx.body = allProducts;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No se encontraron productos.' }
        }
    }
    catch (error) {
        console.error('Error en /productos:', error); // <--- importante para depurar
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
}
);

module.exports = router;