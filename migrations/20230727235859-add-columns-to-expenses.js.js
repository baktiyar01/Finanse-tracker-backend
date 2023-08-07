// File: 20230728200000-add-columns-to-expenses.js

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("expenses", "expense_name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.addColumn("expenses", "amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn("expenses", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn("expenses", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("expenses", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("expenses", "expense_name");
    await queryInterface.removeColumn("expenses", "amount");
    await queryInterface.removeColumn("expenses", "date");
    await queryInterface.removeColumn("expenses", "createdAt");
    await queryInterface.removeColumn("expenses", "updatedAt");
  },
};
