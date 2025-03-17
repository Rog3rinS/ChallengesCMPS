const { log } = require("console");
const readline = require("readline");

//basicamente criando criando uma variavel para usar os file descriptors de entrada/saida assim conseguindo ler e printar
const leitor = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let movs = ["pedra", "papel", "tesoura"]

// pelo que eu entendi de Promise e resolve, como question e asincrono, voce precisa de uma promessa que vai retornar algo,       depois para cumprir essa promessa voce retornar um resolve, tudo isso  pois .question e assincrono 
function playerChoice() {
	return new Promise((resolve) => {
		leitor.question("Input: ", (input) => {
			leitor.close()
			if (input.toLowerCase() == movs[0] || input.toLowerCase() == movs[1] || input.toLowerCase() == movs[2]) {
				resolve(input)
			}
			else {
				console.log("faca um movimento valido!")
			}
		})
	})
}

function computerChoice() {
	return movs[Math.floor(Math.random() * movs.length)]
}

function result(player, computer) {
	if (player === computer) {
		console.log("Empate!")
	} else if ((player === 'pedra' && computer === 'papel') ||
		(player === 'papel' && computer === 'tesoura') ||
		(player === 'tesoura' && computer === 'pedra')) {
		console.log("Voce perdeu!")
	} else {
		console.log("Voce ganhou!")
	}
}

// async pois como estamos chamando o player choice que tambem e async, precisamos esperar pelo player choice
async function main() {

	const player = await playerChoice();
	const computer = computerChoice();
	console.log("Computador: " + computer)

	result(player, computer);
}

main()
