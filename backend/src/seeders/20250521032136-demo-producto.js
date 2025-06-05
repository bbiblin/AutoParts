'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productos', [{
      product_cod: 'P001',
      retail_price: 10000,
      wholesale_price: 8000,
      isActive: true,
      product_name: 'Filtro de aceite Toyota',
      description: 'Filtro de aceite compatible con Toyota Corolla y Yaris.',
      stock: 50,
      category_id: 20,
      brand_id: 11,
      image_url: 'https://tiendadelmecanico.cl/wp-content/uploads/2023/02/PhotoRoom-20230222_151420.png',
      state: true,
      featured: false,
      discount_percentage: 0,
      retail_price_sale: 10000,
      wholesale_price_sale: 8000,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      product_cod: 'P002',
      retail_price: 12000,
      wholesale_price: 10000,
      isActive: true,
      product_name: 'Motor toyota',
      description: 'Motor loko',
      stock: 50,
      category_id: 21,
      brand_id: 12,
      image_url: 'https://tiendadelmecanico.cl/wp-content/uploads/2023/02/PhotoRoom-20230222_151420.png',
      state: true,
      featured: false,
      discount_percentage: 0,
      retail_price_sale: 10000,
      wholesale_price_sale: 8000,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('productos', null, {});
  }
};
