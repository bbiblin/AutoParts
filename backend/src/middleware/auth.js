/**
 * Este middleware verifica si el request incluye un token JWT válido en el encabezado Authorization.
 * Si el token es válido, decodifica la información del usuario y la almacena en `ctx.state.user`.
 * Si el token no está presente o no es válido, responde con un error 401 (no autorizado).
 */

const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {

    const token = ctx.headers.authorization?.split(' ')[1];

    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Token no proporcionado' };
        return;
    }

    try {
        const SECRET = process.env.JWT_SECRET || 'clave'
        const decoded = jwt.verify(token, SECRET);

        ctx.state.user = decoded; // Guardamos el usuario decodificado

        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Token inválido o expirado' };
    }
};
