const Router = require('koa-router');
const router = new Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, address } = require('../models');
const authMiddleware = require('../middleware/auth');


// Registro de usuario
router.post('/register', async (ctx) => {
  try {
    const { email, password, username, name, admin, addressDetail, phone, isDistribuitor } = ctx.request.body;
    console.log(ctx.request.body);
    // Validaciones básicas
    if (!email || !password || !username || !name || !addressDetail || !phone) {
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

    //const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password,
      username,
      name,
      admin: !!admin,
      addressDetail,
      phone,
      isDistribuitor,
    });

    ctx.status = 201;
    ctx.body = newUser;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'Error al registrar usuario' };
  }
});

router.get('/', async (ctx) => {
    try {
        const allUsers = await User.findAll();
        if (allUsers) {
            ctx.status = 200;
            ctx.body = allUsers;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No se encontraron usuarios.' }
        }
    } catch (error) {
        console.error("Ha ocurrido un error en kakis", error);
    }
});

module.exports = router;