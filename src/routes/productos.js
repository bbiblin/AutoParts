const Router = require('koa-router');
const router = new Router();
const { Producto } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');

// GET para productos
router.get('/', async(ctx) => {
    try{
        const allProducts = await Producto.findAll();
        console.log('Productos encontrados:', allProducts.length);
        if (allProducts){
            ctx.status = 200;
            ctx.body = allProducts;
        }else{
            ctx.status = 404;
            ctx.body = {error: 'No se encontraron productos.'}
        }
    }
    catch (error){
        ctx.status = 500;
        ctx.body = {error: 'Error en el cliente'}
    }
}
);

module.exports = router;