import { Router } from 'express';
import * as CourseService from '../services/CourseService.js';

export const courseRouter = Router();

courseRouter.post('/admin/courses', async (request, response) => {
  try {
    const { code, name, description } = request.body;
    const course = await CourseService.createCourse({ code, name, description });
    response.status(201).json(course);
  } catch (error) {
    if (error instanceof CourseService.CourseCodeAlreadyExistsError) {
      response.status(409).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

courseRouter.get('/admin/courses', async (_request, response) => {
  try {
    const courses = await CourseService.listCourses();
    response.status(200).json(courses);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
