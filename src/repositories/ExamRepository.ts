import { pool } from '../config/db.js';
import type { Exam, CreateExamDTO } from '../models/Exam.js';

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