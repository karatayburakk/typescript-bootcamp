import 'reflect-metadata';
import express from 'express';
import { root } from './routes/root';
import { logger } from './logger';
import { AppDataSource } from './data-source';

const app = express();
const port = process.env.PORT || 80;

function setupExpress(): void {
  app.route('/').get(root);
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
