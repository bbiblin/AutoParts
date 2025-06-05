const nodemailer = require("nodemailer");
const Router = require('koa-router');
const router = new Router();
const { pedidos, detalle_pedido, cart, cart_item, producto } = require('../models');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "autopartscorreo@gmail.com",
        pass: " qeow aldf nowd jrhi",
    },
});


router.post('/enviarEmail', async (ctx) => {
    try {
        const { email, nombre, user_id, shipping_cost = 0, origen = 'web' } = ctx.request.body;

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
        const precio_total = userCart.cart_items.reduce((total, item) => {
            if (item.product.discount_percentage > 0) {
                return total + (item.product.wholesale_price_sale * item.quantity);
            } else {
                return total + (item.product.wholesale_price * item.quantity);
            }

        }, 0);

        const totalAmount = precio_total + shipping_cost;

        // Generar código de pedido único
        const codPedido = `PED-${Date.now()}-${user_id}`;

        // Crear pedido
        const nuevoPedido = await pedidos.create({
            cod_pedido: codPedido,
            user_id: user_id,
            state: 'pending',
            subtotal: precio_total,
            shipping_cost: shipping_cost,
            metodo_pago: 1, // 1 = WebPay
            origen: origen,
            is_pickup: true,
            fecha_pedido: Date.now(),
            precio_total: precio_total
        });

        // Crear detalles del pedido
        for (const item of userCart.cart_items) {
            if (item.product.discount_percentage > 0) {
                await detalle_pedido.create({
                    pedido_id: nuevoPedido.id,
                    product_id: item.product_id,
                    cantidad: item.quantity,
                    precio_unitario: item.product.wholesale_price_sale,
                    subtotal: item.product.wholesale_price_sale * item.quantity,
                    descuento_linea: 0
                });
            } else {
                await detalle_pedido.create({
                    pedido_id: nuevoPedido.id,
                    product_id: item.product_id,
                    cantidad: item.quantity,
                    precio_unitario: item.product.wholesale_price,
                    subtotal: item.product.wholesale_price * item.quantity,
                    descuento_linea: 0
                });
            }

        }

        const pedido = await pedidos.findOne({
            where: { id: nuevoPedido.id },
            include: [
                {
                    model: detalle_pedido,
                    as: 'detalles_pedido',
                    include: [
                        {
                            model: producto,
                            as: 'product'
                        }
                    ]
                }
            ]
        });


        const info = await transporter.sendMail({
            from: "autopartscorreo@gmail.com",
            to: email,
            subject: "Nueva Cotización - AutoParts",
            text: `
            Hola ${nombre},

            Hemos recibido una nueva cotización de su parte. A continuación los detalles:

            Número de Orden: ${codPedido}
            Fecha: ${new Date(nuevoPedido.createdAt).toLocaleString()}
            
            Productos solicitados:
            ${pedido.detalles_pedido.map(item => `${item.product.product_name} (Codigo Producto: ${item.product.product_cod || 'N/A'}) x ${item.cantidad} - $${(item.subtotal).toFixed(2)}`).join('\n')}

            Subtotal de tus productos: $${precio_total.toFixed(2)}

            Por favor, contactese con nuestro equipo a través de cualquiera de nuestros canales de contacto o acerquese a alguna sucursal
            para adquirir los productos.

            Saludos,
            Equipo de AutoParts.
        `,
        });

        if (pedido) {
            for (const item of pedido.detalles_pedido) {
                console.log('Producto:', item.product);
                const product = item.product;
                const nuevaCantidad = product.stock - item.cantidad;
                await product.update({ stock: nuevaCantidad });
            }

            await pedido.update({ state: 'cotización enviada' });
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        ctx.status = 200;
        ctx.body = { estado: "aceptado" };

    } catch (error) {
        console.error("No se pudo enviar el correo", error);
    }
});

module.exports = router;