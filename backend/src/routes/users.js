const Router = require('koa-router');
const router = new Router();
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode'); 
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const authMiddleware = require('../middleware/auth');

// Registro de usuario
router.post('/register', async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { email, password, username, name, address, phone, isDistribuitor } = ctx.request.body;

    // Validaciones básicas
    if (!email || !password || !username || !name || !address || !phone) {
      ctx.status = 400;
      ctx.body = { error: 'Faltan campos obligatorios' };
      return;
    }

    // Verifica si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      ctx.status = 409;
      ctx.body = { error: 'El email ya está registrado' };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      admin: false,
      address,
      phone,
      isDistribuitor: isDistribuitor || false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // No retornar la contraseña en la respuesta
    const { password: _, ...userResponse } = newUser.toJSON();

    ctx.status = 201;
    ctx.body = userResponse;
  } catch (error) {
    console.error('Error en registro:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error al registrar usuario' };
  }
});

// GET de Users - CORREGIDO
router.get('/', async (ctx) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ['password'] } // No retornar contraseñas
    });

    ctx.status = 200;
    ctx.body = {
      count: allUsers.length,
      users: allUsers
    };

  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    ctx.status = 500;
    ctx.body = { error: 'Error al obtener usuarios' };
  }
});

// Login de users 
router.post('/login', async (ctx) => {
  console.log("Intento de login");
  try {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Email y contraseña son requeridos' };
      return;
    }

    const user = await User.findOne({
      where: { email: email }
    });

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Credenciales inválidas' };
      return;
    }

    // CORREGIDO: await bcrypt.compare
    const validPass = await bcrypt.compare(password, user.password);

    console.log("Usuario encontrado:", user.email);
    console.log("Contraseña válida:", validPass);

    if (validPass) {
      console.log("Login exitoso");
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          isDistribuitor: user.isDistribuitor,
        },
        process.env.JWT_SECRET || 'clave', // Usar variable de entorno
        { expiresIn: '2h' }
      );

      
      // No retornar la contraseña
      const { password: _, ...userResponse } = user.toJSON();

      ctx.status = 200;
      ctx.body = { user: userResponse, token };
    } else {
      console.log("Contraseña inválida");
      ctx.status = 401;
      ctx.body = { error: 'Credenciales inválidas' };
    }

  } catch (error) {
    console.error("Error en login:", error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor' };
  }
});

module.exports = router;