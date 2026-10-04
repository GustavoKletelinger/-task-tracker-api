# Task Tracker API

API RESTful para gestao de tarefas, com Node.js, Express, TypeScript, Sequelize (PostgreSQL) e Swagger. Conteinerizada com Docker e com esteira de CI no GitHub Actions.

## Rodando com Docker (recomendado)

```bash
docker compose up --build
```

Isso sobe a API em `http://localhost:3000` e um banco PostgreSQL junto, com os dados persistidos em um volume.
Depois de subir, rode a migration dentro do container da API:

```bash
docker compose exec api pnpm migrate
```

## Rodando localmente (sem Docker)

```bash
pnpm install
cp .env.example .env   # edite com os dados do seu banco
pnpm migrate
pnpm dev
```

## Qualidade de codigo

```bash
pnpm lint            # ESLint
pnpm format:check    # Prettier
pnpm type-check       # tsc --noEmit
pnpm build            # compila para dist/
```

Um hook do Husky roda lint, format:check e type-check automaticamente antes de cada commit.

## Documentacao (Swagger UI)

`http://localhost:3000/api-docs`
