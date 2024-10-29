'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('inspeccion_recepcion', 'lista_verificacion');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inspeccion_recepcion', 'lista_verificacion', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  }
};
