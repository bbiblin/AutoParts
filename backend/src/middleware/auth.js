const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Headers:', ctx.headers);
    console.log('Authorization header:', ctx.headers.authorization);
    
    const token = ctx.headers.authorization?.split(' ')[1];
    console.log('Token extraído:', token);
    
    if (!token) {
        console.log('❌ No hay token');
        ctx.status = 401;
        ctx.body = { error: 'Token no proporcionado' };
        return;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decodificado:', decoded);
        
        ctx.state.user = decoded; // Guardamos el usuario decodificado
        console.log('✅ ctx.state.user establecido:', ctx.state.user);
        
        await next();
    } catch (err) {
        console.log('❌ Error al verificar token:', err.message);
        ctx.status = 401;
        ctx.body = { error: 'Token inválido o expirado' };
    }
};
