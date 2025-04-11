import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Institution from '../app/models/Institution.js';
import User from '../app/models/User.js';
import Account from '../app/models/Account.js';
import Transaction from '../app/models/Transaction.js';

const models = [Institution, User, Account, Transaction];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig); //this will take our postgres connection config and sequlize it

		models.map(model => model.init(this.connection));
		models.map(model => model.associate && model.associate(this.connection.models));
	}

}

export default new Database();
