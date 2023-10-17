import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Course } from '../models/course';

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.info(`Called createCourse()`);

    const data = req.body;

    if (!data) {
      throw `no data available, cannot save course`;
    }

    const course = await AppDataSource.manager.transaction(
      'REPEATABLE READ',
      async (transactionalEntityManager) => {
        const repository = transactionalEntityManager.getRepository(Course);

        const result = await repository
          .createQueryBuilder('courses')
          .select('MAX(courses.seqNo)', 'max')
          .getRawOne();

        const course = repository.create({ ...data, seqNo: (result?.max ?? 0) + 1 });

        await repository.save(course);

        return course;
      }
    );

    return res.status(201).json({ course });
  } catch (err) {
    logger.error('Error calling createCourse()', err);
    return next(err);
  }
}
