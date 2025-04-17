import * as Yup from 'yup';
import { Op } from "sequelize";
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import User from '../models/User';
import Institution from '../models/Institution';

class TransactionController {
	async index(req, res) {
		const institution = req.query.instituicao;

		if (institution) {
			const instituicao = await Institution.findOne({
				where: { name: req.query.instituicao },
			});

			if (!instituicao) {
				return res.status(400).json({ error: 'Instituicao nao encontrada.' });
			}

			const account = await Account.findOne({
				where: {
					cpf: req.params.cpf,
					institution_id: instituicao.id,
				},
			});

			if (!account) {
				return res.status(400).json({ error: 'Conta não existe.' });
			}

			const transaction = await Transaction.findAll({
				where: {
					[Op.or]: [
						{ origin_account_id: account.id },
						{ destination_account_id: account.id },
					],
				},
				order: [["created_at", "DESC"]],
			});

			const response = [];

			for (const tx of transaction) {
				const originAccount = await Account.findByPk(tx.origin_account_id);
				if (!originAccount) continue;

				const originUser = await User.findOne({ where: { cpf: originAccount.cpf } });
				const originInstitution = await Institution.findByPk(originAccount.institution_id);

				let destinationAccount = null;
				let destinationUser = null;
				let destinationInstitution = null;

				if (tx.destination_account_id) {
					destinationAccount = await Account.findByPk(tx.destination_account_id);

					if (destinationAccount) {
						destinationUser = await User.findOne({ where: { cpf: destinationAccount.cpf } });
						destinationInstitution = await Institution.findByPk(destinationAccount.institution_id);
					}
				}

				response.push({
					transference_id: tx.id,
					tipo: tx.type,
					valor: tx.amount,
					data: tx.created_at,
					origin: {
						name: originUser?.name || "Origin user nao encontrado",
						cpf: originUser?.cpf || "CPF nao encontrado",
						institution: originInstitution?.name || "Instituicao nao encontrada",
					},
					destination: tx.type === "transferencia" && destinationUser
						? {
							name: destinationUser.name,
							cpf: destinationUser.cpf,
							institution: destinationInstitution?.name || "Instituicao nao encontrada",
						}
						: null,
				});
			}
			return res.json(response);
		} else {
			const accounts = await Account.findOne({
				where: {
					cpf: req.params.cpf,
				},
			});

			if (!accounts) {
				return res.status(400).json({ error: 'Conta não encontrada.' });
			}

			const transaction = await Transaction.findAll({
				where: {
					[Op.or]: [
						{ origin_account_id: accounts.id },
						{ destination_account_id: accounts.id },
					],
				},
				order: [["created_at", "DESC"]],
			});

			const response = [];

			for (const tx of transaction) {
				const originAccount = await Account.findByPk(tx.origin_account_id);
				if (!originAccount) continue;

				const originUser = await User.findOne({ where: { cpf: originAccount.cpf } });
				const originInstitution = await Institution.findByPk(originAccount.institution_id);

				let destinationAccount = null;
				let destinationUser = null;
				let destinationInstitution = null;

				if (tx.destination_account_id) {
					destinationAccount = await Account.findByPk(tx.destination_account_id);

					if (destinationAccount) {
						destinationUser = await User.findOne({ where: { cpf: destinationAccount.cpf } });
						destinationInstitution = await Institution.findByPk(destinationAccount.institution_id);
					}
				}

				response.push({
					transference_id: tx.id,
					tipo: tx.type,
					valor: tx.amount,
					data: tx.created_at,
					origin: {
						name: originUser?.name || 'Origin user não encontrado',
						cpf: originUser?.cpf || 'CPF não encontrado',
						institution: originInstitution?.name || 'Instituição não encontrada',
					},
					destination: tx.type === 'transferencia' && destinationUser
						? {
							name: destinationUser.name,
							cpf: destinationUser.cpf,
							institution: destinationInstitution?.name || 'Instituição não encontrada',
						}
						: null,
				});
			}

			return res.json(response);
		}
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			type: Yup.string()
				.oneOf(["deposito", "saque", "transferencia"])
				.required(),
			amount: Yup.number()
				.positive()
				.required(),
			destination_cpf: Yup.string()
				.min(11)
				.max(11)
				.when("type", {
					is: "transferencia",
					then: (schema) => schema.required(),
					otherwise: (schema) => schema.notRequired(),
				}),
			institution_name_origin: Yup.string().required(),
			institution_name: Yup.string().when("type", {
				is: "transferencia",
				then: (schema) => schema.required(),
				otherwise: (schema) => schema.notRequired(),
			}),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		}

