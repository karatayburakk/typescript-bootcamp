import express from 'express';
import { root } from './routes/root';
import { logger } from './logger';

const app = express();
const port = process.env.PORT || 80;

function setupExpress() {
  app.route('/').get(root);
}

function startServer() {
  app.listen(port, () => {
    logger.info(`Application is running at port ${port}`);
  });
}

setupExpress();

startServer();
