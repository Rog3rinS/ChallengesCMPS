const readline = require("readline");

const leitor = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let isPalindromo = "";

leitor.question("Palindromo: ", (palindromo) => {
	palindromo = palindromo.split(" ").join("")
	for (let i = palindromo.length - 1; i >= 0; i--) {
		isPalindromo += palindromo[i]
	}
	if (isPalindromo == palindromo) {
		console.log("E um palindromo")
	}
	else {
		console.log("Nao e um palindromo")
	}
	leitor.close;
});

