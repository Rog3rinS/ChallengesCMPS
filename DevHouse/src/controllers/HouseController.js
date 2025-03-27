import House from "../models/House.js";
import User from "../models/User.js";
import * as Yup from "yup";

class HouseController {

	async index(req, res) {
		const status = req.query.status;

		const houses = await House.find({ status: status });

		return res.json(houses);

	}

	async store(req, res) {
		const schema = Yup.object().shape({
			description: Yup.string().required(),
			price: Yup.number().required(),
			location: Yup.string().required(),
			status: Yup.boolean().required(),
		});

		const { filename } = req.file;
		const { description, price, location, status } = req.body;
		const user_id = req.headers.user_id;

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: "Falha na validacao" });
		};

		const house = await House.create({
			user: user_id,
			thumbnail: filename,
			description: description,
			price: price,
			location: location,
			status: status
		})

		return res.json(house);
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			description: Yup.string().required(),
			price: Yup.number().required(),
			location: Yup.string().required(),
			status: Yup.boolean().required(),
		});

		const { filename } = req.file;
		const { house_id } = req.params;
		const { description, price, location, status } = req.body;
		const user_id = req.headers.user_id;

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: "Falha na validacao" });
		};

		const user = await User.findById(user_id);
		const houses = await House.findById(house_id);

		if (String(user._id) !== String(houses.user)) {
			return res.status(401).json({ error: "Nao autorizado!" });
		}

		await House.updateOne({ _id: house_id }, {
			user: user_id,
			thumbnail: filename,
			description: description,
			price: price,
			location: location,
			status: status
		});

		return res.send();
	}

	async destroy(req, res) {
		const house_id = req.body.house_id;
		const user_id = req.headers.user_id;

		const user = await User.findById(user_id);
		const houses = await House.findById(house_id);

		if (String(user._id) !== String(houses.user)) {
			return res.status(401).json({ error: "Nao autorizado!" });
		}

		await House.findByIdAndDelete({ _id: house_id });


		return res.json({ message: "excluida com sucesso" });
	}
}

export default new HouseController();
