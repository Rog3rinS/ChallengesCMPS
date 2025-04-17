import { Router } from 'express';
import InstitutionController from './app/controllers/InstitutionController';
import UserController from './app/controllers/UserController';
import AccountController from './app/controllers/AccountController';
import TransactionController from './app/controllers/TransactionController';

const routes = new Router(); //it creates a new Router object

//Institutions
routes.post('/instituicao', InstitutionController.store); //Criar instituicao
routes.delete('/instituicao/:id', InstitutionController.delete); //Deletar instituicao

//Users
routes.get('/usuarios/:cpf', UserController.index); //Get usuario
routes.post('/usuarios', UserController.store); //Criar usuario
routes.put('/usuarios/:cpf', UserController.update); //Update de usuario
routes.delete('/usuarios/:cpf', UserController.delete); //Delete usuario

//Accounts
routes.post('/usuarios/:cpf/contas', AccountController.store); //Criar conta em uma instituicao
routes.get('/usuarios/:cpf/contas', AccountController.index); //Get conta 

//Transactions
routes.post('/usuarios/:cpf/transacoes', TransactionController.store); //Realizar transacao
routes.get('/usuarios/:cpf/extrato', TransactionController.index); //Extrato

//Balance
routes.get('/usuarios/:cpf/saldo', UserController.getBalance); //Ver saldo

export default routes;
