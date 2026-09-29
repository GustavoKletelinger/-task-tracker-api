# Task Tracker API

API RESTful para gestão de tarefas, desenvolvida com **Node.js, Express, TypeScript, Sequelize (PostgreSQL)** e documentada com **Swagger UI**. Projeto da disciplina Laboratório de Desenvolvimento Web (LDW).

## Tecnologias

- Node.js + Express + TypeScript (arquitetura MVC)
- PostgreSQL (local ou Supabase) com Sequelize ORM
- Swagger (swagger-jsdoc + swagger-ui-express)

## Entidade `Task`

| Campo | Tipo | Observação |
| --- | --- | --- |
| id | INTEGER | chave primária, auto incremento |
| title | STRING(120) | obrigatório |
| description | TEXT | opcional |
| priority | ENUM | `baixa`, `media` (padrão) ou `alta` |
| status | ENUM | `pendente` (padrão), `em_andamento` ou `concluida` |
| dueDate | DATEONLY | opcional, formato `AAAA-MM-DD` |
| createdAt / updatedAt | DATE | gerados automaticamente |

## Como executar

Pré-requisitos: Node.js 18+ e um banco PostgreSQL (instância local ou projeto no Supabase).

```bash
# 1. Instalar dependências
pnpm install        # ou: npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com as credenciais do seu banco
# use DB_SSL=true para Supabase e DB_SSL=false para PostgreSQL local

# 3. Rodar a migration (cria a tabela "tasks" no banco)
pnpm migrate        # ou: npm run migrate

# 4. Rodar em desenvolvimento
pnpm dev            # ou: npm run dev
```

Para desfazer a última migration, se precisar: `pnpm migrate:undo`.

Para gerar o build de produção:

```bash
pnpm build && pnpm start
```

## Documentação (Swagger UI)

Com o servidor rodando, acesse: **http://localhost:3000/api-docs**

## Endpoints

| Método | Rota | Descrição | Sucesso |
| --- | --- | --- | --- |
| GET | /tasks | Lista todas as tarefas | 200 |
| GET | /tasks/:id | Busca uma tarefa por ID | 200 |
| POST | /tasks | Cria uma tarefa | 201 |
| PUT | /tasks/:id | Atualiza uma tarefa | 200 |
| DELETE | /tasks/:id | Remove uma tarefa | 200 |

Erros: `400` para dados ou ID inválidos, `404` para tarefa não encontrada e `500` para falhas internas.

## Estrutura

```
src/
  config/       # conexão com o banco e Swagger
  models/       # modelo Sequelize + interface TypeScript
  controllers/  # lógica e validações
  routes/       # rotas com express.Router() e anotações Swagger
  server.ts     # ponto de entrada
```
