const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    const token = ctx.headers.authorization?.split(' ')[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Token no proporcionado' };
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = decoded; // Guardamos el usuario decodificado
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Token inválido o expirado' };
    }
};
