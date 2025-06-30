const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

// Mocks
jest.mock('../src/models', () => ({
    brand: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    }
}));

const { brand } = require('../src/models');
const brandRouter = require('../src/routes/brands');

const app = new Koa();
const router = new Router();

router.use(brandRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('Brand Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
        console.log.mockRestore();
    });

    describe('GET /', () => {
        it('debe retornar todas las marcas', async () => {
            const mockBrands = [{
                id: 1, brand_name: 'Nike'
            }];

            brand.findAll.mockResolvedValue(mockBrands);

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockBrands);
        });

        it('debe retornar 404 si no hay marcas', async () => {
            brand.findAll.mockResolvedValue(null);

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Entry not found' });
        });

        it('debe manejar errores', async () => {
            brand.findAll.mockRejectedValue(new Error('Error de BD'));

            const res = await request(app.callback()).get('/');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error de BD' });
        });
    });

    describe('GET /:id', () => {
        const mockBrand = {
            id: 1, brand_name: 'Adidas'
        };

        it('debe retornar una marca por id exitosamente', async () => {
            brand.findByPk.mockResolvedValue(mockBrand);

            const res = await request(app.callback()).get('/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockBrand);
            expect(brand.findByPk).toHaveBeenCalledWith('1');
        });

        it('debe retornar 404 si no se encuentra la marca', async () => {
            brand.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).get('/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'No se encontró la marca' });
        });

        it('debe manejar errores de base de datos', async () => {
            const error = new Error('Database error');
            brand.findByPk.mockRejectedValue(error);

            const res = await request(app.callback()).get('/1');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /', () => {
        const newBrand = {
            brand_name: 'Puma'
        };

        it('debe crear una marca si no existe', async () => {
            brand.findOne.mockResolvedValue(null);
            brand.create.mockResolvedValue({ id: 1, ...newBrand });

            const res = await request(app.callback()).post('/').send(newBrand);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: 1, ...newBrand });
        });

        it('debe retornar 409 si ya existe la marca', async () => {
            brand.findOne.mockResolvedValue({ id: 2, ...newBrand });

            const res = await request(app.callback()).post('/').send(newBrand);
            expect(res.status).toBe(409);
            expect(res.body).toEqual({ error: 'Ya existe una marca con este nombre' });
        });

        it('debe manejar errores de base de datos', async () => {
            brand.findOne.mockResolvedValue(null);
            brand.create.mockRejectedValue(new Error('DB Error'));

            const res = await request(app.callback()).post('/').send(newBrand);
            expect(res.status).toBe(500);
        });
    });

    describe('PATCH /:id', () => {
        const existingBrand = {
            id: 1,
            brand_name: 'Reebok',
            update: jest.fn(function (data) {
                Object.assign(this, data);
                return Promise.resolve(this);
            })
        };

        it('debe actualizar la marca exitosamente', async () => {
            brand.findByPk.mockResolvedValue(existingBrand);
            const updateData = { brand_name: 'Reebok Updated' };

            const res = await request(app.callback()).patch('/1').send(updateData);
            expect(res.status).toBe(200);
            expect(res.body.brand_name).toBe('Reebok Updated');
        });

        it('debe retornar 404 si la marca no existe', async () => {
            brand.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).patch('/999').send({ brand_name: 'Otra' });
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Marca no encontrada' });
        });

        it('debe manejar errores de base de datos al actualizar', async () => {
            const error = new Error('Database error');
            brand.findByPk.mockRejectedValue(error);

            const res = await request(app.callback()).patch('/1').send({ brand_name: 'X' });
            expect(res.status).toBe(500);
        });
    });

    describe('DELETE /:id', () => {
        const mockBrand = {
            id: 1,
            brand_name: 'Para Borrar'
        };

        it('debe eliminar la marca correctamente', async () => {
            brand.findByPk.mockResolvedValue(mockBrand);
            brand.destroy.mockResolvedValue(1);

            const res = await request(app.callback()).delete('/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: 'Marca eliminada exitosamente',
                data: {
                    id: '1',
                    name: 'Para Borrar'
                }
            });
        });

        it('debe retornar 404 si la marca no existe', async () => {
            brand.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).delete('/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Marca no encontrada' });
        });

        it('debe manejar errores de base de datos', async () => {
            const error = new Error('Database error');
            brand.findByPk.mockRejectedValue(error);

            const res = await request(app.callback()).delete('/1');
            expect(res.status).toBe(500);
        });
    });
});
