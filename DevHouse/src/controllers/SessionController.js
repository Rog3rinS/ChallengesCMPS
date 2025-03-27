import { json } from "express";
import User from "../models/User.js";
import * as Yup from "yup";

class SessionControler {
	async store(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string().email().required()
		});

		const email = req.body.email;

		if (!(await schema.isValid(req.body))) {
			return res.status(400), json({ error: "Invalid email" });
		};

		let user = await User.findOne({ email });

		if (!user) {
			user = await User.create({ email });
		}
		return res.json(user);
	}
}

export default new SessionControler();
