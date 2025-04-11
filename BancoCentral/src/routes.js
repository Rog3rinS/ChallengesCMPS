import { Router } from 'express';
import InstitutionController from './app/controllers/InstitutionController';
import UserController from './app/controllers/UserController';
import AccountController from './app/controllers/AccountController';
import TransactionController from './app/controllers/TransactionController';

const routes = new Router(); //it creates a new Router object

//Institutions
routes.post('/instituicao', InstitutionController.store);
routes.delete('/instituicao/:id', InstitutionController.delete);

//Users
routes.get('/usuarios/:cpf', UserController.index);
routes.post('/usuarios', UserController.store);
routes.put('/usuarios/:cpf', UserController.update);
routes.delete('/usuarios/:cpf', UserController.delete);

//Accounts
routes.post('/usuarios/:cpf/contas', AccountController.store);

//Transactions
routes.post('/usuarios/:cpf/transacoes', TransactionController.store);

export default routes;
