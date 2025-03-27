import express from "express";

const server = express();
server.use(express.json()); //analisa o body do request e transforma em um objeto json


// query params = req.query.nome, to make the request: localhost:3000/curso?nome=...
// to get params = req.params.name of the parameter localhost:3000/curso/1 for example if it expects an id
const cursos = ["c", "Javascript", "Python"];

//Middleware global
server.use((req, res, next) => {
	console.log(`URL CHAMADA: ${req.url}`);

	return next();
})

function checkCurso(req, res, next) {
	if (!req.body.name) {
		return res.status(400).json({ error: "Name errado" });
	}

	return next();
}

function checkIndex(req, res, next) {
	const curso = cursos[req.params.index];
	if (!curso) {
		return res.status(400).json({ error: "Index nao existe" });

	}

	return next();
}
// creating endpoint at localhost:3000/curso
server.get("/cursos", (req, res) => {

	return res.json({ cursos: `${cursos}` })
})

// creating endpoint at localhost:3000/curso/id
server.get("/cursos/:index", checkIndex, (req, res) => {
	const index = req.params.index;

	return res.json({ curso: `${cursos[index]}` })
})

// testado com curl -X POST http://localhost:3000/cursos/ -H "Content-Type: application/json" -d '{ "name": "C#"}' | jq
server.post("/cursos", checkCurso, (req, res) => {
	const name = req.body.name;
	cursos.push(name);

	return res.json(cursos);
})

// testado com curl -X PUT http://localhost:3000/cursos/1 -H "Content-Type: application/json" -d '{ "name": "Laravel"}' | jq
server.put("/cursos/:index", checkIndex, checkCurso, (req, res) => {
	const index = req.params.index;
	const name = req.body.name

	cursos[index] = name;

	return res.json(cursos);
})

// testado com curl -X DELETE http://localhost:3000/cursos/1 | jq
server.delete("/cursos/:index", checkIndex, (req, res) => {
	const index = req.params.index;
	cursos.splice(index, 1);

	return res.json(cursos);
})

server.listen(3000);
