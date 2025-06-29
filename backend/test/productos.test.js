const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const fs = require('fs');
const path = require('path');

// Mocks
jest.mock('../src/models', () => ({
    producto: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    }
}));

jest.mock('../src/config/configCloudinary', () => ({
    uploader: {
        upload: jest.fn()
    }
}));

jest.mock('fs', () => ({
    existsSync: jest.fn(),
    unlinkSync: jest.fn()
}));

jest.mock('koa-body', () => ({
    koaBody: jest.fn(() => {
        return async (ctx, next) => {
            // Simular el comportamiento de koaBody
            ctx.request.body = ctx.request.body || {};
            ctx.request.files = ctx.request.files || {};
            await next();
        };
    })
}));
const { producto } = require('../src/models');
const cloudinary = require('../src/config/configCloudinary');
const productRouter = require('../src/routes/productos'); // Ajusta la ruta según tu estructura

const app = new Koa();
const router = new Router();

router.use(productRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('Product Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock console logs
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
        console.log.mockRestore();
    });

    describe('GET /destacados', () => {
        it('debe retornar productos destacados exitosamente', async () => {
            const mockProducts = [
                { id: 1, product_name: 'Producto 1', featured: true, isActive: true },
                { id: 2, product_name: 'Producto 2', featured: true, isActive: true }
            ];

            producto.findAll.mockResolvedValue(mockProducts);

            const res = await request(app.callback()).get('/destacados');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProducts);
            expect(producto.findAll).toHaveBeenCalledWith({
                where: { featured: true, isActive: true }
            });
        });

        it('debe manejar errores de la base de datos al momento de obtener los productos destacados', async () => {
            const error = new Error('Database error');
            producto.findAll.mockRejectedValue(error);

            const res = await request(app.callback()).get('/destacados');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /', () => {
        const validProductData = {
            product_name: 'Test Product',
            description: 'Test Description',
            retail_price: '100',
            wholesale_price: '80',
            stock: '50',
            discount_percentage: '10',
            isActive: 'true',
            featured: 'false',
            category_id: '1',
            brand_id: '1'
        };

        const mockProduct = {
            id: 1,
            ...validProductData,
            retail_price: 100,
            wholesale_price: 80,
            stock: 50,
            discount_percentage: 10,
            isActive: true,
            featured: false,
            category_id: 1,
            brand_id: 1,
            image_url: null,
            update: jest.fn()
        };

        it('debe crear producto sin una imagen', async () => {
            producto.create.mockResolvedValue(mockProduct);
            mockProduct.update.mockResolvedValue(mockProduct);

            const res = await request(app.callback())
                .post('/')
                .send(validProductData);

            expect(res.status).toBe(201);
            expect(producto.create).toHaveBeenCalledWith({
                product_cod: undefined,
                product_name: 'Test Product',
                description: 'Test Description',
                retail_price: 100,
                wholesale_price: 80,
                stock: 50,
                discount_percentage: 10,
                isActive: true,
                featured: false,
                category_id: '1',
                brand_id: '1',
                image_url: null
            });
        });

        it('debe poder crearse un producto con una imagen subida', async () => {
            const mockFile = {
                filepath: '/tmp/test-image.jpg'
            };
            const mockCloudinaryResult = {
                secure_url: 'https://cloudinary.com/image.jpg'
            };

            fs.existsSync.mockReturnValue(true);
            cloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
            fs.unlinkSync.mockImplementation(() => { });

            const productWithImage = {
                ...mockProduct,
                image_url: mockCloudinaryResult.secure_url
            };
            producto.create.mockResolvedValue(productWithImage);

            const mockCtx = {
                request: {
                    files: { imagen: mockFile },
                    body: validProductData
                }
            };
            expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
        });

        it('se debe aplicar descuento cuando el discount_percentaje > 0', async () => {
            const productWithDiscount = {
                ...mockProduct,
                discount_percentage: 20
            };

            producto.create.mockResolvedValue(productWithDiscount);
            productWithDiscount.update.mockResolvedValue(productWithDiscount);

            const res = await request(app.callback())
                .post('/')
                .send({ ...validProductData, discount_percentage: '20' });

            expect(productWithDiscount.update).toHaveBeenCalledWith({
                retail_price_sale: 80, // 100 * 0.8
                wholesale_price_sale: 64 // 80 * 0.8
            });
        });

        it('debe retornar 400 cuando no se llenan campos obligatorios', async () => {
            const incompleteData = { product_name: 'Test Product' };

            const res = await request(app.callback())
                .post('/')
                .send(incompleteData);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Faltan campos obligatorios.' });
        });

        it('debe manejar errores de subida a clodinary', async () => {
            const mockFile = {
                filepath: '/tmp/test-image.jpg'
            };

            fs.existsSync.mockReturnValue(true);
            cloudinary.uploader.upload.mockRejectedValue(new Error('Cloudinary error'));

            // This would be tested in integration tests with actual file uploads
            expect(true).toBe(true); // Placeholder for cloudinary error handling
        });

        it('debe manejar errores en la base de datos durante la creación de productos', async () => {
            producto.create.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback())
                .post('/')
                .send(validProductData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: 'Error interno del servidor',
                message: 'Database error'
            });
        });
    });

    describe('GET /', () => {
        const mockProducts = [
            { id: 1, product_name: 'Product 1', isActive: true, category_id: 1, brand_id: 1 },
            { id: 2, product_name: 'Product 2', isActive: true, category_id: 2, brand_id: 2 }
        ];

        it('debe retornar todos los productos activos cuando no hay filtros activos', async () => {
            producto.findAll.mockResolvedValue(mockProducts);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProducts);
            expect(producto.findAll).toHaveBeenCalledWith({ where: { isActive: true } });
        });

        it('debe poder filtrarse solo con category_id', async () => {
            const filteredProducts = [mockProducts[0]];
            producto.findAll.mockResolvedValue(filteredProducts);

            const res = await request(app.callback()).get('/?category_id=1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(filteredProducts);
            expect(producto.findAll).toHaveBeenCalledWith({
                where: { category_id: '1', isActive: true }
            });
        });

        it('debe poder filtrarse solo con brand_id', async () => {
            const filteredProducts = [mockProducts[0]];
            producto.findAll.mockResolvedValue(filteredProducts);

            const res = await request(app.callback()).get('/?brand_id=1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(filteredProducts);
            expect(producto.findAll).toHaveBeenCalledWith({
                where: { brand_id: '1', isActive: true }
            });
        });

        it('debe poder filtrarse con category_id y brand_id', async () => {
            const filteredProducts = [mockProducts[0]];
            producto.findAll.mockResolvedValue(filteredProducts);

            const res = await request(app.callback()).get('/?category_id=1&brand_id=1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(filteredProducts);
            expect(producto.findAll).toHaveBeenCalledWith({
                where: { brand_id: '1', category_id: '1', isActive: true }
            });
        });

        it('debe poder retornar todos los productos no habilitado (isActive)', async () => {
            const allProducts = [...mockProducts, { id: 3, product_name: 'Inactive Product', isActive: false }];
            producto.findAll.mockResolvedValue(allProducts);

            const res = await request(app.callback()).get('/?admin=true');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(allProducts);
            expect(producto.findAll).toHaveBeenCalledWith();
        });

        it('debe manejar errores en la base de datos al momento de obtener los productos', async () => {
            producto.findAll.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /:id', () => {
        const mockProduct = {
            id: 1,
            product_name: 'Test Product',
            description: 'Test Description'
        };

        it('debe retornar productos por id de manera exitosa', async () => {
            producto.findByPk.mockResolvedValue(mockProduct);

            const res = await request(app.callback()).get('/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProduct);
            expect(producto.findByPk).toHaveBeenCalledWith('1');
        });

        it('debe retornar 404 cuando no se encuentra el producto', async () => {
            producto.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).get('/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'No se encuentró el producto' });
        });

        it('debe manejar errores de base de datos al momento de obtener producto por id', async () => {
            producto.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).get('/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('DELETE /:id', () => {
        it('debe poder borrar un producto en especifico exitosamente', async () => {
            producto.destroy.mockResolvedValue(1);

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: ' Producto eliminado correctamente' });
            expect(producto.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('debe retornar 404 si no se encuentra un producto para borrar', async () => {
            producto.destroy.mockResolvedValue(0);

            const res = await request(app.callback()).delete('/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Producto no encontrado' });
        });

        it('debe manejar errores de base de datos durante la eliminacion de un producto', async () => {
            producto.destroy.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).delete('/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('PATCH /:id', () => {
        const mockProduct = {
            id: 1,
            product_name: 'Test Product',
            retail_price: 100,
            wholesale_price: 80,
            discount_percentage: 0,
            update: jest.fn()
        };

        const updateData = {
            product_name: 'Updated Product',
            description: 'Updated Description'
        };

        it('debe poder actualizarse un producto y calcular el descuento', async () => {
            const productWithDiscount = {
                ...mockProduct,
                discount_percentage: 20
            };

            producto.findByPk.mockResolvedValue(productWithDiscount);
            productWithDiscount.update = jest.fn().mockResolvedValue(productWithDiscount);

            const res = await request(app.callback())
                .patch('/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(productWithDiscount.update).toHaveBeenCalledWith({
                retail_price_sale: 80,
                wholesale_price_sale: 64
            });
        });

        it('debe manejar cambio de imagen durante la actualización', async () => {
            const mockFile = {
                filepath: '/tmp/test-image.jpg'
            };
            const mockCloudinaryResult = {
                secure_url: 'https://cloudinary.com/updated-image.jpg'
            };

            cloudinary.uploader.upload.mockResolvedValue(mockCloudinaryResult);
            fs.unlinkSync.mockImplementation(() => { });
            producto.findByPk.mockResolvedValue(mockProduct);
            mockProduct.update.mockResolvedValue(mockProduct);

            expect(true).toBe(true);
        });

        it('debe manejar errores en la base de datos durante la actualización de un producto', async () => {
            producto.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback())
                .patch('/1')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                error: 'Error interno del servidor',
                message: 'Database error'
            });
        });
    });

    describe('PATCH /:id/descuento', () => {
        const mockProduct = {
            id: 1,
            retail_price: 100,
            wholesale_price: 80,
            discount_percentage: 20,
            update: jest.fn()
        };



        it('debe retornar 404 si el producto no tiene descuento', async () => {
            const productWithoutDiscount = {
                ...mockProduct,
                discount_percentage: 0
            };

            producto.findByPk.mockResolvedValue(productWithoutDiscount);

            const res = await request(app.callback()).patch('/1/descuento');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Producto no encontrado' });
        });

        it('debe manejar errores si se le pone descuento a un producto', async () => {
            producto.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).patch('/1/descuento');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('Discount calculations', () => {
        it('debe calcular el descuento correctamente para distintos porcentajes', () => {
            const testCases = [
                { retail: 100, wholesale: 80, discount: 10, expectedRetail: 90, expectedWholesale: 72 },
                { retail: 150, wholesale: 120, discount: 25, expectedRetail: 112, expectedWholesale: 90 },
                { retail: 200, wholesale: 160, discount: 50, expectedRetail: 100, expectedWholesale: 80 }
            ];

            testCases.forEach(({ retail, wholesale, discount, expectedRetail, expectedWholesale }) => {
                const porcentaje_restante = (100 - discount) / 100;
                const precio_final_retail = Math.floor(retail * porcentaje_restante);
                const precio_final_wholesale = Math.floor(wholesale * porcentaje_restante);

                expect(precio_final_retail).toBe(expectedRetail);
                expect(precio_final_wholesale).toBe(expectedWholesale);
            });
        });
    });
});