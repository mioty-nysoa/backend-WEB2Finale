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

export const findAttemptsByUser = async (studentId: string): Promise<any[]> => {
  const query = `
    SELECT 
      a.id,
      a.student_id,
      a.exam_id,
      a.score,
      a.submitted_at,
      a.submitted_at AS "submittedAt",
      e.title AS exam_title,
      e.title AS "examTitle",
      COALESCE(
        (SELECT CAST(COUNT(*) AS integer) FROM questions q WHERE q.exam_id = a.exam_id),
        20
      ) AS "totalQuestions"
      FROM attempts a
    LEFT JOIN exams e ON a.exam_id = e.id
    WHERE a.student_id = $1
    ORDER BY a.submitted_at DESC
  `;

  const result = await pool.query(query, [studentId]);
  return result.rows;
};

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