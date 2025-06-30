const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const pedidosRouter = require('../src/routes/pedidos');
const jwt = require('jsonwebtoken');

jest.mock('../src/models', () => ({
    pedidos: {
        findAll: jest.fn(),
        destroy: jest.fn(),
    },
    detalle_pedido: {},
    producto: {},
    cart_item: {},
    User: {}
}));

const { pedidos } = require('../src/models');

const app = new Koa();
app.use(bodyParser());
app.use(pedidosRouter.routes());

const mockUser = { id: 99 };
const mockToken = jwt.sign(mockUser, 'secreto');

jest.mock('../src/middleware/auth', () => (ctx, next) => {
    ctx.state.user = { id: 99 };
    return next();
});

describe('Rutas /pedidos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('debe retornar todos los pedidos', async () => {
            pedidos.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });

        it('retorna 404 si no hay pedidos', async () => {
            pedidos.findAll.mockResolvedValue(null);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No se encontraron pedidos');
        });

        it('retorna 500 en caso de error', async () => {
            pedidos.findAll.mockRejectedValue(new Error('DB Error'));

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error interno del servidor');
        });
    });

    describe('GET /usuario', () => {
        it('debe retornar los pedidos del usuario autenticado', async () => {
            const mockPedidos = [{ id: 1, user_id: 99 }];
            pedidos.findAll.mockResolvedValue(mockPedidos);

            const res = await request(app.callback())
                .get('/usuario')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPedidos);
        });

        it('retorna 500 si falla la búsqueda de pedidos', async () => {
            pedidos.findAll.mockRejectedValue(new Error('DB Error'));

            const res = await request(app.callback())
                .get('/usuario')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error interno del servidor');
        });
    });

    describe('DELETE /:id', () => {
        it('elimina un pedido exitosamente', async () => {
            pedidos.destroy.mockResolvedValue(1);

            const res = await request(app.callback()).delete('/123');

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('eliminado');
        });

        it('retorna 404 si el pedido no existe', async () => {
            pedidos.destroy.mockResolvedValue(0);

            const res = await request(app.callback()).delete('/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Pedido no encontrado');
        });

        it('retorna 500 si ocurre un error', async () => {
            pedidos.destroy.mockRejectedValue(new Error('DB error'));

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('DB error');
        });
    });
});
