import { Router } from 'express';

const routes = new Router(); //it creates a new Router object, 

routes.get('/test', (req, res) => {
	return res.json({ ok: true });
});

export default routes;
