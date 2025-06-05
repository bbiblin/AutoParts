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
        console.error('Error en /productos:id', error);
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

    // Validaciones para name si se proporciona
    if (cat_descr !== undefined) {
      // Validar que name no esté vacío
      if (!cate_name || cat_descr.trim().length === 0) {
        ctx.status = 400;
        ctx.body = {
          error: "El campo name no puede estar vacío",
        };
        return;
      }

      // Validar longitud de name
      if (cate_name.length > 255) {
        ctx.status = 400;
        ctx.body = {
          error: "El name no puede exceder 255 caracteres",
        };
        return;
      }

      // Verificar si ya existe otra categoría con el mismo nombre (excluyendo la actual)
      const duplicateCategory = await category.findOne({
        where: {
          name: cate_name.trim(),
          id: { [Op.ne]: ctx.params.id }, // Excluir la categoría actual
        },
      });

      if (duplicateCategory) {
        ctx.status = 409;
        ctx.body = {
          error: "Ya existe una categoría con este nombre",
        };
        return;
      }
    }

    // Validaciones para description si se proporciona
    if (cat_descr !== undefined && cat_descr !== null) {
      // Validar longitud de description
      if (description.length > 500) {
        ctx.status = 400;
        ctx.body = {
          error: "La description no puede exceder 500 caracteres",
        };
        return;
      }
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (cate_name !== undefined) {
      updateData.cate_name = cate_name.trim();
    }
    if (cat_descr !== undefined) {
      updateData.cat_descr = cat_descr ? cat_descrss.trim() : null;
    }

    // Actualizar la categoría
    await existingCategory.update(updateData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Categoría actualizada exitosamente",
      data: existingCategory,
    };
  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    // Manejar errores específicos de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      ctx.status = 409;
      ctx.body = {
        error: "Ya existe una categoría con este nombre",
      };
    } else if (error.name === "SequelizeValidationError") {
      ctx.status = 400;
      ctx.body = {
        error: "Datos de validación incorrectos",
        details: error.errors.map((e) => e.message),
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: "Error interno del servidor",
        message: error.message,
      };
    }
  }
});

//POST Para categoria
router.post("/", async (ctx) => {
  try {
    console.log(ctx.request.body);

    // Validaciones
    const { cate_name, cat_descr } = ctx.request.body;

    // Validar campo requerido
    if (!cate_name) {
      ctx.status = 400;
      ctx.body = {
        error: "El campo name es requerido",
      };
      return;
    }

    // Validar que name no esté vacío
    if (cate_name.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        error: "El name no puede estar vacío",
      };
      return;
    }

    // Validar longitud de name
    if (cate_name.length > 255) {
      ctx.status = 400;
      ctx.body = {
        error: "El name no puede exceder 255 caracteres",
      };
      return;
      escription;
    }

    // Validar description si se proporciona
    if (cat_descr && cat_descr.length > 500) {
      ctx.status = 400;
      ctx.body = {
        error: "La description no puede exceder 500 caracteres",
      };
      return;
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await category.findOne({
      where: { name: cate_name.trim() },
    });

    if (existingCategory) {
      ctx.status = 409;
      ctx.body = {
        error: "Ya existe una categoría con este nombre",
      };
      return;
    }

    // Preparar datos para crear
    const categoryData = {
      name: cate_name.trim(),
      description: cat_descr ? cat_descr.trim() : null,
    };

    // Crear la nueva categoría
    const nuevaCategory = await cat_descr.create(categoryData);

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: "Categoría creada exitosamente",
      data: nuevaCategory,
    };
  } catch (error) {
    console.error("Error al crear categoría:", error);

    // Manejar errores específicos de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      ctx.status = 409;
      ctx.body = {
        error: "Ya existe una categoría con este nombre",
      };
    } else if (error.name === "SequelizeValidationError") {
      ctx.status = 400;
      ctx.body = {
        error: "Datos de validación incorrectos",
        details: error.errors.map((e) => e.message),
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: "Error interno del servidor",
        message: error.message,
      };
    }
  }
});

//DELETE categoria

router.delete('/:id', async (ctx) => {
    try {
        const { id } = ctx.params;
        
        // Validar que el ID sea proporcionado
        if (!id) {
            ctx.status = 400;
            ctx.body = {
                error: 'El ID de la categoría es requerido'
            };
            return;
        }
        
        // Validar que el ID sea un número válido
        const categoryId = parseInt(id);
        if (isNaN(categoryId) || categoryId <= 0) {
            ctx.status = 400;
            ctx.body = {
                error: 'El ID debe ser un número válido mayor a 0'
            };
            return;
        }
        
        // Verificar si la categoría existe
        const existingCategory = await category.findByPk(categoryId);
        
        if (!existingCategory) {
            ctx.status = 404;
            ctx.body = {
                error: 'Categoría no encontrada'
            };
            return;
        }
    
        
        // Eliminar la categoría
        await category.destroy({
            where: { id: categoryId }
        });
        
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: {
                id: categoryId,
                name: existingCategory.name
            }
        };
        
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        
        // Manejar errores específicos de Sequelize
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            ctx.status = 409;
            ctx.body = {
                error: 'Nname.o se puede eliminar la categoría porque está siendo referenciada por otros registros'
            };
        } else if (error.name === 'SequelizeDatabaseError') {
            ctx.status = 500;
            ctx.body = {
                error: 'Error de base de datos al eliminar la categoría'
            };
        } else {
            ctx.status = 500;
            ctx.body = { 
                error: 'Error interno del servidor',
                message: error.message 
            };
        }
    }
});
module.exports = router;
