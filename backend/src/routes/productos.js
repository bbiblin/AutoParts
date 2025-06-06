const Router = require('koa-router');
const router = new Router();
const { producto } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');


//GET para los productos destacados... 
router.get('/destacados', async (ctx) => {
    try {
        const featuredProducts = await producto.findAll({ where: { featured: true, isActive: true } });
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
        console.log(ctx.request.body);
        const nuevoProducto = await producto.create(ctx.request.body);
        if (nuevoProducto.discount_percentage > 0) {
            let precio_retail = nuevoProducto.retail_price;
            let precio_wholesale = nuevoProducto.wholesale_price;
            let porcentaje_descuento = nuevoProducto.discount_percentage;
            let porcentaje_restante = (100 - porcentaje_descuento);
            let precio_final_retail = Math.floor((precio_retail * (porcentaje_restante / 100)));
            let precio_final_wholesale = Math.floor((precio_wholesale * (porcentaje_restante / 100)));

            await nuevoProducto.update({ retail_price_sale: precio_final_retail, wholesale_price_sale: precio_final_wholesale });
        }

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

        let admin = ctx.request.query.admin;
        if (!admin) {
            if (ctx.query.category_id && !ctx.query.brand_id) {
            allProducts = await producto.findAll({ where: { category_id: ctx.query.category_id, isActive: true } });
            }
            else if (!ctx.query.category_id && ctx.query.brand_id) {
                allProducts = await producto.findAll({
                    where: { brand_id: ctx.query.brand_id, isActive: true }
                });
            }
            else if (ctx.query.category_id && ctx.query.brand_id) {
                allProducts = await producto.findAll({
                    where: { brand_id: ctx.query.brand_id, category_id: ctx.query.category_id, isActive: true }
                });

            }
            else {
                allProducts = await producto.findAll({where: {isActive: true}});
            }
        } else {
            if (ctx.query.category_id && !ctx.query.brand_id) {
            allProducts = await producto.findAll({ where: { category_id: ctx.query.category_id }});
            }
            else if (!ctx.query.category_id && ctx.query.brand_id) {
                allProducts = await producto.findAll({
                    where: { brand_id: ctx.query.brand_id}
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
        prod.update(ctx.request.body);
        console.log(ctx.request.body.image_url);

        if (prod.discount_percentage > 0) {
            let precio_retail = prod.retail_price;
            let precio_wholesale = prod.wholesale_price;
            let porcentaje_descuento = prod.discount_percentage;
            let porcentaje_restante = (100 - porcentaje_descuento);
            let precio_final_retail = Math.floor((precio_retail * (porcentaje_restante / 100)));
            let precio_final_wholesale = Math.floor((precio_wholesale * (porcentaje_restante / 100)));

            await prod.update({ retail_price_sale: precio_final_retail, wholesale_price_sale: precio_final_wholesale });
        }
        console.log(prod);
        ctx.status = 200;
        ctx.body = prod;

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        ctx.status = 500;
        ctx.body = { 
            error: 'Error interno del servidor',
            message: error.message 
        };
    }
});

// Aplicar descuento
router.patch('/:id/descuento', async (ctx) => {
    try {
        const prod = await producto.findByPk(ctx.params.id);

        if (prod.discount_percentage > 0) {
            let precio_retail = prod.retail_price;
            let precio_wholesale = prod.wholesale_price;
            let porcentaje_descuento = prod.discount_percentage;
            let porcentaje_restante = (100 - porcentaje_descuento);
            let precio_final_retail = Math.floor((precio_retail * (porcentaje_restante / 100)));
            let precio_final_wholesale = Math.floor((precio_wholesale * (porcentaje_restante / 100)));

            await prod.update({ retail_price_sale: precio_final_retail, wholesale_price_sale: precio_final_wholesale });
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