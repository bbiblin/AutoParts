'use strict';

const { url } = require('koa-router');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('brands', [{
      brand_name: 'Bosch',
      brand_code: 'BH001',
      origin_country: 'Alemania',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand_name: 'Mobil',
      brand_code: 'ML002',
      origin_country: 'Estados Unidos',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand_name: 'Monroe',
      brand_code: 'ME003',
      origin_country: 'Estados Unidos',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand_name: 'NGK',
      brand_code: 'NK004',
      origin_country: 'Japón',

      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('brands', null, {});
  }
};
