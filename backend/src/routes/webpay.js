// routes/webpay.js
const Router = require('koa-router');
const { pedidos, detalle_pedido, cart, cart_item, producto } = require('../models');
const WebpayPlus = require('transbank-sdk').WebpayPlus;
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); 

const router = new Router();

/**
 * Crear pedido desde carrito y generar transacción WebPay
 * POST /api/webpay/create-order
 */
router.post('/create-order', async (ctx) => {
    console.log("Llamando a crear orden");
    try {
        console.log('Endpoint /create-order llamado');
        console.log('Body recibido:', ctx.request.body);
        const { user_id, shipping_cost = 0, origen = 'web' } = ctx.request.body;


        if (!user_id) {
            ctx.status = 400;
            ctx.body = { error: 'user_id es requerido' };
            return;
        }

        // Buscar carrito del usuario con items
        const userCart = await cart.findOne({
            where: { user_id: user_id },
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
            if (item.product.discount_percentage > 0) {
                return total + (item.product.retail_price_sale * item.quantity);
            } else {
                return total + (item.precio_unitario * item.quantity);
            }
            
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
            origen: origen,
            is_pickup: true,
            fecha_pedido: Date.now(),
            precio_total: subtotal
        });

        // Crear detalles del pedido
        for (const item of userCart.cart_items) {
            if (item.product.discount_percentage > 0) {
                await detalle_pedido.create({
                pedido_id: nuevoPedido.id,
                product_id: item.product_id,
                cantidad: item.quantity,
                precio_unitario: item.product.retail_price_sale,
                subtotal: item.product.retail_price_sale * item.quantity,
                descuento_linea: 0
            });
            } else {
                await detalle_pedido.create({
                pedido_id: nuevoPedido.id,
                product_id: item.product_id,
                cantidad: item.quantity,
                precio_unitario: item.precio_unitario,
                subtotal: item.precio_unitario * item.quantity,
                descuento_linea: 0
            });
            }
            
        }

        // Generar session_id único
        const sessionId = `SID-${user_id}-${Date.now()}`;

        // Crear transacción WebPay
        const webpayTransaction = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        
        const returnUrl = "http://localhost:3000/webpay/confirm"
        const response = await webpayTransaction.create(codPedido, sessionId, totalAmount, returnUrl);

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
                token: response.token,
                url: response.url,
                buyOrder: codPedido
            }
        };

        console.log('Resp webpay: ' + response)
        console.log('Body retorno webpay: ' + ctx.body);

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
    const { token_ws } = ctx.request.body;

    if (!token_ws) {
        ctx.status = 400;
        ctx.body = { error: 'Token WebPay es requerido' };
        return;
    }

    const tx = new WebpayPlus.Transaction(new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
    ));

    try {
        const response = await tx.commit(token_ws);

        if (response.status === 'AUTHORIZED') {
            const pedido = await pedidos.findOne({ where: {
                cod_pedido: response.buy_order
            }, include: [{ model: detalle_pedido, as: 'detalles_pedido', include: [{
                model: producto,
                as: 'product'
            }] }]
            });

            if (pedido) {
                for (const item of pedido.detalles_pedido) {
                    console.log('Producto:', item.product);
                    const product = item.product;
                    const nuevaCantidad = product.stock - item.cantidad;
                    await product.update({ stock: nuevaCantidad });
                }

                await pedido.update({ state: 'pagado' }); // opcional: marcar como pagado
            }
        } else if (response.status === 'FAILED'){
            const pedido = await pedidos.findOne({ where: {
                cod_pedido: response.buy_order
            }, include: [{ model: detalle_pedido, as: 'detalles_pedido', include: [{
                model: producto,
                as: 'product'
            }] }]
            });

            await pedido.update({ state: 'Rechazado' }); // opcional: marcar como pagado
            
        }
        ctx.body = { webpay: response };
    } catch (error) {
        // Si ya fue confirmado, se puede consultar estado
        if (error.message.includes('Transaction already locked')) {
            try {
                const fallbackResponse = await tx.status(token_ws);
                ctx.body = { webpay: fallbackResponse };
            } catch (fallbackError) {
                console.error('Error en fallback status:', fallbackError);
                ctx.status = 500;
                ctx.body = { error: 'Error al consultar estado de transacción', details: fallbackError.message };
            }
        } else {
            console.error('Error confirming payment:', error);
            ctx.status = 500;
            ctx.body = { error: 'Error al confirmar pago', details: error.message };
        }
    }
});


/**
 * Obtener estado de transacción
 * GET /api/webpay/status/:token
 */
router.get('/status/:token', async (ctx) => {
    try {
        const { token } = ctx.params.token;

        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.status(token);

        ctx.body = {
            webpay: {
                vci: response.vci,
                amount: response.amount,
                status: response.status,
                buy_order: response.buy_order,
                session_id: response.session_id,
                card_detail: response.card_detail,
                accounting_date: response.accounting_date,
                transaction_date: response.transaction_date,
                authorization_code: response.authorization_code,
                payment_type_code: response.payment_type_code,
                response_code: response.response_code,
                installments_amount: response.installments_amount,
                installments_number: response.installments_number,
                balance: response.balance
            }
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

module.exports = router;