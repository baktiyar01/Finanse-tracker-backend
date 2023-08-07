"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Expenses", "budget_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      referenses: {
        module: "Budgets",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Expenses", "budget_id");
  },
};
