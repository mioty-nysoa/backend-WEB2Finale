import { Router } from 'express';
import * as ExamRepository from '../repositories/ExamRepository.js';
import * as QuestionRepository from '../repositories/QuestionRepository.js';
import * as CorrectionService from '../services/CorrectionService.js';
import * as ResultRepository from '../repositories/ResultRepository.js';

export const studentExamRouter = Router();

// Hypothèse : un middleware d'authentification place l'utilisateur connecté sur request.user.id
// (ex: middleware JWT en amont de ces routes). Adapte getUserId si ton middleware nomme la propriété autrement.
function getUserId(request: any): string {
  return request.user.id;
}

studentExamRouter.get('/my/exams/available', async (_request, response) => {
  try {
    const exams = await ExamRepository.findAvailableExams();
    response.status(200).json(exams);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

studentExamRouter.get('/my/exams/:id', async (request, response) => {
  try {
    const examId = request.params.id;
    const questions = await QuestionRepository.findQuestionsForStudent(examId);
    response.status(200).json(questions);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

studentExamRouter.post('/my/exams/:id/submit', async (request, response) => {
  try {
    const examId = request.params.id;
    const userId = getUserId(request);
    const score = await CorrectionService.correctExam(userId, examId, request.body);
    response.status(200).json({ score });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

studentExamRouter.get('/admin/results', async (_request, response) => {
  try {
    const results = await ResultRepository.findAllResults();
    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
