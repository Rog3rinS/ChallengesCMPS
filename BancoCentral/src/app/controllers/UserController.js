import * as Yup from 'yup';
import User from '../models/User';

class UserController {
	async index(req, res) {
		const user = await User.findAll({
			where: { cpf: req.params.cpf }
		})

		return res.json(user);
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			//i could create a real cpf validotor using the method cpf but wouldnt be able to test it
			cpf: Yup.string().required().min(11).max(11),
			name: Yup.string().required(),
			email: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		}

		const userExists = await User.findOne({
			where: { email: req.body.cpf },
		});

		if (userExists) {
			return res.status(400).json({ error: 'Usuario já existe.' });
		}

		const { cpf, name, email } = await User.create(req.body);

		return res.json({
			cpf,
			name,
			email,
		});
	}

	async update(req, res) {
		const cpf = req.params.cpf;

		const user = await User.findByPk(cpf);

		if (!user) {
			return res.status(400).json({ error: 'Usuario não existe.' });
		}

		await user.update(req.body);
		return res.json(user);
	}

	async delete(req, res) {
		const cpf = req.params.cpf;

		const user = await User.findByPk(cpf);

		if (!user) {
			return res.status(400).json({ error: 'Usuario não existe.' });
		}

		await user.destroy();
		return res.send();
	}
}

export default new UserController();
