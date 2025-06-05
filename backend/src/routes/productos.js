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
        
        if (!prod) {
            ctx.status = 404;
            ctx.body = { error: 'Producto no encontrado' };
            return;
        }

        const { 
            stock, 
            discount_percentage, 
            description, 
            product_name, 
            isActive, 
            retail_price, 
            wholesale_price 
        } = ctx.request.body;

        // Actualizar solo los campos que se envían (evitar undefined)
        const updateData = {};
        if (stock !== undefined) updateData.stock = stock;
        if (retail_price !== undefined) updateData.retail_price = retail_price;
        if (wholesale_price !== undefined) updateData.wholesale_price = wholesale_price;
        if (discount_percentage !== undefined) updateData.discount_percentage = discount_percentage;
        if (description !== undefined) updateData.description = description;
        if (product_name !== undefined) updateData.product_name = product_name;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Calcular precios con descuento si hay descuento
        const finalDiscountPercentage = discount_percentage !== undefined ? discount_percentage : prod.discount_percentage;
        const finalRetailPrice = retail_price !== undefined ? retail_price : prod.retail_price;
        const finalWholesalePrice = wholesale_price !== undefined ? wholesale_price : prod.wholesale_price;

        if (finalDiscountPercentage > 0) {
            const discountMultiplier = (100 - finalDiscountPercentage) / 100;
            updateData.retail_price_sale = Math.floor(finalRetailPrice * discountMultiplier);
            updateData.wholesale_price_sale = Math.floor(finalWholesalePrice * discountMultiplier);
        } else {
            // Si no hay descuento, los precios de venta son iguales a los normales
            updateData.retail_price_sale = finalRetailPrice;
            updateData.wholesale_price_sale = finalWholesalePrice;
        }
categoría:
        // Actualizar el producto (una sola vez)
        await prod.update(updateData);

        // Recargar para obtener los datos actualizados (incluyendo el slug si cambió el nombre)
        await prod.reload();

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Producto actualizado exitosamente',
            data: prod
        };

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