import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const port = process.env.PORT ?? '3000';

// Funciona tanto em desenvolvimento (.ts) quanto após o build (.js).
const routesGlob = path.join(__dirname, '../routes/*.{ts,js}').replace(/\\/g, '/');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Tracker API',
      version: '1.0.0',
      description: 'API RESTful para gestão de tarefas, com prioridade, status e prazo.',
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Estudar Sequelize' },
            description: { type: 'string', nullable: true, example: 'Ler a documentação de models' },
            priority: { type: 'string', enum: ['baixa', 'media', 'alta'], example: 'alta' },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'], example: 'pendente' },
            dueDate: { type: 'string', format: 'date', nullable: true, example: '2026-10-05' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-09-28T12:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-09-28T12:00:00.000Z' },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', maxLength: 120, example: 'Estudar Sequelize' },
            description: { type: 'string', nullable: true, example: 'Ler a documentação de models' },
            priority: { type: 'string', enum: ['baixa', 'media', 'alta'], example: 'alta' },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'], example: 'pendente' },
            dueDate: { type: 'string', format: 'date', nullable: true, example: '2026-10-05' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Descrição do erro' },
            errors: { type: 'array', items: { type: 'string' }, example: ['O campo title é obrigatório'] },
          },
        },
      },
    },
  },
  apis: [routesGlob],
};

export const swaggerSpec = swaggerJsdoc(options);
