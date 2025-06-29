jest.mock('../src/models', () => ({
    User: {
        findAll: jest.fn()
    }
}));

const { User } = require('../src/models');
const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const userRouter = require('../src/routes/users'); // ajusta si está en otro lugar

const app = new Koa();
const router = new Router();

// montar el router bajo la ruta que usarás
router.use(userRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('User routes', () => {
    it('GET /distribuitor should return distribuitor users', async () => {
        const mockUsers = [
            { id: 1, isDistribuitor: true },
            { id: 2, isDistribuitor: true }
        ];

        User.findAll.mockResolvedValue(mockUsers);

        const res = await request(app.callback()).get('/distribuitor');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
        expect(User.findAll).toHaveBeenCalledWith({ where: { isDistribuitor: true } });
    });
});
