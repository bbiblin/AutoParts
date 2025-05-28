'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('productos', 'minorist_price', 'retail_price');
    await queryInterface.renameColumn('productos', 'mayorist_price', 'wholesale_price');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('productos', 'retail_price', 'minorist_price');
    await queryInterface.renameColumn('productos', 'wholesale_price', 'mayorist_price');
  }
};
