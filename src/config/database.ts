import 'dotenv/config';
import { Sequelize } from 'sequelize';

// SSL condicional: true para nuvem (ex.: Supabase), false para rede local.
const useSsl = process.env.DB_SSL === 'true';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});
