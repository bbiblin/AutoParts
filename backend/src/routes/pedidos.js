const Router = require('@koa/router');
const router = new Router();
const { pedidos, cart_item, detalle_pedido, producto, User } = require('../models');
const authenticateToken = require('../middleware/auth');


//GET de todos los pedidos
router.get('/', async (ctx) => {
  try {
    const allPedidos = await pedidos.findAll({
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: detalle_pedido,
          as: 'detalles_pedido',
          include: [
            {
              model: producto,
              as: 'product',
            }
          ]
        }
      ]
    });

    if (allPedidos) {
      ctx.status = 200;
      ctx.body = allPedidos;
    } else {
      ctx.status = 404;
      ctx.body = { message: "No se encontraron pedidos" };
    }
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    };
  }
});

//GET de pedidos del usuario autenticado
router.get('/usuario', authenticateToken, async (ctx) => {
  try {
    const user = ctx.state.user;

    const userPedidos = await pedidos.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: detalle_pedido,
          as: 'detalles_pedido',
          include: [
            {
              model: producto,
              as: 'product',
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });


    ctx.status = 200;
    ctx.body = userPedidos;

  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    };
  }
});


//DELETE de un pedido en especifico
router.delete('/:id', async (ctx) => {
  try {
    const deleted_pedido = await pedidos.destroy({ where: { id: ctx.params.id } });
    if (deleted_pedido) {
      ctx.status = 200;
      const msg = " Pedido eliminado correctamente";
      ctx.body = { message: msg };
    }
    else {
      ctx.status = 404;
      ctx.body = { error: 'Pedido no encontrado' };
    }
  }
  catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


module.exports = router;
