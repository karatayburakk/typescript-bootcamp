import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authJwtToken = req.headers.authorization;

  if (!authJwtToken) {
    logger.info(`The authentication JWT is not present, access denied`);
    res.sendStatus(403);
    return;
  }

  const user = jwt.verify(authJwtToken, JWT_SECRET);

  logger.info(`Found user detain in JWT: ${user}`);

  req['user'] = user;

  next();
}
