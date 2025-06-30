const Router = require('koa-router');
const router = new Router();
const { brand } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');

// GET para todas las marcas

router.get('/', async (ctx) => {
  try {
    const allBrands = await brand.findAll();

    if (allBrands) {
      ctx.status = 200;
      ctx.body = allBrands;
    }
    else {
      ctx.status = 404;
      ctx.body = { error: 'Entry not found' };
    }
  }
  catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

//GET de marca por id
router.get('/:id', async (ctx) => {
  try {
    const marca = await brand.findByPk(ctx.params.id);
    if (marca) {
      ctx.status = 200;
      ctx.body = marca;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'No se encontró la marca' }
    }
  }
  catch (error) {
    console.error('Error en /brands:id', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


//PATCH (update) de marca
router.patch("/:id", async (ctx) => {
  try {
    console.log(ctx.request.body);

    const existingBrand = await brand.findByPk(ctx.params.id);
    if (!existingBrand) {
      ctx.status = 404;
      ctx.body = {
        error: "Marca no encontrada",
      };
      return;
    }

    await existingBrand.update(ctx.request.body);

    ctx.status = 200;
    ctx.body = existingBrand;

  } catch (error) {
    console.error('Error...', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


//POST marca
router.post("/", async (ctx) => {
  try {
    console.log(ctx.request.body);

    const existingBrand = await brand.findOne({
      where: { brand_name: ctx.request.body.brand_name },
    });

    if (existingBrand) {
      ctx.status = 409;
      ctx.body = {
        error: "Ya existe una marca con este nombre",
      };
      return;
    }

    const nuevaBrand = await brand.create(ctx.request.body);

    ctx.status = 201;
    ctx.body = nuevaBrand;
  } catch (error) {
    console.error('Error...', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


//DELETE marca
router.delete('/:id', async (ctx) => {
  try {

    const existingBrand = await brand.findByPk(ctx.params.id);

    if (!existingBrand) {
      ctx.status = 404;
      ctx.body = {
        error: 'Marca no encontrada'
      };
      return;
    }


    await brand.destroy({
      where: { id: ctx.params.id }
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Marca eliminada exitosamente',
      data: {
        id: ctx.params.id,
        name: existingBrand.brand_name
      }
    };

  } catch (error) {
    console.error('Error...', error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});
module.exports = router;
