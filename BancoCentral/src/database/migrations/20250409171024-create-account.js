module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("accounts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "users", key: "cpf" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      institution_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "institutions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
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
    return queryInterface.dropTable("accounts")
  }
};
