import Sequelize, { Model } from 'sequelize';

class Transaction extends Model {
	static init(sequelize) {
		super.init(
			{
				type: {
					type: Sequelize.ENUM("deposito", "saque", "transferencia"),
					allowNull: false,
				},
				amount: {
					type: Sequelize.FLOAT,
					allowNull: false,
				},
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Account, { foreignKey: "origin_account_id", as: "origin_account" });
		this.belongsTo(models.Account, { foreignKey: "destination_account_id", as: "destination_account" });
		this.belongsTo(models.Institution, { foreignKey: "institution_id", as: "institution" });
	}
};

export default Transaction;
