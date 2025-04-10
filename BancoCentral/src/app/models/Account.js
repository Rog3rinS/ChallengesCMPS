import Sequelize, { Model } from 'sequelize';

class Account extends Model {
	static init(sequelize) {
		super.init({
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			balance: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
		},
			{
				sequelize,
			});

		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "cpf", targetKey: "cpf" });
		this.belongsTo(models.Institution, { foreignKey: "instituiton_id" });
	}
};

export default Account;
