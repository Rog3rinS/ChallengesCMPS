module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      origin_account_id: {
        type: Sequelize.INTEGER,
        references: { model: "accounts", key: "id" },
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      destination_account_id: {
        type: Sequelize.INTEGER,
        references: { model: "accounts", key: "id" },
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: Sequelize.ENUM("deposito", "saque", "transferencia"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      institution_id: {
        type: Sequelize.INTEGER,
        references: { model: "institutions", key: "id" },
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable("transactions");
  },
};
