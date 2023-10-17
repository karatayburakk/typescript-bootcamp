import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Course } from '../models/course';

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.debug('Calling updateCourse()');

    const courseId = parseInt(req.params.courseId);
    const changes = req.body;

    if (!courseId) {
      throw `Invalid course id ${courseId}`;
    }

    await AppDataSource.createQueryBuilder()
      .update(Course)
      .set(changes)
      .where('id = :courseId', { courseId })
      .execute();

    res.status(200).json({
      message: `Course ${courseId} was updated successfully.`,
    });
  } catch (err) {
    logger.error('Error calling updateCourse()');
    return next(err);
  }
}
