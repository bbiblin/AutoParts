// routes/webpay.js
const Router = require('koa-router');
const { pedidos, detalle_pedido, cart, cart_item } = require('../models');
const webpayService = require('../services/webpayService');

const router = new Router({ prefix: '/api/webpay' });

/**
 * Crear pedido desde carrito y generar transacción WebPay
 * POST /api/webpay/create-order
 */
router.post('/create-order', async (ctx) => {
    try {
        const { user_id, shipping_cost = 0, origen = 'web' } = ctx.request.body;

        if (!user_id) {
            ctx.status = 400;
            ctx.body = { error: 'user_id es requerido' };
            return;
        }

        // Buscar carrito del usuario con items
        const userCart = await cart.findOne({
            where: { user_id },
            include: [
                {
                    association: 'cart_items',
                    include: ['product']
                }
            ]
        });

        if (!userCart || !userCart.cart_items?.length) {
            ctx.status = 400;
            ctx.body = { error: 'Carrito vacío o no encontrado' };
            return;
        }

        // Calcular subtotal
        const subtotal = userCart.cart_items.reduce((total, item) => {
            return total + (item.precio_unitario * item.quantity);
        }, 0);

        const totalAmount = subtotal + shipping_cost;

        // Generar código de pedido único
        const codPedido = `PED-${Date.now()}-${user_id}`;

        // Crear pedido
        const nuevoPedido = await pedidos.create({
            cod_pedido: codPedido,
            user_id: user_id,
            state: 'pending',
            subtotal: subtotal,
            shipping_cost: shipping_cost,
            metodo_pago: 1, // 1 = WebPay
            origen: origen
        });

        // Crear detalles del pedido
        for (const item of userCart.cart_items) {
            await detalle_pedido.create({
                pedido_id: nuevoPedido.id,
                product_id: item.product_id,
                cantidad: item.quantity,
                precio_unitario: item.precio_unitario,
                subtotal: item.precio_unitario * item.quantity,
                descuento_linea: 0
            });
        }

        // Generar session_id único
        const sessionId = `SID-${user_id}-${Date.now()}`;

        // Crear transacción WebPay
        const webpayTransaction = await webpayService.createTransaction({
            pedidoId: nuevoPedido.id,
            amount: totalAmount,
            sessionId: sessionId
        });

        // Limpiar carrito después de crear el pedido
        await cart_item.destroy({
            where: { cart_id: userCart.id }
        });

        ctx.body = {
            success: true,
            pedido: {
                id: nuevoPedido.id,
                cod_pedido: codPedido,
                subtotal: subtotal,
                shipping_cost: shipping_cost,
                total: totalAmount
            },
            webpay: {
                token: webpayTransaction.token,
                url: webpayTransaction.url,
                buyOrder: webpayTransaction.buyOrder
            }
        };

    } catch (error) {
        console.error('Error creating order:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error al crear pedido',
            details: error.message
        };
    }
});

/**
 * Confirmar pago WebPay
 * POST /api/webpay/confirm
 */
router.post('/confirm', async (ctx) => {
    try {
        const { token_ws } = ctx.request.body;

        if (!token_ws) {
            ctx.status = 400;
            ctx.body = { error: 'Token WebPay es requerido' };
            return;
        }

        // Confirmar transacción
        const confirmation = await webpayService.confirmTransaction(token_ws);

        ctx.body = {
            success: confirmation.success,
            pedido: {
                id: confirmation.pedido.id,
                cod_pedido: confirmation.pedido.cod_pedido,
                state: confirmation.pedido.state,
                total: confirmation.webpayResponse.amount
            },
            webpay: {
                authorizationCode: confirmation.authorizationCode,
                amount: confirmation.amount,
                success: confirmation.success
            }
        };

    } catch (error) {
        console.error('Error confirming payment:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error al confirmar pago',
            details: error.message
        };
    }
});

/**
 * Obtener estado de transacción
 * GET /api/webpay/status/:token
 */
router.get('/status/:token', async (ctx) => {
    try {
        const { token } = ctx.params;

        const status = await webpayService.getTransactionStatus(token);

        ctx.body = {
            success: true,
            status: status
        };

    } catch (error) {
        console.error('Error getting transaction status:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error al obtener estado de transacción',
            details: error.message
        };
    }
});

/**
 * Anular transacción
 * POST /api/webpay/refund
 */
router.post('/refund', async (ctx) => {
    try {
        const { token, amount } = ctx.request.body;

        if (!token || !amount) {
            ctx.status = 400;
            ctx.body = { error: 'Token y monto son requeridos' };
            return;
        }

        const refund = await webpayService.refundTransaction(token, amount);

        ctx.body = {
            success: refund.success,
            refund: refund.response
        };

    } catch (error) {
        console.error('Error refunding transaction:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error al anular transacción',
            details: error.message
        };
    }
});

/**
 * Obtener pedido por ID
 * GET /api/webpay/order/:id
 */
router.get('/order/:id', async (ctx) => {
    try {
        const { id } = ctx.params;

        const pedido = await pedidos.findByPk(id, {
            include: [
                {
                    association: 'detalles_pedido',
                    include: ['product']
                },
                { association: 'user' }
            ]
        });

        if (!pedido) {
            ctx.status = 404;
            ctx.body = { error: 'Pedido no encontrado' };
            return;
        }

        ctx.body = {
            success: true,
            pedido: pedido
        };

    } catch (error) {
        console.error('Error getting order:', error);
        ctx.status = 500;
        ctx.body = {
            error: 'Error al obtener pedido',
            details: error.message
        };
    }
});

module.exports = router;