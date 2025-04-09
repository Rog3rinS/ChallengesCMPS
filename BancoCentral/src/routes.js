import { Router } from 'express';
import InstitutionController from './app/controllers/InstitutionController';

const routes = new Router(); //it creates a new Router object, 

routes.post('/Institution', InstitutionController.store);
routes.delete('/Institution/:id', InstitutionController.delete);

export default routes;
