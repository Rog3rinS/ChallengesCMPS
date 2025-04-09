import Institution from '../models/Institution.js';
import * as Yup from 'yup';

class InstitutionController {
	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			type: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		};

		const name = req.body.name.toLowerCase();
		const type = req.body.type.toLowerCase();

		const institutionExists = await Institution.findOne({
			where: { name: name }
		});

		if (institutionExists) {
			return res.status(400).json({ error: 'Instituição já existe.' });
		}

		const { id } = await Institution.create(req.body.toLowerCase());

		return res.json({
			id,
			name,
			type,
		});
	}

	async delete(req, res) {
		const { id } = req.params;

		const institution = await Institution.findByPk(id);

		if (!institution) {
			return res.status(404).json({ error: "Instituicao nao encontrada" });
		}

		await institution.destroy();

		return res.status(204).send();
	}
}

export default new InstitutionController();
