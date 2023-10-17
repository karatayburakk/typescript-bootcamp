import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import { AppDataSource } from '../data-source';
import { Course } from '../models/course';
import { Lesson } from '../models/lesson';

export async function findCourseByUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    logger.debug(`Called findCourseByUrl()`);

    const courseUrl = req.params.courseUrl;

    if (!courseUrl) {
      throw 'Could not extract the course url from the request.';
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({ url: courseUrl });

    if (!course) {
      const message = `Could not find a course with url ${courseUrl}`;
      logger.error(message);

      res.status(404).json({ message });

      return;
    }

    const totalLessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder('lesson')
      .where('lesson.courseId = :courseId', {
        courseId: course.id,
      })
      .getCount();

    return res.status(200).json({
      course,
      totalLessons,
    });
  } catch (err) {
    logger.error(`Error calling findByCourseUrl()`);
    return next(err);
  }
}
