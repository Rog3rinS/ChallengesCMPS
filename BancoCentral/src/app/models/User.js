import Sequelize, { Model } from 'sequelize';

class User extends Model {
	static init(sequelize) {
		super.init({
			cpf: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
		},
			{
				sequelize,
			});

		return this;
	}
};

export default User;
