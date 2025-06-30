const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('../src/routes/webpay');

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());

const mockCreate = jest.fn();
const mockCommit = jest.fn();
const mockStatus = jest.fn();

jest.mock('transbank-sdk', () => {
    return {
        WebpayPlus: {
            Transaction: class {
                constructor() {
                    this.create = mockCreate;
                    this.commit = mockCommit;
                    this.status = mockStatus;
                }
            }
        },
        Options: class { },
        IntegrationApiKeys: { WEBPAY: 'mock-api-key' },
        Environment: { Integration: 'integration' },
        IntegrationCommerceCodes: { WEBPAY_PLUS: 'mock-code' }
    };
});

jest.mock('../src/models', () => ({
    pedidos: {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn()
    },
    detalle_pedido: {
        create: jest.fn()
    },
    cart: {
        findOne: jest.fn()
    },
    cart_item: {
        destroy: jest.fn()
    },
    producto: {
        update: jest.fn()
    }
}));

const { pedidos, detalle_pedido, cart, cart_item, producto } = require('../src/models');

describe('Webpay Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /create-order - debe crear pedido y retornar token webpay', async () => {
        cart.findOne.mockResolvedValue({
            id: 1,
            cart_items: [
                {
                    quantity: 2,
                    precio_unitario: 1000,
                    product_id: 1,
                    product: {
                        retail_price_sale: 900,
                        discount_percentage: 10
                    }
                }
            ]
        });

        pedidos.create.mockResolvedValue({ id: 1 });
        detalle_pedido.create.mockResolvedValue({});
        cart_item.destroy.mockResolvedValue();

        mockCreate.mockResolvedValue({ token: 'mock-token', url: 'https://mock-webpay.cl', buyOrder: 'PED-123' });

        const res = await request(app.callback())
            .post('/create-order')
            .send({ user_id: 1 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.webpay.token).toBe('mock-token');
    });

    it('POST /create-order - sin user_id retorna 400', async () => {
        const res = await request(app.callback()).post('/create-order').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('user_id es requerido');
    });

    it('POST /create-order - carrito vacío o no encontrado', async () => {
        cart.findOne.mockResolvedValue(null);

        const res = await request(app.callback())
            .post('/create-order')
            .send({ user_id: 1 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Carrito vacío o no encontrado');
    });

    it('POST /create-order - producto sin descuento usa precio_unitario', async () => {
        cart.findOne.mockResolvedValue({
            id: 1,
            cart_items: [
                {
                    quantity: 2,
                    precio_unitario: 1000,
                    product_id: 1,
                    product: {
                        retail_price_sale: 900,
                        discount_percentage: 0
                    }
                }
            ]
        });

        pedidos.create.mockResolvedValue({ id: 1 });
        detalle_pedido.create.mockResolvedValue({});
        cart_item.destroy.mockResolvedValue();

        mockCreate.mockResolvedValue({ token: 'mock-token', url: 'https://mock-webpay.cl', buyOrder: 'PED-123' });

        const res = await request(app.callback())
            .post('/create-order')
            .send({ user_id: 1 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.webpay.token).toBe('mock-token');
    });

    it('POST /create-order - error interno retorna 500', async () => {
        cart.findOne.mockRejectedValue(new Error('Fallo DB'));

        const res = await request(app.callback()).post('/create-order').send({ user_id: 1 });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Error al crear pedido');
        expect(res.body.details).toBe('Fallo DB');
    });

    it('POST /confirm - transacción autorizada actualiza estado del pedido', async () => {
        mockCommit.mockResolvedValue({
            status: 'AUTHORIZED',
            buy_order: 'PED-123'
        });

        pedidos.findOne.mockResolvedValue({
            detalles_pedido: [
                {
                    cantidad: 1,
                    product: {
                        stock: 5,
                        update: jest.fn()
                    }
                }
            ],
            update: jest.fn()
        });

        const res = await request(app.callback()).post('/confirm').send({ token_ws: 'mock-token' });

        expect(res.status).toBe(200);
        expect(res.body.webpay.status).toBe('AUTHORIZED');
    });

    it('POST /confirm - transacción fallida actualiza a Rechazado', async () => {
        mockCommit.mockResolvedValue({
            status: 'FAILED',
            buy_order: 'PED-456'
        });

        pedidos.findOne.mockResolvedValue({ update: jest.fn() });

        const res = await request(app.callback()).post('/confirm').send({ token_ws: 'mock-token' });

        expect(res.status).toBe(200);
        expect(res.body.webpay.status).toBe('FAILED');
    });

    it('POST /confirm - fallback en transacción ya confirmada', async () => {
        mockCommit.mockRejectedValue(new Error('Transaction already locked'));

        mockStatus.mockResolvedValue({
            status: 'AUTHORIZED',
            buy_order: 'PED-789'
        });

        const res = await request(app.callback()).post('/confirm').send({ token_ws: 'mock-token' });

        expect(res.status).toBe(200);
        expect(res.body.webpay.status).toBe('AUTHORIZED');
    });

    it('POST /confirm - token faltante devuelve 400', async () => {
        const res = await request(app.callback()).post('/confirm').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Token WebPay es requerido');
    });

    it('POST /confirm - error inesperado devuelve 500', async () => {
        mockCommit.mockRejectedValue(new Error('Fallo inesperado'));

        const res = await request(app.callback()).post('/confirm').send({ token_ws: 'mock-token' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Error al confirmar pago');
        expect(res.body.details).toBe('Fallo inesperado');
    });

    it('GET /status/:token - retorna estado de transacción', async () => {
        mockStatus.mockResolvedValue({
            status: 'AUTHORIZED',
            buy_order: 'PED-999'
        });

        const res = await request(app.callback()).get('/status/mock-token');

        expect(res.status).toBe(200);
        expect(res.body.webpay.status).toBe('AUTHORIZED');
        expect(res.body.webpay.buy_order).toBe('PED-999');
    });

    it('GET /status/:token - error al obtener estado', async () => {
        mockStatus.mockRejectedValue(new Error('Fallo al obtener estado'));

        const res = await request(app.callback()).get('/status/mock-token');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Error al obtener estado de transacción');
        expect(res.body.details).toBe('Fallo al obtener estado');
    });
});
