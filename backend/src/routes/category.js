const Router = require("koa-router");
const router = new Router();
const { category } = require("../models");
const {
  where,
  findByPk,
  findAll,
  create,
  update,
  destroy,
} = require("sequelize");

// GET para todas las categorias

router.get("/", async (ctx) => {
  try {
    const allCategories = await category.findAll();

    if (allCategories) {
      ctx.status = 200;
      ctx.body = allCategories;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Entry not found" };
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

router.get('/:id', async (ctx) => {
    try {
        const category = await category.findByPk(ctx.params.id);
        if (product) {
            ctx.status = 200;
            ctx.body = category;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No se encontró la categoria' }
        }
    }
    catch (error) {
        console.error('Error en /categories:id', error);
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});


//PATCH categoria
router.patch("/:id", async (ctx) => {
  try {
    console.log(ctx.request.body);

    // Buscar la categoría existente
    const existingCategory = await category.findByPk(ctx.params.id);
    if (!existingCategory) {
      ctx.status = 404;
      ctx.body = {
        error: "Categoría no encontrada",
      };
      return;
    }

    const { cate_name, cat_descr } = ctx.request.body;

    // Validar que al menos un campo se envíe para actualizar
    if (!cate_name && !cat_descr) {
      ctx.status = 400;
      ctx.body = {
        error:
          "Debe proporcionar al menos un campo para actualizar (name o description)",
      };
      return;
    }
    // Actualizar la categoría
    await existingCategory.update(ctx.request.body);

    ctx.status = 200;
    ctx.body = existingCategory;
  } catch (error) {
    console.error("Error al actualizar categoría:", error);

  }
});

//POST Para categoria
router.post("/", async (ctx) => {
  try {
    console.log(ctx.request.body);

    // Validaciones
    const { cate_name, cat_descr } = ctx.request.body;

    const existingCategory = await category.findOne({
      where: { cate_name: cate_name.trim() },
    });

    if (existingCategory) {
      ctx.status = 409;
      ctx.body = {
        error: "Ya existe una categoría con este nombre",
      };
      return;
    }

    // Crear la nueva categoría
    const nuevaCategory = await category.create(ctx.request.body);

    ctx.status = 201;
    ctx.body =  nuevaCategory;
  } catch (error) {
    console.error("Error al crear categoría:", error);
  }
});

//DELETE categoria

router.delete('/:id', async (ctx) => {
    try {
        
        // Verificar si la categoría existe
        const existingCategory = await category.findByPk(ctx.params.id);
        
        if (!existingCategory) {
            ctx.status = 404;
            ctx.body = {
                error: 'Categoría no encontrada'
            };
            return;
        }
    
        
        // Eliminar la categoría
        await category.destroy({
            where: { id: ctx.params.id }
        });
        
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: {
                id: ctx.params.id,
                name: existingCategory.name
            }
        };
        
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        
    }
});
module.exports = router;
