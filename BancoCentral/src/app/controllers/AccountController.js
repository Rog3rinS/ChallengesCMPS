import * as Yup from 'yup';
import Institution from '../models/Institution';
import Account from '../models/Account';

class AccountController {
	async index(req, res) {
		const institution = req.query.instituicao;

		if (!institution) {
			return res.status(400).json({ error: 'Parametro "?instituicao=" e obrigatorio.' });
		}

		const instituicao = await Institution.findOne({
			where: { name: req.query.instituicao },
		});

		if (!instituicao) {
			return res.status(400).json({ error: 'Instituicao nao encontrada.' });
		}
		const account = await Account.findAll({
			where: {
				cpf: req.params.cpf,
				institution_id: instituicao.id,
			}
		})

		if (account.length === 0) {
			return res.status(400).json({ error: 'Conta não existe.' });
		}

		return res.json(account);
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			institution_name: Yup.string().required(),
			type: Yup.string().required(),
		});

		const cpf = req.params.cpf;

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		}

		const { institution_name, type } = req.body;

		// Check to find the institution
		const institution = await Institution.findOne({
			where: { name: institution_name.toLowerCase() },
		});

		if (!institution) {
			return res.status(400).json({ error: 'Instituicao nao encontrada.' });
		}

		const accountExist = await Account.findOne({
			where: {
				cpf,
				institution_id: institution.id,
			},
		});

		if (accountExist) {
			return res.status(400).json({ error: 'Essa conta ja existe!' });
		}

		const account = await Account.create({
			cpf,
			institution_id: institution.id,
			type,
			balance: 0,
		});

		return res.status(201).json(account);
	}
}

export default new AccountController();
