'use strict';

const { url } = require('koa-router');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productos', [{
      product_cod: 'P001',
      minorist_price: 10000,
      mayorist_price: 8000,
      isActive: true,
      product_name: 'Filtro de aceite Toyota',
      description: 'Filtro de aceite compatible con Toyota Corolla y Yaris.',
      stock: 50,
      category_id: 5,
      brand_id: 16,
      image_url: 'https://tiendadelmecanico.cl/wp-content/uploads/2023/02/PhotoRoom-20230222_151420.png',
      state: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      product_cod: 'P002',
      minorist_price: 12000,
      mayorist_price: 10000,
      isActive: true,
      product_name: 'Motor toyota',
      description: 'Motor loko',
      stock: 50,
      category_id: 4,
      brand_id: 15,
      image_url: 'https://tiendadelmecanico.cl/wp-content/uploads/2023/02/PhotoRoom-20230222_151420.png',
      state: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('productos', null, {});
  }
};
