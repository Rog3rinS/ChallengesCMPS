const { exit } = require("process");
const readline = require("readline");

const leitor = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let isPrimo = false

leitor.question("Numero: ", (numero) => {

	function primo(num) {
		if (num <= 1) {
			console.log("Numero nao e primo")
			exit(0)
		}
		else {
			for (let i = 2; i < num; i++) {
				if (num % i == 0) {
					return false
				}
			}
		}
		return true
	}

	function verificacaoPrimo(num) {
		if (!isNaN(num)) {
			if (primo(num)) {
				console.log("O numero e primo")
			}
			else {
				console.log("Numero nao e primo")
			}
		}
		else {
			console.log("Numero invalido")
		}
	}

	verificacaoPrimo(numero);

	leitor.close;
});
