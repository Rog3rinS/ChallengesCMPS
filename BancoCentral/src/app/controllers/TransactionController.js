import * as Yup from 'yup';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Institution from '../models/Institution';

class TransactionController {
	async store(req, res) {
		const schema = Yup.object().shape({
			type: Yup.string().oneOf(["deposito", "saque", "transferencia"]).required(),
			amount: Yup.number().positive().required(),
			destination_cpf: Yup.string().min(11).max(11),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		}

		const { type, amount, destination_cpf } = req.body;
		const origin_cpf = req.params.cpf;

		console.log(origin_cpf);

		if (type == "transferencia" && !destination_cpf) {
			return res.status(400).json({ error: 'CPF de destino e obrigatorio ao realizar uma transferencia.' });
		}

		// Verificando se a conta de origem existe
		const originAccount = await Account.findOne({
			where: { cpf: origin_cpf }
		});

		if (!originAccount) {
			return res.status(400).json({ error: 'Conta de origem nao existe.' });
		}

		// Verificando se e handling errors em caso de transferencia
		let destinationAccount = null;

		if (type === "transferencia") {
			destinationAccount = await Account.findOne({ where: { cpf: destination_cpf } });

			if (!destinationAccount) {
				return res.status(404).json({ error: 'Conta de destino não encontrada.' });
			}

			if (origin_cpf === destination_cpf) {
				return res.status(400).json({ error: 'Transferência para a mesma conta não é permitida.' });
			}
		}

		if ((type === "saque" || type === "transferencia") && originAccount.balance < amount) {
			return res.status(400).json({ error: 'Saldo insuficiente.' });
		}

		// Handling de saldos
		if (type === "saque") {
			originAccount.balance -= amount;
			await originAccount.save(); //valida a alteracao no banco de dados
		}
		else if (type === "deposito") {
			originAccount.balance += amount;
			await originAccount.save();
		}
		else if (type === "transferencia") {
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
				instituiton_id: originAccount.institution_id,
			});

			const fullTransaction = await Transaction.findByPk(transaction.id, {
				include: {
					model: Account,
					as: "origin_account",
					include: {
						model: Institution,
						as: "institution",
						attributes: ["name"],
					},
				},
			});

			//shit got so messy, i needed to build a response
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
			};
			return res.status(201).json(response);
		} catch (err) {
			console.error('Transaction creation error:', err);
			return res.status(400).json({ error: 'Failed to create transaction.' });
		}
	}
}

export default new TransactionController();
