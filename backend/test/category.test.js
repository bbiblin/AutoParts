const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

// Mocks
jest.mock('../src/models', () => ({
    category: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    }
}));

const { category } = require('../src/models');
const categoryRouter = require('../src/routes/category');

const app = new Koa();
const router = new Router();

router.use(categoryRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('Category Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('GET /', () => {
        const mockCategories = [
            { id: 1, cate_name: 'Categoría 1', cat_descr: 'Descripción 1' },
            { id: 2, cate_name: 'Categoría 2', cat_descr: 'Descripción 2' }
        ];

        it('debe retornar todas las categorías exitosamente', async () => {
            category.findAll.mockResolvedValue(mockCategories);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockCategories);
            expect(category.findAll).toHaveBeenCalledWith();
        });

        it('debe retornar 404 cuando no hay categorías', async () => {
            category.findAll.mockResolvedValue(null);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Entry not found' });
        });

        it('debe manejar errores de base de datos al obtener categorías', async () => {
            const error = new Error('Database error');
            category.findAll.mockRejectedValue(error);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /:id', () => {
        const mockCategory = {
            id: 1,
            cate_name: 'Test Category',
            cat_descr: 'Test Description'
        };

        it('debe retornar categoría por id exitosamente', async () => {
            category.findByPk.mockResolvedValue(mockCategory);

            const res = await request(app.callback()).get('/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockCategory);
            expect(category.findByPk).toHaveBeenCalledWith('1');
        });

        it('debe retornar 404 cuando no se encuentra la categoría', async () => {
            category.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).get('/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'No se encontró la categoria' });
        });

        it('debe manejar errores de base de datos al obtener categoría por id', async () => {
            const error = new Error('Database error');
            category.findByPk.mockRejectedValue(error);

            const res = await request(app.callback()).get('/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /', () => {
        const validCategoryData = {
            cate_name: 'Nueva Categoría',
            cat_descr: 'Descripción de la nueva categoría'
        };

        const mockCategory = {
            id: 1,
            ...validCategoryData
        };

        it('debe crear una categoría exitosamente', async () => {
            category.findOne.mockResolvedValue(null);
            category.create.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .post('/')
                .send(validCategoryData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockCategory);
            expect(category.findOne).toHaveBeenCalledWith({
                where: { cate_name: 'Nueva Categoría' }
            });
            expect(category.create).toHaveBeenCalledWith(validCategoryData);
        });

        it('debe retornar 409 cuando ya existe una categoría con el mismo nombre', async () => {
            const existingCategory = { id: 2, cate_name: 'Nueva Categoría' };
            category.findOne.mockResolvedValue(existingCategory);

            const res = await request(app.callback())
                .post('/')
                .send(validCategoryData);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ error: 'Ya existe una categoría con este nombre' });
            expect(category.create).not.toHaveBeenCalled();
        });

        it('debe manejar errores de base de datos durante la creación', async () => {
            category.findOne.mockResolvedValue(null);
            const error = new Error('Database error');
            category.create.mockRejectedValue(error);

            const res = await request(app.callback())
                .post('/')
                .send(validCategoryData);

            expect(res.status).toBe(500);
        });

        it('debe manejar nombres con espacios al verificar duplicados', async () => {
            const categoryDataWithSpaces = {
                cate_name: '  Nueva Categoría  ',
                cat_descr: 'Descripción'
            };

            category.findOne.mockResolvedValue(null);
            category.create.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .post('/')
                .send(categoryDataWithSpaces);

            expect(category.findOne).toHaveBeenCalledWith({
                where: { cate_name: 'Nueva Categoría' }
            });
        });
    });

    describe('PATCH /:id', () => {
        const mockCategory = {
            id: 1,
            cate_name: 'Categoría Original',
            cat_descr: 'Descripción Original',
            update: jest.fn()
        };

        const updateData = {
            cate_name: 'Categoría Actualizada',
            cat_descr: 'Descripción Actualizada'
        };

        beforeEach(() => {
            mockCategory.update.mockClear();
        });

        it('debe actualizar una categoría exitosamente', async () => {
            const mockCategory = {
                id: 1,
                cate_name: 'Categoría Original',
                cat_descr: 'Descripción Original',
                update: jest.fn(function (data) {
                    this.cate_name = data.cate_name;
                    this.cat_descr = data.cat_descr;
                    return Promise.resolve(this);
                })
            };

            const updateData = {
                cate_name: 'Categoría Actualizada',
                cat_descr: 'Descripción Actualizada'
            };

            category.findByPk.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .patch('/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: 1,
                cate_name: 'Categoría Actualizada',
                cat_descr: 'Descripción Actualizada'
            });
            expect(category.findByPk).toHaveBeenCalledWith('1');
            expect(mockCategory.update).toHaveBeenCalledWith(updateData);
        });


        it('debe poder actualizar solo el nombre', async () => {
            const partialUpdate = { cate_name: 'Solo Nombre' };
            category.findByPk.mockResolvedValue(mockCategory);
            mockCategory.update.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .patch('/1')
                .send(partialUpdate);

            expect(res.status).toBe(200);
            expect(mockCategory.update).toHaveBeenCalledWith(partialUpdate);
        });

        it('debe poder actualizar solo la descripción', async () => {
            const partialUpdate = { cat_descr: 'Solo Descripción' };
            category.findByPk.mockResolvedValue(mockCategory);
            mockCategory.update.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .patch('/1')
                .send(partialUpdate);

            expect(res.status).toBe(200);
            expect(mockCategory.update).toHaveBeenCalledWith(partialUpdate);
        });

        it('debe retornar 404 cuando la categoría no existe', async () => {
            category.findByPk.mockResolvedValue(null);

            const res = await request(app.callback())
                .patch('/999')
                .send(updateData);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Categoría no encontrada' });
        });

        it('debe retornar 400 cuando no se envía ningún campo para actualizar', async () => {
            category.findByPk.mockResolvedValue(mockCategory);

            const res = await request(app.callback())
                .patch('/1')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: 'Debe proporcionar al menos un campo para actualizar (name o description)'
            });
            expect(mockCategory.update).not.toHaveBeenCalled();
        });

        it('debe manejar errores de base de datos durante la actualización', async () => {
            const error = new Error('Database error');
            category.findByPk.mockRejectedValue(error);

            const res = await request(app.callback())
                .patch('/1')
                .send(updateData);

            expect(res.status).toBe(500);
        });
    });

    describe('DELETE /:id', () => {
        const mockCategory = {
            id: 1,
            cate_name: 'Categoría a Eliminar',
            cat_descr: 'Descripción'
        };

        it('debe eliminar una categoría exitosamente', async () => {
            category.findByPk.mockResolvedValue(mockCategory);
            category.destroy.mockResolvedValue(1);

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: 'Categoría eliminada exitosamente',
                data: {
                    id: '1',
                    name: mockCategory.cate_name
                }
            });
            expect(category.findByPk).toHaveBeenCalledWith('1');
            expect(category.destroy).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('debe retornar 404 cuando la categoría no existe', async () => {
            category.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).delete('/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Categoría no encontrada' });
            expect(category.destroy).not.toHaveBeenCalled();
        });

        it('debe manejar errores de base de datos durante la eliminación', async () => {
            const error = new Error('Database error');
            category.findByPk.mockRejectedValue(error);

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(500);
        });

        it('debe manejar cuando destroy no elimina ningún registro', async () => {
            category.findByPk.mockResolvedValue(mockCategory);
            category.destroy.mockResolvedValue(0);

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Casos edge', () => {
        it('debe manejar IDs inválidos', async () => {
            category.findByPk.mockRejectedValue(new Error('Invalid ID format'));

            const res = await request(app.callback()).get('/invalid-id');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Invalid ID format' });
        });

        it('debe manejar nombres de categoría con caracteres especiales', async () => {
            const specialCharData = {
                cate_name: 'Categoría & Símbolos #1',
                cat_descr: 'Descripción con "comillas" y símbolos'
            };

            category.findOne.mockResolvedValue(null);
            category.create.mockResolvedValue({ id: 1, ...specialCharData });

            const res = await request(app.callback())
                .post('/')
                .send(specialCharData);

            expect(res.status).toBe(201);
            expect(category.findOne).toHaveBeenCalledWith({
                where: { cate_name: 'Categoría & Símbolos #1' }
            });
        });
    });
});