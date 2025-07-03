const Router = require('koa-router');
const router = new Router();
const { producto } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');
const { koaBody } = require('koa-body');
const cloudinary = require('../config/configCloudinary')
const fs = require('fs');
const path = require('path');
const os = require('os');


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


router.post('/', koaBody({
    multipart: true,
    formidable: {
        uploadDir: os.tmpdir(),
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024 // 10MB
    }
}), async (ctx) => {
    try {
        const file = ctx.request.files?.imagen;
        let image_url = null;

        // 1. Procesar imagen si viene y es válida
        if (file && file.filepath && fs.existsSync(file.filepath)) {
            try {
                const result = await cloudinary.uploader.upload(file.filepath, {
                    folder: 'productos'
                });
                fs.unlinkSync(file.filepath);
                image_url = result.secure_url;
            } catch (cloudErr) {
                console.error("❌ Error al subir imagen a Cloudinary:", cloudErr);
                throw new Error("Falló la subida de imagen a Cloudinary.");
            }
        }

        // 2. Extraer y castear datos del formulario
        const {
            product_cod,
            product_name,
            description,
            retail_price,
            wholesale_price,
            stock,
            discount_percentage,
            isActive,
            featured,
            category_id,
            brand_id
        } = ctx.request.body;

        if (!product_name || !retail_price || !wholesale_price || !stock) {
            ctx.status = 400;
            ctx.body = { error: "Faltan campos obligatorios." };
            return;
        }

        // 3. Crear producto en DB
        const nuevoProducto = await producto.create({
            product_cod,
            product_name,
            description,
            retail_price: parseFloat(retail_price),
            wholesale_price: parseFloat(wholesale_price),
            stock: parseInt(stock),
            discount_percentage: parseFloat(discount_percentage) || 0,
            isActive: isActive === 'true',
            featured: featured === 'true',
            category_id: category_id || null,
            brand_id: brand_id || null,
            image_url
        });

        // 4. Aplicar descuento si corresponde
        if (nuevoProducto.discount_percentage && nuevoProducto.discount_percentage > 0) {
            const porcentaje_restante = (100 - nuevoProducto.discount_percentage) / 100;
            const precio_final_retail = Math.floor(nuevoProducto.retail_price * porcentaje_restante);
            const precio_final_wholesale = Math.floor(nuevoProducto.wholesale_price * porcentaje_restante);

            await nuevoProducto.update({
                retail_price_sale: precio_final_retail,
                wholesale_price_sale: precio_final_wholesale
            });
        }

        ctx.status = 201;
        ctx.body = nuevoProducto;

    } catch (error) {
        console.error('🔥 Error al crear producto:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error interno del servidor',
            message: error.message
        };
    }
});



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
                allProducts = await producto.findAll({ where: { isActive: true } });
            }
        } else {
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
router.patch('/:id', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../tmp'),
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024
    }
}), async (ctx) => {
    try {

        const file = ctx.request.files?.imagen;

        if (file) {
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'productos'
            });
            fs.unlinkSync(file.filepath);
            ctx.request.body.image_url = result.secure_url;
        }

        const prod = await producto.findByPk(ctx.params.id);
        prod.update(ctx.request.body);

        if (prod.discount_percentage > 0) {
            let precio_retail = prod.retail_price;
            let precio_wholesale = prod.wholesale_price;
            let porcentaje_descuento = prod.discount_percentage;
            let porcentaje_restante = (100 - porcentaje_descuento);
            let precio_final_retail = Math.floor((precio_retail * (porcentaje_restante / 100)));
            let precio_final_wholesale = Math.floor((precio_wholesale * (porcentaje_restante / 100)));

            await prod.update({ retail_price_sale: precio_final_retail, wholesale_price_sale: precio_final_wholesale });
        }
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