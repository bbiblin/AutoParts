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


//POST para marca

router.post('/', async (ctx) => {
    try {
        console.log(ctx.request.body);

        // Validaciones
        const { brand_name, brand_code, origin_country } = ctx.request.body;

        // Validar campos requeridos
        if (!brand_name || !brand_code) {
            ctx.status = 400;
            ctx.body = {
                error: 'Los campos brand_name y brand_code son requeridos'
            };
            return;
        }

        // Validar que brand_name no esté vacío
        if (brand_name.trim().length === 0) {
            ctx.status = 400;
            ctx.body = {
                error: 'El brand_name no puede estar vacío'
            };
            return;
        }

        // Validar formato de brand_code (solo letras, números y guiones bajos)
        const codeRegex = /^[A-Za-z0-9_-]+$/;
        if (!codeRegex.test(brand_code)) {
            ctx.status = 400;
            ctx.body = {
                error: 'El brand_code solo puede contener letras, números, guiones y guiones bajos'
            };
            return;
        }

        // Validar longitud de campos
        if (brand_name.length > 255) {
            ctx.status = 400;
            ctx.body = {
                error: 'El brand_name no puede exceder 255 caracteres'
            };
            return;
        }

        if (brand_code.length > 255) {
            ctx.status = 400;
            ctx.body = {
                error: 'El brand_code no puede exceder 255 caracteres'
            };
            return;
        }

        // Validar origin_country si se proporciona
        if (origin_country && origin_country.length > 255) {
            ctx.status = 400;
            ctx.body = {
                error: 'El origin_country no puede exceder 255 caracteres'
            };
            return;
        }

        // Verificar si ya existe una marca con el mismo código
        const existingBrand = await brand.findOne({
            where: { id: id }
        });

        if (existingBrand) {
            ctx.status = 409;
            ctx.body = {
                error: 'Ya existe una marca con este brand_code'
            };
            return;
        }

        const brandData = {
            brand_name: brand_name.trim(),
            brand_code: brand_code.trim().toUpperCase(),
            origin_country: origin_country ? origin_country.trim() : null
        };

        const nuevaBrand = await brand.create(brandData);

        ctx.status = 201;
        ctx.body = nuevaBrand;
    } catch (error) {
        console.error('Error al crear brand:', error);

        // Manejar errores específicos de Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            ctx.status = 409;
            ctx.body = {
                error: 'Ya existe una marca con este brand_code'
            };
        } else if (error.name === 'SequelizeValidationError') {
            ctx.status = 400;
            ctx.body = {
                error: 'Datos de validación incorrectos',
                details: error.errors.map(e => e.message)
            };
        } else {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    }
});

//UPDATE PARA MARCA
router.patch('/:id', async (ctx) => {
    try {
        const { id } = ctx.params;
        console.log('ID a modificar:', id);
        console.log('Datos recibidos:', ctx.request.body);

        // Validar que el ID sea válido
        if (!id || isNaN(id)) {
            ctx.status = 400;
            ctx.body = {
                error: 'ID inválido'
            };
            return;
        }

        // Buscar la marca existente
        const brandExistente = await brand.findByPk(id);

        if (!brandExistente) {
            ctx.status = 404;
            ctx.body = {
                error: 'Marca no encontrada'
            };
            return;
        }

        // Extraer solo los campos permitidos para modificar
        const { brand_name, origin_country } = ctx.request.body;

        if (!brand_name && !origin_country && origin_country !== null) {
            ctx.status = 400;
            ctx.body = {
                error: 'Debe proporcionar al menos brand_name u origin_country para actualizar'
            };
            return;
        }

        // Objeto para almacenar los datos a actualizar
        const datosActualizacion = {};

        // Validar y procesar brand_name si se proporciona
        if (brand_name !== undefined) {
            if (typeof brand_name !== 'string' || brand_name.trim().length === 0) {
                ctx.status = 400;
                ctx.body = {
                    error: 'El brand_name no puede estar vacío'
                };
                return;
            }

            if (brand_name.length > 255) {
                ctx.status = 400;
                ctx.body = {
                    error: 'El brand_name no puede exceder 255 caracteres'
                };
                return;
            }

            datosActualizacion.brand_name = brand_name.trim();
        }

        // Validar y procesar origin_country si se proporciona
        if (origin_country !== undefined) {
            if (origin_country === null || origin_country === '') {
                // Permitir establecer origin_country como null
                datosActualizacion.origin_country = null;
            } else {
                if (typeof origin_country !== 'string') {
                    ctx.status = 400;
                    ctx.body = {
                        error: 'El origin_country debe ser un string válido'
                    };
                    return;
                }

                if (origin_country.length > 255) {
                    ctx.status = 400;
                    ctx.body = {
                        error: 'El origin_country no puede exceder 255 caracteres'
                    };
                    return;
                }

                datosActualizacion.origin_country = origin_country.trim();
            }
        }

        // Actualizar la marca
        await brandExistente.update(datosActualizacion);

        // Recargar la marca para obtener los datos actualizados
        await brandExistente.reload();

        ctx.status = 200;
        ctx.body = {
            message: 'Marca actualizada correctamente',
            data: brandExistente
        };

    } catch (error) {
        console.error('Error al actualizar brand:', error);

        // Manejar errores específicos de Sequelize
        if (error.name === 'SequelizeValidationError') {
            ctx.status = 400;
            ctx.body = {
                error: 'Datos de validación incorrectos',
                details: error.errors.map(e => e.message)
            };
        } else if (error.name === 'SequelizeDatabaseError') {
            ctx.status = 400;
            ctx.body = {
                error: 'Error en la base de datos',
                details: error.message
            };
        } else {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    }
});

//DELETE Marca
router.delete('/:id', async (ctx) => {
    try {
        const { id } = ctx.params;
        
        // Validar que el ID sea proporcionado
        if (!id) {
            ctx.status = 400;
            ctx.body = {
                error: 'El ID de la marca es requerido'
            };
            return;
        }
        
        // Validar que el ID sea un número válido
        const brand_id = parseInt(id);
        if (isNaN(brand_id ) || brand_id  <= 0) {
            ctx.status = 400;
            ctx.body = {
                error: 'El ID debe ser un número válido mayor a 0'
            };
            return;
        }
        
        // Verificar si la categoría existe
        const existingBrand = await  brand.findByPk(brand_id);
        
        if (!existingBrand) {
            ctx.status = 404;
            ctx.body = {
                error: 'Marca no encontrada'
            };
            return;
        }
    
        
        // Eliminar la categoría
        await brand.destroy({
            where: { id: brand_id}
        });
        
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: {
                id: brand_id,
                name: existingBrand.brand_name
            }
        };
        
    } catch (error) {
        console.error('Error al eliminar la marca', error);
        
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