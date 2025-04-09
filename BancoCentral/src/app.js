import express from 'express';
import routes from './routes';

import './database';

class App {
	constructor() {
		this.server = express(); //create an express aplication, and save in this.server
		this.middleware(); //tells the server to use json
		this.routes(); //tells the server to use this routes, they were imported from "./routes"
	}

	middleware() {
		this.server.use(express.json());
	}

	routes() {
		this.server.use(routes);
	}
}

export default new App().server; //export the object App().server
