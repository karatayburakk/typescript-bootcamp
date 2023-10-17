import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Course } from '../models/course';

export async function getAllCourses(req: Request, res: Response, next: NextFunction) {
  try {
    logger.debug(`Called getAllCourses()`);

    // throw { error: 'Thrown Error' };

    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lesson')
      .orderBy('course.seqNo')
      .getMany();

    res.status(200).json({ courses });
  } catch (err) {
    logger.error(`Error calling getAllCourse()`);

    return next(err);
  }
}
