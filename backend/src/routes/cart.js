// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { Cart, CartItem, Product, User } = require('../models');
const authenticateToken = require('../middleware/auth'); // Middleware de autenticación

// Obtener carrito del usuario
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

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

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Agregar producto al carrito
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const userId = req.user.id;

        // Verificar que el producto existe
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
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

        res.json({
            success: true,
            message: 'Producto agregado al carrito',
            cartItem
        });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Actualizar cantidad de producto en carrito
router.put('/update/:itemId', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

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
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        if (quantity <= 0) {
            await cartItem.destroy();
            return res.json({
                success: true,
                message: 'Producto eliminado del carrito'
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({
            success: true,
            message: 'Cantidad actualizada',
            cartItem
        });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Eliminar producto del carrito
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

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
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado'
            });
        }

        await cartItem.destroy();

        res.json({
            success: true,
            message: 'Producto eliminado del carrito'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Limpiar carrito
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        await CartItem.destroy({ where: { cart_id: cart.id } });

        res.json({
            success: true,
            message: 'Carrito limpiado'
        });
    } catch (error) {
        console.error('Error al limpiar carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;