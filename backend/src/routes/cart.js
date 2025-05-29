// routes/cartRoutes.js
const Router = require('@koa/router');
const router = new Router();
const { Cart, CartItem, Product, User } = require('../models');
const authenticateToken = require('../middleware/auth'); // Middleware de autenticación

// Obtener carrito del usuario
router.get('/', authenticateToken, async (ctx) => {
    try {
        const userId = ctx.state.user.id;

        let cart = await Cart.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: CartItem,
                    as: 'cart_items',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        // Si no existe carrito, crearlo
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
            cart.cart_items = [];
        }

        ctx.body = {
            success: true,
            cart
        };
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor'
        };
    }
});

// Agregar producto al carrito
router.post('/add', authenticateToken, async (ctx) => {
    try {
        const { product_id, quantity = 1 } = ctx.request.body;
        const userId = ctx.state.user.id;

        // Verificar que el producto existe
        const product = await Product.findByPk(product_id);
        if (!product) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Producto no encontrado'
            };
            return;
        }

        // Obtener o crear carrito
        let cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }

        // Verificar si el producto ya está en el carrito
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_id: product_id
            }
        });

        if (cartItem) {
            // Si existe, actualizar cantidad
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Si no existe, crear nuevo item
            cartItem = await CartItem.create({
                cart_id: cart.id,
                product_id: product_id,
                quantity: quantity
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
            message: 'Error interno del servidor'
        };
    }
});

// Actualizar cantidad de producto en carrito
router.put('/update/:itemId', authenticateToken, async (ctx) => {
    try {
        const { itemId } = ctx.params;
        const { quantity } = ctx.request.body;
        const userId = ctx.state.user.id;

        // Verificar que el item pertenece al usuario
        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
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

        if (quantity <= 0) {
            await cartItem.destroy();
            ctx.body = {
                success: true,
                message: 'Producto eliminado del carrito'
            };
            return;
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        ctx.body = {
            success: true,
            message: 'Cantidad actualizada',
            cartItem
        };
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor'
        };
    }
});

// Eliminar producto del carrito
router.delete('/remove/:itemId', authenticateToken, async (ctx) => {
    try {
        const { itemId } = ctx.params;
        const userId = ctx.state.user.id;

        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
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
            message: 'Error interno del servidor'
        };
    }
});

// Limpiar carrito
router.delete('/clear', authenticateToken, async (ctx) => {
    try {
        const userId = ctx.state.user.id;

        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Carrito no encontrado'
            };
            return;
        }

        await CartItem.destroy({ where: { cart_id: cart.id } });

        ctx.body = {
            success: true,
            message: 'Carrito limpiado'
        };
    } catch (error) {
        console.error('Error al limpiar carrito:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error interno del servidor'
        };
    }
});

module.exports = router;