const Router = require("koa-router");
const router = new Router();
const { category } = require("../models");

// GET todas las categorías
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

// GET por ID
router.get("/:id", async (ctx) => {
  try {
    const foundCategory = await category.findByPk(ctx.params.id);
    if (foundCategory) {
      ctx.status = 200;
      ctx.body = foundCategory;
    } else {
      ctx.status = 404;
      ctx.body = { error: "No se encontró la categoria" };
    }
  } catch (error) {
    console.error("Error en /categories:id", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// POST nueva categoría
router.post("/", async (ctx) => {
  try {
    const { cate_name, cat_descr } = ctx.request.body;
    const existingCategory = await category.findOne({
      where: { cate_name: cate_name.trim() },
    });

    if (existingCategory) {
      ctx.status = 409;
      ctx.body = { error: "Ya existe una categoría con este nombre" };
      return;
    }

    const nuevaCategory = await category.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = nuevaCategory;
  } catch (error) {
    console.error("Error al crear categoría:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// PATCH actualizar categoría
router.patch("/:id", async (ctx) => {
  try {
    const existingCategory = await category.findByPk(ctx.params.id);
    if (!existingCategory) {
      ctx.status = 404;
      ctx.body = { error: "Categoría no encontrada" };
      return;
    }

    const { cate_name, cat_descr } = ctx.request.body;
    if (!cate_name && !cat_descr) {
      ctx.status = 400;
      ctx.body = {
        error:
          "Debe proporcionar al menos un campo para actualizar (name o description)",
      };
      return;
    }

    await existingCategory.update(ctx.request.body);
    ctx.status = 200;
    ctx.body = existingCategory;
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// DELETE eliminar categoría
router.delete("/:id", async (ctx) => {
  try {
    const existingCategory = await category.findByPk(ctx.params.id);
    if (!existingCategory) {
      ctx.status = 404;
      ctx.body = { error: "Categoría no encontrada" };
      return;
    }

    await category.destroy({ where: { id: ctx.params.id } });
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Categoría eliminada exitosamente",
      data: {
        id: ctx.params.id,
        name: existingCategory.cate_name,
      },
    };
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;
