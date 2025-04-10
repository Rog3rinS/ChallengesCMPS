import { Router } from 'express';
import InstitutionController from './app/controllers/InstitutionController';
import UserController from './app/controllers/UserController';

const routes = new Router(); //it creates a new Router object

//Institutions
routes.post('/Instituicao', InstitutionController.store);
routes.delete('/Instituicao/:id', InstitutionController.delete);

//Users
routes.get('/Usuario/:cpf', UserController.index);
routes.post('/Usuario', UserController.store);
routes.put('/Usuario/:cpf', UserController.update);
routes.delete('/Usuario/:cpf', UserController.delete);

//Accounts
routes.get('/Usuario/:cpf', UserController.index);
routes.post('/Usuario', UserController.store);
routes.put('/Usuario/:cpf', UserController.update);
routes.delete('/Usuario/:cpf', UserController.delete);

export default routes;
