const Router = require('koa-router');
const router = new Router();
const { category } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');

// GET para todas las categorias

router.get('/', async (ctx) => {
    try {
        const allCategories = await category.findAll();

        if (allCategories) {
            ctx.status = 200;
            ctx.body = allCategories;
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

module.exports = router;