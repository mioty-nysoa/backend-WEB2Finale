import { pool } from '../config/db.js';
import type { Attempt } from '../models/Result.js';

// Hypothèse : une table "attempts" avec les colonnes id, user_id, exam_id, score, submitted_at.
// Si le nom réel de la table/des colonnes diffère chez toi, dis-le moi et j'ajuste les requêtes.

export async function saveAttempt(userId: number, examId: number, score: number): Promise<Attempt> {
  const result = await pool.query<Attempt>(
    'INSERT INTO attempts (user_id, exam_id, score, submitted_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [userId, examId, score]
  );

  const attempt = result.rows[0];
  if (!attempt) {
    throw new Error('Échec de l\'enregistrement de la tentative');
  }
  return attempt;
}

export async function findAttemptsByUser(userId: number): Promise<Attempt[]> {
  const result = await pool.query<Attempt>(
    'SELECT * FROM attempts WHERE user_id = $1 ORDER BY submitted_at DESC',
    [userId]
  );
  return result.rows;
}

export async function findAllResults(): Promise<Attempt[]> {
  const result = await pool.query<Attempt>(
    'SELECT * FROM attempts ORDER BY submitted_at DESC'
  );
  return result.rows;
}
