import * as ExamRepository from '../repositories/ExamRepository.js';
import * as QuestionRepository from '../repositories/QuestionRepository.js';
import type { Exam, CreateExamDTO } from '../models/Exam.js';
import type { Question } from '../models/Question.js';
import type { Choice } from '../models/Choice.js';

export class InvalidExamDatesError extends Error {
  constructor() {
    super('La date de début doit être antérieure à la date de fin');
    this.name = 'InvalidExamDatesError';
  }
}

export class InvalidChoicesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChoicesError';
  }
}

export async function createExam(dto: CreateExamDTO): Promise<Exam> {
  if (new Date(dto.start_date) >= new Date(dto.end_date)) {
    throw new InvalidExamDatesError();
  }
  return ExamRepository.createExam(dto);
}

function validateChoices(choices: Omit<Choice, 'id' | 'question_id'>[]): void {
  if (choices.length < 2) {
    throw new InvalidChoicesError('Une question doit avoir au moins 2 choix');
  }

  const correctCount = choices.filter((choice) => choice.is_correct === true).length;

  if (correctCount !== 1) {
    throw new InvalidChoicesError(
      `Une question doit avoir exactement une réponse correcte (trouvé: ${correctCount})`
    );
  }
}

export async function addQuestionToExam(
  examId: string,
  statement: string,
  points: number,
  choices: Omit<Choice, 'id' | 'question_id'>[]
): Promise<Question> {
  validateChoices(choices);

  const question = await QuestionRepository.createQuestion(examId, statement, points);
  const createdChoices = await QuestionRepository.createChoices(question.id, choices);
  return { ...question, choices: createdChoices };
}
