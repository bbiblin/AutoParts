'use strict';

const { url } = require('koa-router');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [{
      cate_name: 'Filtros de aceite',
      cat_descr: 'Filtros de aceite de diferentes marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      cate_name: 'Filtros de aire',
      cat_descr: 'Filtros de aire de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Bujías',
      cat_descr: 'Bujías de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Correas de distribución',
      cat_descr: 'Correas de distribución de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    //Frenos y suspensión
    {
      cate_name: 'Pastillas de freno',
      cat_descr: 'Pastillas de freno de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Discos de freno',
      cat_descr: 'Discos de freno de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Amortiguadores',
      cat_descr: 'Amortiguadores de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Rótulas',
      cat_descr: 'Rótulas de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    //Electricidad y baterías
    {
      cate_name: 'Alteradores',
      cat_descr: 'Alternadores de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Baterías',
      cat_descr: 'Baterías de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Luces y faros',
      cat_descr: 'Luces y faros de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Sensores y fusibles',
      cat_descr: 'Sensores y fusibles de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    //Accesorios y seguridad
    {
      cate_name: 'Alarmas',
      cat_descr: 'Alarmas de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Cinturones de seguridad',
      cat_descr: 'Cinturones de seguridad de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Cubre asientos',
      cat_descr: 'Cubre asientos de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cate_name: 'Kits de emergencia',
      cat_descr: 'Kits de emergencia de distintas marcas',

      createdAt: new Date(),
      updatedAt: new Date()
    }

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};