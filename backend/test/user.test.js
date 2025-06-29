const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../src/models', () => ({
    User: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

jest.mock('../src/middleware/auth', () => {
    return jest.fn((ctx, next) => {
        // Mock del middleware de autenticación
        ctx.state = { user: { id: 1, email: 'test@test.com' } };
        return next();
    });
});

const { User } = require('../src/models');
const userRouter = require('../src/routes/users');

const app = new Koa();
const router = new Router();

router.use(userRouter.routes());
app.use(bodyParser());
app.use(router.routes());

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock console.error para evitar logs en tests
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
        console.log.mockRestore();
    });

    describe('GET /distribuitor', () => {
        it('debe retornar los distribuidores de manera exitosa', async () => {
            const mockUsers = [
                { id: 1, isDistribuitor: true, name: 'Distribuitor 1' },
                { id: 2, isDistribuitor: true, name: 'Distribuitor 2' }
            ];

            User.findAll.mockResolvedValue(mockUsers);

            const res = await request(app.callback()).get('/distribuitor');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUsers);
            expect(User.findAll).toHaveBeenCalledWith({ where: { isDistribuitor: true } });
        });

        it('debe manejar errores en la base de datos', async () => {
            const error = new Error('Database error');
            User.findAll.mockRejectedValue(error);

            const res = await request(app.callback()).get('/distribuitor');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /register', () => {
        const validUserData = {
            email: 'test@test.com',
            password: 'password123',
            username: 'testuser',
            name: 'Test User',
            address: '123 Test St',
            phone: '1234567890'
        };

        it('debe registrar un usuario correctamente', async () => {
            const hashedPassword = 'hashedPassword123';
            const mockUser = {
                id: 1,
                ...validUserData,
                password: hashedPassword,
                admin: false,
                isDistribuitor: false,
                toJSON: () => ({ id: 1, ...validUserData, admin: false, isDistribuitor: false })
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.create.mockResolvedValue(mockUser);

            const res = await request(app.callback())
                .post('/register')
                .send(validUserData);

            expect(res.status).toBe(201);
            expect(res.body).not.toHaveProperty('password');
            expect(User.create).toHaveBeenCalledWith({
                email: validUserData.email,
                password: hashedPassword,
                username: validUserData.username,
                name: validUserData.name,
                admin: false,
                address: validUserData.address,
                phone: validUserData.phone,
                isDistribuitor: false,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('deberia registrarse un usuario como administrador cuando es marcada la opcion', async () => {
            const userData = { ...validUserData, isDistribuitor: true };
            const hashedPassword = 'hashedPassword123';
            const mockUser = {
                id: 1,
                ...userData,
                password: hashedPassword,
                admin: false,
                toJSON: () => ({ id: 1, ...userData, admin: false })
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.create.mockResolvedValue(mockUser);

            const res = await request(app.callback())
                .post('/register')
                .send(userData);

            expect(res.status).toBe(201);
            expect(User.create).toHaveBeenCalledWith(
                expect.objectContaining({ isDistribuitor: true })
            );
        });

        it('sdeberia devolver 404 cuando hayan campos obligatorios vacios', async () => {
            const incompleteData = { email: 'test@test.com' };

            const res = await request(app.callback())
                .post('/register')
                .send(incompleteData);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Faltan campos obligatorios' });
        });

        it('debe retornar 404 cuando se registra un email que ya existe', async () => {
            User.findOne.mockResolvedValue({ id: 1, email: validUserData.email });

            const res = await request(app.callback())
                .post('/register')
                .send(validUserData);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ error: 'El email ya está registrado' });
        });

        it('debe manejar errores en la base de datos durante el registro', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback())
                .post('/register')
                .send(validUserData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error al registrar usuario' });
        });
    });

    describe('GET /', () => {
        it('debe retornar todos los usuarios excluyendo su contraseña', async () => {
            const mockUsers = [
                { id: 1, email: 'user1@test.com', username: 'user1' },
                { id: 2, email: 'user2@test.com', username: 'user2' }
            ];

            User.findAll.mockResolvedValue(mockUsers);

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                count: 2,
                users: mockUsers
            });
            expect(User.findAll).toHaveBeenCalledWith({
                attributes: { exclude: ['password'] }
            });
        });

        it('debe manejar errores en la base de datos cuando se recuperan usuarios', async () => {
            User.findAll.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).get('/');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error al obtener usuarios' });
        });
    });

    describe('POST /login', () => {
        const loginData = {
            email: 'test@test.com',
            password: 'password123'
        };

        const mockUser = {
            id: 1,
            email: 'test@test.com',
            username: 'testuser',
            password: 'hashedPassword',
            isDistribuitor: false,
            toJSON: () => ({
                id: 1,
                email: 'test@test.com',
                username: 'testuser',
                isDistribuitor: false
            })
        };

        it('debe tener un login exitoso son las credenciales coreectas', async () => {
            const mockToken = 'mock-jwt-token';

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);

            const res = await request(app.callback())
                .post('/login')
                .send(loginData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                user: mockUser.toJSON(),
                token: mockToken
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    id: mockUser.id,
                    email: mockUser.email,
                    username: mockUser.username,
                    isDistribuitor: mockUser.isDistribuitor
                },
                expect.any(String),
                { expiresIn: '2h' }
            );
        });

        it('debe retornar 404 cuando no se ingresa correo y contraseña', async () => {
            const res = await request(app.callback())
                .post('/login')
                .send({ email: 'test@test.com' });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email y contraseña son requeridos' });
        });

        it('debe retornar 401 cuando no existe el usuario', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app.callback())
                .post('/login')
                .send(loginData);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciales inválidas' });
        });

        it('debe retornar 401 cuando la contraseña es incorrecta', async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app.callback())
                .post('/login')
                .send(loginData);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciales inválidas' });
        });

        it('debe manejar errores en la base de datos durante el login', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback())
                .post('/login')
                .send(loginData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error interno del servidor' });
        });
    });

    describe('PATCH /profile', () => {
        const updateData = {
            name: 'Updated Name',
            email: 'updated@test.com'
        };

        const mockUser = {
            id: 1,
            email: 'test@test.com',
            name: 'Test User'
        };

        it('debe modificarse el perfil exitosamente', async () => {
            const updatedUser = { ...mockUser, ...updateData };

            User.findByPk.mockResolvedValueOnce(mockUser);
            User.findOne.mockResolvedValue(null);
            User.update.mockResolvedValue([1]);
            User.findByPk.mockResolvedValueOnce(updatedUser);

            const res = await request(app.callback())
                .patch('/profile')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'Perfil actualizado correctamente',
                user: updatedUser
            });
        });

        it('no debe permitir actualizar campos restringidos', async () => {
            const restrictedData = {
                id: 999,
                admin: true,
                isDistribuitor: true,
                createdAt: new Date(),
                name: 'Updated Name'
            };

            User.findByPk.mockResolvedValueOnce(mockUser);
            User.update.mockResolvedValue([1]);
            User.findByPk.mockResolvedValueOnce({ ...mockUser, name: 'Updated Name' });

            const res = await request(app.callback())
                .patch('/profile')
                .send(restrictedData);

            expect(res.status).toBe(200);
            expect(User.update).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    id: 999,
                    admin: true,
                    isDistribuitor: true,
                    createdAt: expect.any(Date)
                }),
                { where: { id: 1 } }
            );
        });

        it('se debe retornar 404 cuando no se encuentra un usuario', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app.callback())
                .patch('/profile')
                .send(updateData);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Usuario no encontrado' });
        });

        it('debe retornar 409 cuando el email ya está registrado', async () => {
            User.findByPk.mockResolvedValue(mockUser);
            User.findOne.mockResolvedValue({ id: 2, email: updateData.email });

            const res = await request(app.callback())
                .patch('/profile')
                .send(updateData);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ error: 'El email ya está registrado' });
        });

        it('se debe hashear la contraseña al cambiarla', async () => {
            const passwordData = { password: 'newPassword123' };
            const hashedPassword = 'hashedNewPassword';

            User.findByPk.mockResolvedValueOnce(mockUser);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.update.mockResolvedValue([1]);
            User.findByPk.mockResolvedValueOnce(mockUser);

            const res = await request(app.callback())
                .patch('/profile')
                .send(passwordData);

            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
            expect(User.update).toHaveBeenCalledWith(
                expect.objectContaining({ password: hashedPassword }),
                { where: { id: 1 } }
            );
        });

        it('se deben manejar errores durante la actualizacion del perfil', async () => {
            User.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback())
                .patch('/profile')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error interno del servidor' });
        });
    });

    describe('GET /profile', () => {
        const mockUser = {
            id: 1,
            email: 'test@test.com',
            username: 'testuser',
            name: 'Test User'
        };

        it('debe retornar el perfil del usuario exitosamente', async () => {
            User.findByPk.mockResolvedValue(mockUser);

            const res = await request(app.callback()).get('/profile');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUser);
            expect(User.findByPk).toHaveBeenCalledWith(1, {
                attributes: { exclude: ['password'] }
            });
        });

        it('se debe retornar 404 si no se encuentra el usuario', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app.callback()).get('/profile');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Usuario no encontrado' });
        });

        it('se deben manejar errores en la base de datos durante la obtención del perfil', async () => {
            User.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app.callback()).get('/profile');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Error interno del servidor' });
        });
    });

    describe('DELETE /:id', () => {
        it('se debe borrar el usuario correctamente', async () => {
            User.destroy.mockResolvedValue(1); // 1 row affected

            const res = await request(app.callback()).delete('/123');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: ' Usuario eliminado correctamente' });
            expect(User.destroy).toHaveBeenCalledWith({ where: { id: '123' } });
        });

        it('sse debe devolver 404 cuando no se encuentra el usuario para borrar', async () => {
            User.destroy.mockResolvedValue(0); // No rows affected

            const res = await request(app.callback()).delete('/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Usuario no encontrado' });
        });

        it('debe manejar errores en la base de datos durante la eliminacion de usuarios', async () => {
            const error = new Error('Database error');
            User.destroy.mockRejectedValue(error);

            const res = await request(app.callback()).delete('/123');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Database error' });
        });
    });
});