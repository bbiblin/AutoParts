const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/auth');

jest.mock('jsonwebtoken');

describe('Middleware de autenticación - Koa', () => {
    let ctx;
    let next;

    beforeEach(() => {
        ctx = {
            headers: {},
            state: {},
            status: null,
            body: null
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('rechaza la petición si no se proporciona token', async () => {
        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ error: 'Token no proporcionado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rechaza la petición si el token es inválido o está expirado', async () => {
        ctx.headers.authorization = 'Bearer token_invalido';
        jwt.verify.mockImplementation(() => {
            throw new Error('invalid token');
        });

        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ error: 'Token inválido o expirado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('establece ctx.state.user si el token es válido', async () => {
        const mockPayload = { id: 1, email: 'test@example.com' };
        ctx.headers.authorization = 'Bearer token_valido';
        jwt.verify.mockReturnValue(mockPayload);

        await authMiddleware(ctx, next);

        expect(ctx.state.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalled();
    });


    it('rechaza si el encabezado Authorization está vacío', async () => {
        ctx.headers.authorization = '';

        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ error: 'Token no proporcionado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rechaza si el encabezado Authorization no tiene el formato Bearer <token>', async () => {
        ctx.headers.authorization = 'InvalidFormat';

        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ error: 'Token no proporcionado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('procesa correctamente tokens con payload sospechoso', async () => {
        const suspiciousPayload = { id: '<script>alert("xss")</script>' };
        ctx.headers.authorization = 'Bearer token_malicioso';
        jwt.verify.mockReturnValue(suspiciousPayload);

        await authMiddleware(ctx, next);

        expect(ctx.state.user).toEqual(suspiciousPayload);
        expect(next).toHaveBeenCalled();
    });

    it('acepta tokens válidos con campos adicionales no esperados', async () => {
        const extendedPayload = {
            id: 1,
            email: 'admin@test.com',
            role: 'admin',
            isRoot: true
        };
        ctx.headers.authorization = 'Bearer extendedToken';
        jwt.verify.mockReturnValue(extendedPayload);

        await authMiddleware(ctx, next);

        expect(ctx.state.user).toEqual(extendedPayload);
        expect(next).toHaveBeenCalled();
    });

    it('captura errores inesperados de jwt.verify', async () => {
        ctx.headers.authorization = 'Bearer algo';
        jwt.verify.mockImplementation(() => {
            throw new Error('Fallo inesperado');
        });

        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ error: 'Token inválido o expirado' });
    });
});
