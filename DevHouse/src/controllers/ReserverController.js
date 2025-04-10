import Reserve from "../models/Reserve.js";
import User from "../models/User.js";
import House from "../models/House.js";

class ReserveController {

	async index(req, res) {
		const { user_id } = req.headers;
		const reserves = await Reserve.find({ user: user_id }).populate("house");

		return res.json(reserves);
	}

	async store(req, res) {
		const { user_id } = req.headers;
		const { house_id } = req.params;
		const { date } = req.body;

		const house = await House.findById(house_id);
		if (!house) {
			return res.status(400).json({ error: "Essa casa nao existe" });
		}

		if (house.status !== true) {
			return res.status(400).json({ error: "Solicitacao Indisponivel" });
		}

		const user = await User.findById(user_id);
		if (String(user._id) === String(house.user)) {
			return res.status(401).json({ error: "Reserva nao permitida" });
		}

		const reserve = await Reserve.create({
			user: user_id,
			house: house_id,
			date,
		});

		const populatedReserve = await Reserve.findById(reserve._id)
			.populate("house")
			.populate("user")
			.exec();

		return res.json(populatedReserve);
	}

	async destroy(req, res) {
		const { reserve_id } = req.body;
		await Reserve.findByIdAndDelete({ _id: reserve_id })

		return res.send();
	}
}

export default new ReserveController();
