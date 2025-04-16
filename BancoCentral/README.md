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
