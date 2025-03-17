//stack overflow necessitou ser usado para descobrir como receber input de uma array
//readline = modulo do node para ler entrada de usuarios a partir da CLI
const { exit } = require("process");
const readline = require("readline");

//basicamente criando criando uma variavel para usar os file descriptors de entrada/saida assim conseguindo ler e printar
const leitor = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const conj = []

// async para ser capaz de utilizar o await e promise
leitor.question('Digite a quantidade de itens do conjunto: ', async (quantidade) => {
	for (let i = 0; i < quantidade; i++) {
		// criando uma nova promessa e esperando ela ser resolvida, que e o usuario digitar o proximo valor da array
		await new Promise((resolve) => {
			leitor.question(`Digite o valor de indice ${i}: `, (valor) => {
				const numero = parseInt(valor)
				if (isNaN(numero)) {
					console.log("Valor nao e um numero")
					exit(1)
				}
				// se passar o valor n da certo, eu passei por isso
				resolve(conj.push(numero));
			});
		});
	}
	leitor.close();

	function sumArray(array) {
		let sum = 0
		for (let i = 0; i < array.length; i++) {
			sum = sum + array[i];
		}
		return sum
	}

	let result = sumArray(conj);

	console.log(result)

	return conj
});
//funciona, mesmo que comece com undefined