		const { type, amount, destination_cpf, institution_name_origin, institution_name } = req.body;
		const origin_cpf = req.params.cpf;

		const originInstitution = await Institution.findOne({ where: { name: institution_name_origin } });

		if (!originInstitution) {
			return res.status(404).json({ error: 'Instituição de origem não encontrada.' });
		}

		const originAccount = await Account.findOne({
			where: {
				cpf: origin_cpf,
				institution_id: originInstitution.id,
			},
		});

		if (!originAccount) {
			return res.status(400).json({ error: 'Conta de origem não encontrada.' });
		}

		let destinationAccount = null;

		if (type === "transferencia") {
			destinationAccount = await Account.findOne({ where: { cpf: destination_cpf } });
			if (!destinationAccount) {
				return res.status(404).json({ error: 'Conta de destino não encontrada.' });
			}

			if (origin_cpf === destination_cpf) {
				return res.status(400).json({ error: 'Transferência para a mesma conta não é permitida.' });
			}

			const destinationInstitution = await Institution.findOne({ where: { name: institution_name } });

			if (!destinationInstitution) {
				return res.status(404).json({ error: 'Instituição de destino não encontrada.' });
			}

			if (destinationAccount.institution_id !== destinationInstitution.id) {
				return res.status(400).json({ error: 'A conta de destino não pertence à instituição informada.' });
			}
		}

		if ((type === "saque" || type === "transferencia") && originAccount.balance < amount) {
			return res.status(400).json({ error: 'Saldo insuficiente.' });
		}

		if (type === "saque") {
			originAccount.balance -= amount;
			await originAccount.save();
		} else if (type === "deposito") {
			originAccount.balance += amount;
			await originAccount.save();
		} else if (type === "transferencia") {
			originAccount.balance -= amount;
			destinationAccount.balance += amount;
			await originAccount.save();
			await destinationAccount.save();
		}

		try {
			const transaction = await Transaction.create({
				type,
				amount,
				origin_account_id: originAccount.id,
				destination_account_id: destinationAccount ? destinationAccount.id : null,
				institution_id: originAccount.institution_id,
				destination_institution_id: destinationAccount ? destinationAccount.institution_id : null,
			});

			const fullTransaction = await Transaction.findByPk(transaction.id, {
				include: [
					{
						model: Account,
						as: "origin_account",
						include: {
							model: Institution,
							as: "institution",
							attributes: ["name"],
						},
					},
					{
						model: Account,
						as: "destination_account",
						include: {
							model: Institution,
							as: "institution",
							attributes: ["name"],
						},
					},
				],
			});

			const response = {
				id: fullTransaction.id,
				type: fullTransaction.type,
				amount: fullTransaction.amount,
				createdAt: fullTransaction.createdAt,
				origin_account_id: fullTransaction.origin_account_id,
				destination_account_id: fullTransaction.destination_account_id,
				origin_account: {
					cpf: fullTransaction.origin_account.cpf,
					institution: {
						name: fullTransaction.origin_account.institution.name,
					},
				},
				destination_account: fullTransaction.destination_account
					? {
						cpf: fullTransaction.destination_account.cpf,
						institution: {
							name: fullTransaction.destination_account.institution.name,
						},
					}
					: null,
			};

			return res.status(201).json(response);
		} catch (err) {
			console.error('Transaction creation error:', err);
			return res.status(400).json({ error: 'Falha ao criar transação.' });
		}
	}
}

export default new TransactionController();
