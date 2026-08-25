import { pool } from '../config/db.js';
import type { Question } from '../models/Question.js';
import type { Choice } from '../models/Choice.js';

export async function createQuestion(examId: number, statement: string, points: number): Promise<Question> {
  const result = await pool.query<Question>(
    'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
    [examId, statement, points]
  );

  const question = result.rows[0];
  if (!question) {
    throw new Error('Échec de la création de la question');
  }
  return question;
}

export async function createChoices(
  questionId: number,
  choices: Omit<Choice, 'id' | 'question_id'>[]
): Promise<Choice[]> {
  const created: Choice[] = [];

  for (const choice of choices) {
    const result = await pool.query<Choice>(
      'INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING *',
      [questionId, choice.text, choice.is_correct ?? false]
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('Échec de la création d\'un choix');
    }
    created.push(row);
  }

  return created;
}


export async function findQuestionsForStudent(examId: number): Promise<Question[]> {
  const questionsResult = await pool.query<Question>(
    'SELECT id, exam_id, statement, points FROM questions WHERE exam_id = $1',
    [examId]
  );

  const choicesResult = await pool.query<Pick<Choice, 'id' | 'question_id' | 'text'>>(
    `SELECT c.id, c.question_id, c.text
     FROM choices c
     JOIN questions q ON q.id = c.question_id
     WHERE q.exam_id = $1`,
    [examId]
  );

  return questionsResult.rows.map((question) => ({
    ...question,
    choices: choicesResult.rows.filter((choice) => choice.question_id === question.id),
  }));
}


export async function findQuestionsWithAnswers(examId: number): Promise<Question[]> {
  const questionsResult = await pool.query<Question>(
    'SELECT id, exam_id, statement, points FROM questions WHERE exam_id = $1',
    [examId]
  );

  const choicesResult = await pool.query<Choice>(
    `SELECT c.*
     FROM choices c
     JOIN questions q ON q.id = c.question_id
     WHERE q.exam_id = $1`,
    [examId]
  );

  return questionsResult.rows.map((question) => ({
    ...question,
    choices: choicesResult.rows.filter((choice) => choice.question_id === question.id),
  }));
}