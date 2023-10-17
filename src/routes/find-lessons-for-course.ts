import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Lesson } from '../models/lesson';

export async function findLessonsForCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.debug(`Called findLessonsForCourse()`);

    const courseId = parseInt(req.params.courseId);
    const query = req.query as any;

    const pageNumber = parseInt(query?.pageNumber) || 0;
    const pageSize = parseInt(query?.pageSize) || 3;

    if (!courseId || typeof courseId !== 'number') {
      throw `Invalid course id ${courseId}`;
    }

    if (pageNumber === null || typeof pageNumber !== 'number') {
      throw `Invalid pageNumber ${pageNumber}`;
    }

    if (!pageSize || typeof pageSize !== 'number') {
      throw `Invalid pageSize ${pageSize}`;
    }

    const lessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder('lessons')
      .where('lessons.courseId = :courseId', { courseId })
      .orderBy('lessons.seqNo')
      .skip(pageNumber * pageSize)
      .take(pageSize)
      .getMany();

    return res.status(200).json({ lessons });
  } catch (err) {
    logger.error(`Error calling findLessonsForCourse()`);
    return next(err);
  }
}
