# 🏦 Banco Central

Este projeto simula funcionalidades básicas de um sistema de **Open Finance**, com operações como abertura de conta, depósitos, saques, transferências e consulta de saldo. Também há integração com outros "bancos" — tudo via linha de comando.

---

## 📦 Tecnologias Utilizadas

- Node.js
- JavaScript
- readline (interface CLI)
- Docker & Docker Compose

---


## 🚀 Como Executar

### 1. Clone o repositório (caso ainda não tenha)

```bash
git clone https://github.com/Rog3rinS/ChallengesCMPS.git
```

### 2. Acesse a pasta do projeto BancoCentral

```bash
cd ChallengesCMPS/BancoCentral
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o ambiente com Docker

```bash
sudo docker compose up -d
```

### 5. Rode as migration

```bash
npx sequelize-cli db:migrate
```

### 6. Execute o projeto usando o script

```bash
npm run dev
```

## 📘 Guia de Uso da API

Após iniciar o servidor, a API estará disponível em `http://localhost:8989`.

---

### 🔐 1. Criar um Usuário

**Endpoint**

`POST /usuarios`

**Corpo da requisição**

```json
{
  "cpf": "12345678900",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

### 🔎 2. Consultar Usuário por CPF

**Endpoint**

`GET /usuarios/:cpf`

### ✏️ 3. Atualizar Usuário

**Endpoint**

`PUT /usuarios/:cpf`

**Corpo da requisição**

```json
{
  "cpf": "12345678900",
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com"
}
```

### 🗑️ 4. Deletar Usuário

**Endpoint**

`DELETE /usuarios/:cpf`

---

### 🏛️ 5. Criar Instituição

**Endpoint**

`POST /instituicao`

**Corpo da requisição**

```json
{
  "name": "Banco do Brasil",
  "type": "Banco"
}
```

### 🗑️ 6. Deletar Instituição

**Endpoint**

`DELETE /instituicao/:id`

---

### 💳 7. Criar Conta para Usuário

**Endpoint**

`POST /usuarios/:cpf/contas`

**Corpo da requisição**

```json
{
  "institution_name": "Banco do Brasil",
  "type": "Banco"
}
```

### 🔎 8. Consultar Contas de Usuário por Instituição

**Endpoint**

`GET /usuarios/:cpf/contas?instituicao=`

**Parâmetros de consulta**

- `instituicao=` – O nome da instituição para filtrar as contas.

**Exemplo:**

`GET /usuarios/:cpf/contas?instituicao=Bradesco`

---

### 💸 9. Realizar Transação

**Endpoint**

`POST /usuarios/:cpf/transacoes`

**Corpo da requisição**

```json
{
  "type": "transferencia",
  "amount": 1,
  "destination_cpf": "12345678912"
}
```

### 📄 10. Consultar Extrato de Transações

**Endpoint com filtro de instituicao**

`GET /usuarios/:cpf/extrato?instituicao=` 

**Endpoint sem filtro de instituicao**

`GET /usuarios/:cpf/extrato` 
