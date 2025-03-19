const { timeStamp } = require("node:console");
const { createServer } = require("node:http");
const { url } = require("node:url");

const hostname = "127.0.0.1";
const port = "3000";

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
			//JSON.stringfy transforms a js value into a JSON notation, parse does the oposite
		}

	} catch (error) {
		console.error(error);
		response.statusCode = 400;
		response.end(JSON.stringify({ error: "Internal server error" }));
	}


};

const server = createServer(requesthandler);

server.listen(port, hostname, () => {
	console.log(`server running at http://${hostname}:${port}`)
});

