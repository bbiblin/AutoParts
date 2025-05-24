const Router = require('koa-router');
const router = new Router();
const { brand } = require('../models');
const { where, findByPk, findAll, create, update, destroy } = require('sequelize');

// GET para todas las categorias

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

module.exports = router;