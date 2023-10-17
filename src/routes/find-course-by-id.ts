import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Course } from '../models/course';

export async function findCourseById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.info(`Called findCourseById()`);

    const courseId = parseInt(req.params.courseId);

    if (!courseId) {
      throw `Invalid course id ${courseId}`;
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({ id: courseId });

    logger.info(course);

    if (!course) {
      throw `No course found with given id ${courseId}`;
    }

    return res.status(200).json({ course });
  } catch (err) {
    logger.error('Error calling findCourseById()', err);
    return next(err);
  }
}
