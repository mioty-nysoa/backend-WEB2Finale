import { pool } from '../config/db';
import type { Exam, CreateExamDTO } from '../models/Exam';

export async function createExam(dto: CreateExamDTO): Promise<Exam> {
  const result = await pool.query<Exam>(
    'INSERT INTO exams (course_id, title, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [dto.course_id, dto.title, dto.description, dto.start_date, dto.end_date]
  );

  const exam = result.rows[0];
  if (!exam) {
    throw new Error('Échec de la création de l\'examen');
  }
  return exam;
}

export async function findExamById(id: string): Promise<Exam | null> {
  const result = await pool.query<Exam>(
    'SELECT * FROM exams WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findAvailableExams(): Promise<Exam[]> {
  const result = await pool.query<Exam>(
    'SELECT * FROM exams WHERE NOW() BETWEEN start_date AND end_date'
  );
  return result.rows;
}
export async function getAllExams(): Promise<Exam[]> {
   const result = await pool.query('SELECT * FROM exams ORDER BY created_at DESC');
  return result.rows;
}
export async function findQuestionsByExamId(examId: string) {
  const query = `
    SELECT q.id, q.statement AS text, 
           json_agg(json_build_object('id', c.id, 'text', c.label, 'is_correct', c.is_correct)) AS choices
    FROM questions q
    LEFT JOIN choices c ON q.id = c.question_id
    WHERE q.exam_id = $1
    GROUP BY q.id;
  `;
  const result = await pool.query(query, [examId]);
  return result.rows;
}

export async function addQuestionToExam(
  examId: string, 
  questionText: string, 
  choices: Array<{ text: string; is_correct: boolean }>
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const questionRes = await client.query(
      'INSERT INTO questions (exam_id, statement) VALUES ($1, $2) RETURNING id, statement',
      [examId, questionText]
    );
    const question = questionRes.rows[0];

    const insertedChoices = [];
    for (const choice of choices) {
      const choiceRes = await client.query(
        'INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3) RETURNING id, label AS text, is_correct',
        [question.id, choice.text, choice.is_correct]
      );
      insertedChoices.push(choiceRes.rows[0]);
    }

    await client.query('COMMIT');
    return { ...question, choices: insertedChoices };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
export async function deleteQuestion(questionId: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Supprimer d'abord les choix liés
    await client.query('DELETE FROM choices WHERE question_id = $1', [questionId]);

    // 2. Supprimer la question
    const result = await client.query('DELETE FROM questions WHERE id = $1 RETURNING id', [questionId]);

    await client.query('COMMIT');
    return (result.rowCount??0) > 0;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}