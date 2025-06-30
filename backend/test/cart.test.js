const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

jest.mock('../src/models', () => ({
    cart: {
        findOne: jest.fn(),
        create: jest.fn()
    },
    cart_item: {
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    },
    producto: {
        findByPk: jest.fn()
    },
    User: {}
}));

jest.mock('../src/middleware/auth', () => jest.fn((ctx, next) => {
    ctx.state.user = { id: 1 };
    return next();
}));

const { cart, cart_item, producto } = require('../src/models');
const cartRouter = require('../src/routes/cart');

const app = new Koa();
const router = new Router();
router.use(cartRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('Cart Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('debe retornar el carrito existente', async () => {
            const mockCart = { id: 1, cart_items: [] };
            cart.findOne.mockResolvedValue(mockCart);

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(200);
            expect(res.body.cart).toEqual(mockCart);
        });

        it('debe crear un carrito si no existe', async () => {
            cart.findOne.mockResolvedValue(null);
            const newCart = { id: 99, cart_items: [] };
            cart.create.mockResolvedValue(newCart);

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(200);
            expect(cart.create).toHaveBeenCalledWith({ user_id: 1 });
            expect(res.body.cart).toEqual(newCart);
        });

        it('debe manejar errores del servidor', async () => {
            cart.findOne.mockRejectedValue(new Error('DB Error'));

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /add', () => {
        it('agrega producto nuevo al carrito', async () => {
            const product = { id: 10, retail_price: 20, stock: 10 };
            producto.findByPk.mockResolvedValue(product);
            cart.findOne.mockResolvedValue({ id: 1 });
            cart_item.findOne.mockResolvedValue(null);
            cart_item.create.mockResolvedValue({ id: 123, quantity: 1 });

            const res = await request(app.callback())
                .post('/add')
                .send({ product_id: 10, quantity: 1 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('incrementa cantidad si producto ya está en el carrito', async () => {
            const product = { id: 10, retail_price: 20, stock: 5 };
            const existingItem = { quantity: 2, save: jest.fn() };

            producto.findByPk.mockResolvedValue(product);
            cart.findOne.mockResolvedValue({ id: 1 });
            cart_item.findOne.mockResolvedValue(existingItem);

            const res = await request(app.callback())
                .post('/add')
                .send({ product_id: 10, quantity: 1 });

            expect(existingItem.save).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('retorna error si el producto no existe', async () => {
            producto.findByPk.mockResolvedValue(null);

            const res = await request(app.callback())
                .post('/add')
                .send({ product_id: 999, quantity: 1 });

            expect(res.status).toBe(404);
        });

        it('maneja errores del servidor', async () => {
            producto.findByPk.mockRejectedValue(new Error('Error'));

            const res = await request(app.callback())
                .post('/add')
                .send({ product_id: 1, quantity: 1 });

            expect(res.status).toBe(500);
        });
    });

    describe('PUT /update/:itemId', () => {
        it('actualiza cantidad de un item', async () => {
            const mockItem = {
                id: 5,
                product_id: 10,
                quantity: 1,
                cart: { user_id: 1 },
                save: jest.fn()
            };
            cart_item.findOne.mockResolvedValue(mockItem);
            producto.findByPk.mockResolvedValue({ id: 10, stock: 5 });

            const res = await request(app.callback())
                .put('/update/5')
                .send({ quantity: 3 });

            expect(mockItem.save).toHaveBeenCalled();
            expect(res.status).toBe(200);
        });

        it('retorna error si el producto no tiene suficiente stock', async () => {
            const mockItem = {
                product_id: 10,
                cart: { user_id: 1 },
                quantity: 1,
                save: jest.fn()
            };
            cart_item.findOne.mockResolvedValue(mockItem);
            producto.findByPk.mockResolvedValue({ stock: 1 });

            const res = await request(app.callback())
                .put('/update/5')
                .send({ quantity: 99 });

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /remove/:itemId', () => {
        it('elimina item del carrito', async () => {
            const mockItem = {
                destroy: jest.fn(),
                cart: { user_id: 1 }
            };
            cart_item.findOne.mockResolvedValue(mockItem);

            const res = await request(app.callback()).delete('/remove/5');

            expect(mockItem.destroy).toHaveBeenCalled();
            expect(res.status).toBe(200);
        });

        it('retorna 404 si el item no existe', async () => {
            cart_item.findOne.mockResolvedValue(null);

            const res = await request(app.callback()).delete('/remove/999');

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /clear', () => {
        it('limpia el carrito del usuario', async () => {
            cart.findOne.mockResolvedValue({ id: 5 });
            cart_item.destroy.mockResolvedValue(3);

            const res = await request(app.callback()).delete('/clear');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Carrito limpiado');
        });

        it('retorna 404 si no hay carrito', async () => {
            cart.findOne.mockResolvedValue(null);

            const res = await request(app.callback()).delete('/clear');
            expect(res.status).toBe(404);
        });
    });
});
