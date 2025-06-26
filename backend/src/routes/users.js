const Router = require('koa-router');
const router = new Router();
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const authMiddleware = require('../middleware/auth');

//GET para los usuarios distribuidores... 
router.get('/distribuitor', async (ctx) => {
  try {
    const distribuitorUsers = await User.findAll({ where: { isDistribuitor: true } });
    ctx.body = distribuitorUsers;
  }
  catch (error) {
    console.error('Error al obtener productos', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


// Registro de usuario
router.post('/register', async (ctx) => {
  try {
    const { email, password, username, name, address, phone, isDistribuitor } = ctx.request.body;
    let { admin } = ctx.request.body;
    if (!admin){
      admin = false;
    }

    // Validaciones básicas
    if (!email || !password || !username || !name || !address || !phone) {
      ctx.status = 400;
      ctx.body = { error: 'Faltan campos obligatorios' };
      return;
    }

    // Verifica si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ where: { email: email } });
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
      admin,
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

    const validPass = await bcrypt.compare(password, user.password); // se compara la contraseña encriptada con la contraseña desencriptada para permitir que el usuario inicie sesión con su contraseña.

    if (validPass) {
      console.log("Login exitoso");
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          isDistribuitor: user.isDistribuitor,
        },
        process.env.JWT_SECRET || 'clave', 
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

router.patch('/profile', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.state.user.id; // ID del usuario autenticado desde el token
    const updateData = ctx.request.body;

    // Campos que el usuario NO puede modificar desde su perfil
    const restrictedFields = ['id', 'admin', 'isDistribuitor', 'createdAt'];
    
    // Remover campos restringidos
    restrictedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });

    // Verificar si el usuario existe (aunque debería existir por el middleware)
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      ctx.status = 404;
      ctx.body = { error: 'Usuario no encontrado' };
      return;
    }

    // Si se quiere actualizar el email, verificar que no esté en uso
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailInUse = await User.findOne({ 
        where: { 
          email: updateData.email,
          id: { [require('sequelize').Op.ne]: userId }
        } 
      });
      if (emailInUse) {
        ctx.status = 409;
        ctx.body = { error: 'El email ya está registrado' };
        return;
      }
    }

    // Si se quiere actualizar la contraseña, encriptarla
    if (updateData.password) {
      // Opcional: Podrías requerir la contraseña actual para mayor seguridad
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Actualizar updatedAt
    updateData.updatedAt = new Date();

    // Realizar la actualización
    await User.update(updateData, {
      where: { id: userId }
    });

    // Obtener el usuario actualizado (sin la contraseña)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    };

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor' };
  }
});

router.get('/profile', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'Usuario no encontrado' };
      return;
    }

    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor' };
  }
});


router.delete('/:id', async (ctx) => {
    try {
        const deleted_user = await User.destroy({ where: { id: ctx.params.id } });
        if (deleted_user) {
            ctx.status = 200;
            const msg = " Usuario eliminado correctamente";
            ctx.body = { message: msg };
            console.log(msg);
        }
        else {
            ctx.status = 404;
            ctx.body = { error: 'Usuario no encontrado' };
        }
    }
    catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});


module.exports = router;
