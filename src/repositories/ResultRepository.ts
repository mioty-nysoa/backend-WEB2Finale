import { pool } from "../config/db";
import type { Attempt } from "../models/Result";


export async function saveAttempt(studentId: string, examId: string, score: number): Promise<Attempt> {
  const result = await pool.query<Attempt>(
    'INSERT INTO attempts (student_id, exam_id, score, submitted_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [studentId, examId, score]
  );

  const attempt = result.rows[0];
  if (!attempt) {
    throw new Error('Échec de l\'enregistrement de la tentative');
  }
  return attempt;
}

export async function findAttemptsByUser(studentId: string): Promise<Attempt[]> {
  const result = await pool.query<Attempt>(
    'SELECT * FROM attempts WHERE student_id = $1 ORDER BY submitted_at DESC',
    [studentId]
  );
  return result.rows;
}

export async function findAllResults(): Promise<Attempt[]> {
  const result = await pool.query<Attempt>(
    'SELECT * FROM attempts ORDER BY submitted_at DESC'
  );
  return result.rows;
}

export async function findResultsByExamId(examId: string): Promise<Attempt[]> {
  const result = await pool.query<Attempt>(
    "SELECT * FROM attempts WHERE exam_id = $1 ORDER BY score DESC, submitted_at ASC",
    [examId]
  );
  return result.rows;
}