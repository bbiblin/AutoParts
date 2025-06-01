const Router = require('koa-router');
const router = new Router();

import mercadopago from 'mercadopago';

// Configurar MercadoPago una sola vez
mercadopago.configure({
  access_token: "APP_USR-5300638015940337-060116-e4e5376d3729e00a49105fd252aa50d1-2473991872",
});

export const createOrder = async (ctx) => {
  try {
    const result = await mercadopago.preferences.create({
      items: [
        {
          title: "Laptop",
          unit_price: 500,
          currency_id: "PEN",
          quantity: 1,
        },
      ],
      notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
      back_urls: {
        success: "http://localhost:3000/success",
        // pending: "http://localhost:3000/pending",
        // failure: "http://localhost:3000/failure",
      },
    });

    console.log(result);
    ctx.body = result.body; // Retornar el cuerpo de la respuesta
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: "Something went wrong" };
  }
};

export const receiveWebhook = async (ctx) => {
  try {
    const payment = ctx.query;
    console.log(payment);

    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data.response);
    }

    ctx.status = 204; // No content
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: "Something went wrong" };
  }
};

module.exports = router;