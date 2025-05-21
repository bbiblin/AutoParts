'use strict';

const { url } = require('koa-router');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('brands', [{
      brand_name: 'belencita loka',
      brand_code: 'B0123',
      origin_country: 'cHILE',

      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('brands', null, {});
  }
};
