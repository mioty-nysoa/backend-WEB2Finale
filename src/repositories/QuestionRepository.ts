import { pool } from '../config/db';
import type { Question } from '../models/Question';
import type { Choice } from '../models/Choice';

export const createQuestion = async (
  examId: string, 
  statement: string, 
  points: number
): Promise<Question> => {
  const result = await pool.query<Question>(
    'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
    [examId, statement, points]
  );

  const question = result.rows[0];
  if (!question) {
    throw new Error('Échec de la création de la question');
  }
  return question;
};

export const createChoices = async (
  questionId: string,
  choices: Omit<Choice, 'id' | 'question_id'>[]
): Promise<Choice[]> => {
  const created: Choice[] = [];

  for (const choice of choices) {
    const result = await pool.query<Choice>(
      'INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3) RETURNING *',
      [questionId, choice.label, choice.is_correct ?? false]
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error("Échec de la création d'un choix");
    }
    created.push(row);
  }

  return created;
};

export const findQuestionsForStudent = async (examId: string): Promise<Question[]> => {
  const questionsResult = await pool.query<Question>(
    'SELECT id, exam_id, statement, points FROM questions WHERE exam_id = $1',
    [examId]
  );

  const choicesResult = await pool.query<Pick<Choice, 'id' | 'question_id' | 'label'>>(
    `SELECT c.id, c.question_id, c.label
     FROM choices c
     JOIN questions q ON q.id = c.question_id
     WHERE q.exam_id = $1`,
    [examId]
  );

  return questionsResult.rows.map((question) => ({
    ...question,
    choices: choicesResult.rows.filter(
      (choice) => String(choice.question_id) === String(question.id)
    ),
  }));
};

export const findQuestionsWithAnswers = async (examId: string): Promise<any[]> => {
  const questionsResult = await pool.query<Question>(
    'SELECT id, exam_id, statement, points FROM questions WHERE exam_id = $1',
    [examId]
  );

  const choicesResult = await pool.query<Choice>(
    `SELECT c.id, c.question_id, c.label, c.is_correct
     FROM choices c
     JOIN questions q ON q.id = c.question_id
     WHERE q.exam_id = $1`,
    [examId]
  );

  return questionsResult.rows.map((question) => ({
    ...question,
    // Conversion String() pour s'assurer que les choix soient bien rattachés
    choices: choicesResult.rows
      .filter((choice) => String(choice.question_id) === String(question.id))
      .map((choice) => ({
        ...choice,
        // Double mapping pour être 100% compatible avec CorrectionService
        is_correct: choice.is_correct,
        isCorrect: choice.is_correct
      })),
  }));
};