import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables - using resolve for ES module compatibility
const envPath = resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:example@localhost:5432/research_assistant_dev',
  entities: [
    resolve(process.cwd(), 'src/entities/*.entity.{ts,js}'),
  ],
  migrations: [
    resolve(process.cwd(), 'src/migrations/*[0-9]*-*.{ts,js}'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
