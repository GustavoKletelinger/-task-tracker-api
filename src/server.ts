import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './config/database';
import { swaggerSpec } from './config/swagger';
import taskRoutes from './routes/taskRoutes';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/tasks', taskRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/api-docs');
});

// Tratamento de erros globais (ex.: JSON malformado no corpo da requisição).
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.status === 400) {
    res.status(400).json({ message: 'JSON inválido no corpo da requisição' });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    // A tabela "tasks" é criada rodando a migration: pnpm run migrate
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

void start();
