const { timeStamp, log } = require("node:console");
const { createServer } = require("node:http");
const { url } = require("node:url");

const hostname = "127.0.0.1";
const port = "3000";
let amount = 0;

//o post foi testado assim: 
//curl -X POST http://localhost:3000/count -H "Content-Type: application/json" -d '{"incrementBy": 1230}'
//eu nao tenho ideia se funciona de outra maneira

function isPrime(num) {
	if (num <= 1) {
		return false;
	}
	else {
		for (let i = 2; i < num; i++) {
			if (num % i == 0) {
				return false;
			}
		}
	}
	return true;
}

function counter(amount, increment) {
	return amount += increment;
}
//ainda e mais legivel assim para mim, entendo do outro modo que voce passa uma "funcao anonima", mas assim parece mlr
function requesthandler(request, response) {
	//need to say application/json so that the browser knows its a json file
	response.setHeader("Content-type", "application/json");

	try {
		const url = new URL(request.url, `http://${hostname}:${port}`);

		if (request.method === "GET" && url.pathname === "/health-check") {

			const timeStamp = new Date().toISOString();
			response.statusCode = 200;
			response.end(JSON.stringify({ sucess: true, timestamp: timeStamp }));
			//response.end send a response to the browser, if you dont sent it the browser will keep on waiting
			response.statusCode = 200;
			response.end(JSON.stringify({ number: splitedUrl }));
			//JSON.stringfy transforms a js value into a JSON notation, parse does the oposite
		}

		else if (request.method === "GET" && url.pathname.startsWith("/is-prime-number/")) {
			let splitedUrl = url.pathname.split("/");
			let num = parseInt(splitedUrl[2]);

			if (isNaN(num)) {
				response.statusCode = 400;
				return response.end(JSON.stringify({ error: "Invalid number" }));
			}

			const prime = isPrime(num);
			response.statusCode = 200;
			response.end(JSON.stringify({ number: num, isPrime: prime }));
		}

		else if (request.method === "POST" && url.pathname === "/count") {
			//so we are basically receiving the data in chunks and storing in a body.
			let body = "";

			request.on("data", chunk => {
				body += chunk.toString();
			})

			request.on("end", () => {
				//parse transforms an JSON to a javascript object, is the oposite of stringfy
				try {
					const parsedData = JSON.parse(body);
					//be able to acess the .incrementBy its very usefull
					const number = parsedData.incrementBy;

					amount = counter(amount, number);

					response.statusCode = 200;
					response.end(JSON.stringify({ "counter": amount }));

				} catch (error) {
					response.statusCode = 400;
					response.end(JSON.stringify({ error: "Invalid JSON" }));
				}
			})
		};

	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end(JSON.stringify({ error: "Internal server error" }));
	}


};

const server = createServer(requesthandler);

server.listen(port, hostname, () => {
	console.log(`server running at http://${hostname}:${port}`)
});

