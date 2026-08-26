import { Router } from 'express';
import * as ExamService from '../services/ExamService.js';

export const examRouter = Router();

examRouter.post('/admin/exams', async (request, response) => {
  try {
    const { course_id, title, description, start_date, end_date } = request.body;
    const exam = await ExamService.createExam({ course_id, title, description, start_date, end_date });
    response.status(201).json(exam);
  } catch (error) {
    if (error instanceof ExamService.InvalidExamDatesError) {
      response.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

examRouter.post('/admin/exams/:id/questions', async (request, response) => {
  try {
    const examId = request.params.id;
    const { statement, points, choices } = request.body;
    const question = await ExamService.addQuestionToExam(examId, statement, points, choices);
    response.status(201).json(question);
  } catch (error) {
    if (error instanceof ExamService.InvalidChoicesError) {
      response.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
