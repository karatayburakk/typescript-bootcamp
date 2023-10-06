import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 80;

app.get('/', (req: Request, res: Response) => {
  res.send('hi');
});

app.post('/', (req: Request, res: Response): Response => {
  return res.send('hi');
});

app.listen(port, () => {
  console.info(`App is running on port ${port}`);
});
