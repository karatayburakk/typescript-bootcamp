import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { COURSES, USERS } from './db-data';
import { DeepPartial } from 'typeorm';
import { Course } from './course';
import { Lesson } from './lesson';
import { User } from './user';
import { calculatePasswordHash } from '../utils';

async function populateDb() {
  await AppDataSource.initialize();

  console.log('Database Connection is ready');

  const courses = Object.values(COURSES) as DeepPartial<Course>[];

  const courseRepository = AppDataSource.getRepository(Course);

  const lessonRepository = AppDataSource.getRepository(Lesson);

  for (const courseData of courses) {
    console.log(`Inserting course: ${courseData.title}`);

    const course = courseRepository.create(courseData);

    await courseRepository.save(course);

    for (const lessonData of courseData.lessons!) {
      console.log(`Inserting lesson: ${lessonData.title}`);

      const lesson = lessonRepository.create(lessonData);

      lesson.course = course;

      await lessonRepository.save(lesson);
    }
  }

  const users = Object.values(USERS) as any[];

  for (let userData of users) {
    console.log(`Inserting User: ${userData}`);

    const { email, pictureUrl, isAdmin, passwordSalt, plainTextPassword } = userData;

    const user = AppDataSource.getRepository(User).create({
      email,
      pictureUrl,
      isAdmin,
      passwordSalt,
      passwordHash: await calculatePasswordHash(plainTextPassword, passwordSalt),
    });

    await AppDataSource.manager.save(user);
  }

  const totalCourses = await courseRepository.createQueryBuilder().getCount();

  const totalLessons = await lessonRepository.createQueryBuilder().getCount();

  console.log(`Data inserted - courses ${totalCourses} and lessons ${totalLessons}`);
}

populateDb()
  .then(() => {
    console.log('Finished populating DataSource, exiting!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during database population', err);
  });
