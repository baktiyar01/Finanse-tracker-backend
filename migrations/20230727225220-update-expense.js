module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Expenses", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addConstraint("Expenses", {
      fields: ["user_id"],
      type: "foreign key",
      references: {
        table: "Users", // Make sure to use the correct table name for users
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Expenses", "user_id");
  },
};
