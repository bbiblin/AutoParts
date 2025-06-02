'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('productos', 'retail_price_sale', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('productos', 'wholesale_price_sale', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('productos', 'retail_price_sale');
    await queryInterface.removeColumn('productos', 'wholesale_price_sale');
  }
};
