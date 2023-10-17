import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Lesson } from '../models/lesson';
import { Course } from '../models/course';

export async function deleteCourseAndLessons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.debug(`Called deleteCourseAndLessons()`);

    const courseId = parseInt(req.params.courseId);

    if (!courseId) {
      throw `Invalid course id ${courseId}`;
    }

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Lesson)
        .where('courseId = :courseId', { courseId })
        .execute();

      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Course)
        .where('id = :courseId', { courseId })
        .execute();
    });

    return res.status(200).json({
      message: `Course deleted successfully ${courseId}`,
    });
  } catch (err) {
    logger.error(`Error calling deleteCourseAndLessons()`, err);
    return next(err);
  }
}
