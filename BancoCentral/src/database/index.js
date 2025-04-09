import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Institution from '../app/models/Institution.js';

const models = [Institution];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig); //this will take our postgres connection config and sequlize it

		models.map(model => model.init(this.connection));
		//there will probably be an association line here
	}

}

export default new Database();
