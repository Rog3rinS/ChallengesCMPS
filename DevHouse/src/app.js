import express from "express";
import routes from "./route.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

class App {
	//constructor gets executed when the class is called
	constructor() {
		//use this. because we are refereing to this class
		this.server = express();

		mongoose.connect("mongodb+srv://devhouse:devhouse@devhouse.afbrrad.mongodb.net/?retryWrites=true&w=majority&appName=devhouse");

		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.server.use(cors());

		this.server.use(
			"/files",
			express.static(path.resolve(__dirname, "..", "uploads"))
		);

		this.server.use(express.json());
	}

	routes() {
		this.server.use(routes);
	}
}

export default new App().server;

