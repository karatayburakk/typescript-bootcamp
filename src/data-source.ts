import { DataSource } from 'typeorm';
import { Course } from './models/course';
import { Lesson } from './models/lesson';

const port = parseInt(process.env.DB_PORT || '5432');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Course, Lesson],
  synchronize: true,
  logging: true,
});
