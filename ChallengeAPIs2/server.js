const { createServer } = require("node:http");

const hostname = "127.0.0.1";
const port = "3000";

function getRawValues(value) {
	console.log(value);
}

async function getValues() {

	const urlUSD = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
	const urlBRL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl';
	const options = { method: 'GET', headers: { accept: 'application/json' } };
	//i just copy/paste this from the coin gecko site

	try {
		const responseUSD = await fetch(urlUSD, options);
		const jsonUSD = await responseUSD.json();

		const responseBRL = await fetch(urlBRL, options);
		const jsonBRL = await responseBRL.json();

		return { jsonUSD, jsonBRL };

	} catch (error) {
		console.error(error);
	}
}

async function main() {

	//js doesnt let you do like: let jsonUSD, jsonBRL you have to {jsonUSD, jsonBRL}, had to google this
	//in the return as well, not sure why, i think its because you have to threat them as objects?
	let { jsonUSD, jsonBRL } = await getValues();

	//i have no idea, but if i removed the ? this just dont work and throw an error, also being able to acess the . of a json its really useful

	let valueUSD = jsonUSD?.bitcoin?.usd;
	let valueBRL = jsonBRL?.bitcoin?.brl;

	const server = createServer((req, res) => {

		res.setHeader("Content-type", "application/json");

		try {
			const url = new URL(req.url, `http://${hostname}:${port}`);

			if (req.method === "GET" && url.pathname.startsWith("/stock-insight/")) {

				let splitedUrl = url.pathname.split("/");

				if (splitedUrl[2].toLowerCase() == "brl") {
					res.statusCode = 200;
					res.end(JSON.stringify({ btc_price: valueBRL, currency: "brl" }));
				}
				else if (splitedUrl[2].toLowerCase() == "usd") {
					res.statusCode = 200;
					res.end(JSON.stringify({ btc_price: valueUSD, currency: "usd" }));
				}
				else {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "Currency not found" }));
				}
			}
		} catch (error) {
			console.error(error);
			res.statusCode = 500;
			res.end(JSON.stringify({ error: "Internal server error" }));
		}
	});

	server.listen(port, hostname, () => {
		console.log(`server running at http://${hostname}:${port}`)
	});
}

main();
