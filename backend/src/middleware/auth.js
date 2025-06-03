const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    
    const token = ctx.headers.authorization?.split(' ')[1];
    
    if (!token) {
        console.log('❌ No hay token');
        ctx.status = 401;
        ctx.body = { error: 'Token no proporcionado' };
        return;
    }
    
    try {
        const SECRET = process.env.JWT_SECRET || 'clave'
        const decoded = jwt.verify(token, SECRET);
        
        ctx.state.user = decoded; // Guardamos el usuario decodificado
        console.log('✅ ctx.state.user establecido:', ctx.state.user);
        
        await next();
    } catch (err) {
        console.log('❌ Error al verificar token:', err.message);
        ctx.status = 401;
        ctx.body = { error: 'Token inválido o expirado' };
    }
};
