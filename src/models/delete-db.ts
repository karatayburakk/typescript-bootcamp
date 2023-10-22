import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Lesson } from './lesson';
import { Course } from './course';
import { User } from './user';

async function deleteDb() {
  await AppDataSource.initialize();

  console.log('Database connection ready.');

  console.log('Clearing lesson table');

  await AppDataSource.getRepository(Lesson).delete({});

  console.log('Clearing course table');

  await AppDataSource.getRepository(Course).delete({});

  console.log('Clearing user table');

  await AppDataSource.getRepository(User).delete({});
}

deleteDb()
  .then(() => {
    console.log('Finished deleting db, exiting!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during deleting db', err);
  });
