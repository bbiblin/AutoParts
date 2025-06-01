const Router = require('koa-router');
const router = new Router();
const { producto } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');


//GET para los productos destacados... 
router.get('/destacados', async (ctx) => {
    try {
        const featuredProducts = await producto.findAll({ where: { featured: true } });
        ctx.body = featuredProducts;
    }
    catch (error) {
        console.error('Error al obtener productos', error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});


//POST para producto
router.post('/', async (ctx) => {
    try {
        const nuevoProducto = await producto.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = nuevoProducto;
    } catch (error) {
        console.error('Error al crear producto:', error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});



// GET para productos
router.get('/', async (ctx) => {
    try {
        let allProducts = [];

        if (ctx.query.category_id && !ctx.query.brand_id) {
            allProducts = await producto.findAll({ where: { category_id: ctx.query.category_id } });
        }
        else if (!ctx.query.category_id && ctx.query.brand_id) {
            allProducts = await producto.findAll({
                where: { brand_id: ctx.query.brand_id }
            });
        }
        else if (ctx.query.category_id && ctx.query.brand_id) {
            allProducts = await producto.findAll({
                where: { brand_id: ctx.query.brand_id, category_id: ctx.query.category_id }
            });

        }
        else {
            allProducts = await producto.findAll();
        }

        if (allProducts) {
            ctx.status = 200;
            ctx.body = allProducts;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No se encontraron productos.' }
        }
    }
    catch (error) {
        console.error('Error en /productos:', error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
}
);

//GET producto por id...
router.get('/:id', async (ctx) => {
    try {
        const product = await producto.findByPk(ctx.params.id);
        if (product) {
            ctx.status = 200;
            ctx.body = product;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No se encuentró el producto' }
        }
    }
    catch (error) {
        console.error('Error en /productos:id', error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});

//DELETE para producto...
router.delete('/:id', async (ctx) => {
    try {
        const deleted_product = await producto.destroy({ where: { id: ctx.params.id } });
        if (deleted_product) {
            ctx.status = 200;
            const msg = " Producto eliminado correctamente";
            ctx.body = { message: msg };
            console.log(msg);
        }
        else {
            ctx.status = 404;
            ctx.body = { error: 'Producto no encontrado' };
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});



//UPDATE para producto...
router.patch('/:id', async (ctx) => {
    try {
        const prod = await producto.findByPk(ctx.params.id);

        if (prod) {
            await prod.update(ctx.request.body);
            ctx.status = 200;
            ctx.body = prod;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Producto no encontrado' };
        }

    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});



module.exports = router;