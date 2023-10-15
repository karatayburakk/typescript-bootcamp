import { Request, Response } from 'express';

export function root(req: Request, res: Response) {
  res.status(200).send('Health is ok');
}
