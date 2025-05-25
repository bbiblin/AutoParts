'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Agregado para que no haya emails repetidos
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Agregado para que no haya usernames repetidos
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // Para definir valor por defecto
      },

      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        unique: true, // Si quieres que el teléfono sea único
        allowNull: false // Como en el modelo original
      },

      isDistribuitor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // Definir valor por defecto
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW') // Para que se auto complete
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW') // Para que se auto complete
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
