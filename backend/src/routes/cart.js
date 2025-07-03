const Router = require('@koa/router');
const router = new Router();
const { cart, cart_item, producto, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// Obtener carrito del usuario
router.get('/', authenticateToken, async (ctx) => {
    try {
        const user = ctx.state.user;

        let carrito = await cart.findOne({
            where: { user_id: user.id },
            include: [
                {
                    model: cart_item,
                    as: 'cart_items',
                    include: [
                        {
                            model: producto,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        // Si no existe carrito, crearlo
        if (!carrito) {
            carrito = await cart.create({ user_id: user.id });
            carrito.cart_items = [];
        }


        ctx.body = {
            success: true,
            cart: carrito
        };
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
});

// Agregar producto al carrito
router.post('/add', authenticateToken, async (ctx) => {
    try {
        const { product_id, quantity = 1 } = ctx.request.body;

        if (!ctx.state.user) {
            ctx.status = 401;
            ctx.body = { success: false, message: 'Usuario no autenticado' };
            return;
        }

        const userId = ctx.state.user.id;

        // Validar datos de entrada
        if (!product_id || quantity <= 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Datos inválidos: product_id y quantity son requeridos'
            };
            return;
        }

        // Verificar que el producto existe
        const productFound = await producto.findByPk(product_id);
        if (!productFound) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Producto no encontrado'
            };
            return;
        }

        // Obtener o crear carrito
        let carrito = await cart.findOne({ where: { user_id: userId } });
        if (!carrito) {
            carrito = await cart.create({ user_id: userId });
        }

        // Verificar si el producto ya está en el carrito
        let cartItem = await cart_item.findOne({
            where: {
                cart_id: carrito.id,
                product_id: product_id
            }
        });

        if (cartItem) {
            // Si existe, actualizar cantidad
            if (cartItem.quantity >= productFound.stock) {
                ctx.status = 400;
                ctx.body = {
                    success: false,
                    message: 'Producto no agregado al carrito',
                    cartItem
                };
                return;
            }

            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            if (productFound.stock === 0) {
                ctx.status = 400;
                ctx.body = {
                    success: false,
                    message: 'Producto no agregado al carrito'
                };
                return;
            }

            cartItem = await cart_item.create({
                cart_id: carrito.id,
                product_id: product_id,
                quantity: quantity,
                precio_unitario: productFound.retail_price
            });
        }

        ctx.body = {
            success: true,
            message: 'Producto agregado al carrito',
            cartItem
        };
    } catch (error) {
        console.error('Error al agregar producto:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
});

// Actualizar cantidad de producto en carrito
router.put('/update/:itemId', authenticateToken, async (ctx) => {
    try {
        const { itemId } = ctx.params;
        const { quantity } = ctx.request.body;
        const userId = ctx.state.user.id;


        if (!quantity || quantity < 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Cantidad inválida'
            };
            return;
        }

        const cartItem = await cart_item.findOne({
            where: { id: itemId },
            include: [
                {
                    model: cart,
                    as: 'cart',
                    where: { user_id: userId }
                }
            ]
        });

        if (!cartItem) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Item no encontrado'
            };
            return;
        }

        if (quantity === 0) {
            await cartItem.destroy();
            ctx.body = {
                success: true,
                message: 'Producto eliminado del carrito'
            };
            return;
        }

        const product = await producto.findByPk(cartItem.product_id);
        if (!product) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "No existe el producto"
            };
            return;
        }

        if (quantity <= product.stock) {
            cartItem.quantity = quantity;
            await cartItem.save();
            ctx.body = {
                success: true,
                message: 'Cantidad actualizada',
                cartItem
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: "No hay suficiente stock del producto"
            };
        }

    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
});


// Eliminar producto del carrito
router.delete('/remove/:itemId', authenticateToken, async (ctx) => {
    try {
        const { itemId } = ctx.params;
        const userId = ctx.state.user.id;

        // Verificar que el item pertenece al usuario
        const cartItem = await cart_item.findOne({
            where: { id: itemId },
            include: [
                {
                    model: cart,
                    as: 'cart',
                    where: { user_id: userId }
                }
            ]
        });

        if (!cartItem) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Item no encontrado'
            };
            return;
        }

        await cartItem.destroy();

        ctx.body = {
            success: true,
            message: 'Producto eliminado del carrito'
        };
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
});

// Limpiar carrito completo
router.delete('/clear', authenticateToken, async (ctx) => {
    try {
        const userId = ctx.state.user.id;


        const carrito = await cart.findOne({ where: { user_id: userId } });
        if (!carrito) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Carrito no encontrado'
            };
            return;
        }

        // Eliminar todos los items del carrito
        await cart_item.destroy({ where: { cart_id: carrito.id } });

        ctx.body = {
            success: true,
            message: 'Carrito limpiado'
        };
    } catch (error) {
        console.error('Error al limpiar carrito:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
});

module.exports = router;