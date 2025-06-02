const Router = require('koa-router');
const router = new Router();

const mercadopago = require('mercadopago');

// Configurar MercadoPago una sola vez
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: "APP_USR-5300638015940337-060116-e4e5376d3729e00a49105fd252aa50d1-2473991872",
});


// Crear orden desde el carrito
router.post('/create-order/:cartId', async (ctx) => {
  try {
    const { cartId } = ctx.params;

    const userCart = await cart.findByPk(cartId, {
      include: {
        model: cart_item,
        as: 'items',
        include: {
          model: producto,
          as: 'producto'
        }
      }
    });

    if (!userCart || userCart.items.length === 0) {
      ctx.throw(400, 'Carrito no válido o vacío');
    }

    // Crear el pedido
    const newPedido = await pedido.create({
      cart_id: cartId,
      total: 0, // Lo actualizaremos luego
      status: 'pending',
    });

    let total = 0;
    const items = [];

    for (const item of userCart.items) {
      const prod = item.producto;
      const quantity = item.quantity;

      const price = prod.retail_price_sale || prod.retail_price;
      const subtotal = price * quantity;
      total += subtotal;

      // Detalle de pedido
      await detalle_pedido.create({
        pedido_id: newPedido.id,
        producto_id: prod.id,
        quantity,
        price,
        subtotal
      });

      // Ítems para MercadoPago
      items.push({
        title: prod.product_name,
        unit_price: price,
        quantity,
        currency_id: "PEN"
      });
    }

    // Actualizar total en el pedido
    await newPedido.update({ total });

    // Crear preferencia de MercadoPago
    const result = await mp.preferences.create({
      items,
      back_urls: {
        success: "http://localhost:3000/success",
      },
      notification_url: "https://tu-app.ngrok.io/webhook",
      external_reference: newPedido.id.toString()
    });

    ctx.body = { init_point: result.body.init_point, id: result.body.id };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: "Error al crear orden" };
  }
});

// Webhook para recibir notificación
router.post('/webhook', async (ctx) => {
  try {
    const { type, data } = ctx.request.body;

    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      const { external_reference, status } = payment.response;

      const pedidoId = parseInt(external_reference);
      const estado = status === 'approved' ? 'paid' : 'failed';

      await pedido.update({ status: estado }, {
        where: { id: pedidoId }
      });

      console.log(`Pago actualizado para pedido ${pedidoId}: ${estado}`);
    }

    ctx.status = 204;
  } catch (error) {
    console.error('Webhook error', error);
    ctx.status = 500;
    ctx.body = { message: "Error en webhook" };
  }
});

module.exports = router;