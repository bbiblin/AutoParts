const Router = require('koa-router');
const router = new Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');


// Registro de usuario
router.post('/register', async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { email, password, username, name, address, phone, isDistribuitor } = ctx.request.body;
    console.log(ctx.request.body);
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
      isDistribuitor,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    ctx.status = 201;
    ctx.body = newUser;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: 'Error al registrar usuario' };
  }
});

//GET de Users

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
    console.error("Ha ocurrido un error en el servidor", error);
  }
});

//Login de users
router.post('/login', async (ctx) => {
  console.log("Login");
  try {
    const { email, password } = ctx.request.body;
    const user = await User.findOne({
      where: {
        email: email,
      }
    });
    const validPass = bcrypt.compare(password, user.password)
    console.log("Body:", ctx.request.body);
    console.log("User: ", user);

    if (user) {
      if (validPass) {
        console.log("Iniciaste sesión correctamente");
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            password: user.hashedPassword,
            isDistribuitor: user.isDistribuitor,
          },
          'clave',
          { expiresIn: '2h' }
        );
        ctx.body = { user, token };
      } else {
        console.log("Contraseña inválida");
      }

    } else {
      console.log("Datos incorrectos");
    }


  } catch (error) {
    console.error("ha ocurrido un error", error);

  }
});

module.exports = router;