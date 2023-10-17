import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { root } from './routes/root';
import { logger } from './logger';
import { AppDataSource } from './data-source';
import { getAllCourses } from './routes/get-all-courses';
import { globalErrorHandler } from './middlewares/global-error-handler';
import { findCourseByUrl } from './routes/find-course-by-url';
import { findLessonsForCourse } from './routes/find-lessons-for-course';
import { updateCourse } from './routes/update-course';
import { findCourseById } from './routes/find-course-by-id';
import { createCourse } from './routes/create-course';
import { deleteCourseAndLessons } from './routes/delete-course';

const app = express();
const port = process.env.PORT || 80;

function setupExpress(): void {
  app.use(cors({ origin: true }));

  app.use(express.json());

  app.route('/').get(root);

  app.route('/api/courses').get(getAllCourses);

  // app.route('/api/courses/:courseUrl').get(findCourseByUrl);

  app.route('/api/courses/:courseId').get(findCourseById);

  app.route('/api/courses/:courseId/lessons').get(findLessonsForCourse);

  app.route('/api/courses/:courseId').patch(updateCourse);

  app.route('/api/courses').post(createCourse);

  app.route('/api/courses/:courseId').delete(deleteCourseAndLessons);

  app.use(globalErrorHandler);
}

function startServer(): void {
  app.listen(port, () => {
    logger.info(`Application is running at port ${port}`);
  });
}

AppDataSource.initialize()
  .then(() => {
    logger.info('The Datasource has been initialized successfully!');
    setupExpress();

    startServer();
  })
  .catch((err: Error) => {
    logger.error('Error during Datasource initialization', err);
    process.exit(1);
  });
