import { randomBytes } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { User } from '../models/user';
import { calculatePasswordHash } from '../utils';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.debug(`Called createUser()`);

    const { email, pictureUrl, password, isAdmin } = req.body;

    if (!email) throw `Could not extract email from the request, aborting`;

    if (!password) throw `Could not extract plain text password from the request, aborting`;

    const repository = AppDataSource.getRepository(User);

    const user = await repository
      .createQueryBuilder('users')
      .where('email = :email', { email })
      .getOne();

    if (user) {
      const message = `User with email ${email} already exists, aborting`;
      logger.error(message);
      return res.status(500).json({ message });
    }

    const passwordSalt = randomBytes(64).toString('hex');

    const passwordHash = await calculatePasswordHash(password, passwordSalt);

    const newUser = repository.create({
      email,
      pictureUrl,
      isAdmin,
      passwordHash,
      passwordSalt,
    });

    await AppDataSource.manager.save(newUser);

    logger.info(`User ${email} has been created.`);

    return res.status(201).json({
      email,
      pictureUrl,
      isAdmin,
    });
  } catch (err) {
    logger.error(`Error calling createUser(), ${err}`);
    return next(err);
  }
}
