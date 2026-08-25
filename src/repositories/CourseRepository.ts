import { pool } from '../config/db.js';
import type { Course, CreateCourseDTO } from '../models/Course.js';


export async function createCourse(dto: CreateCourseDTO): Promise<Course> {
  const result = await pool.query<Course>(
    'INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *',
    [dto.code, dto.name, dto.description]
  );

  const course = result.rows[0];
  if (!course) {
    throw new Error('Échec de la création du cours');
  }
  return course;
}


export async function findCourseByCode(code: string): Promise<Course | null> {
  const result = await pool.query<Course>(
    'SELECT * FROM courses WHERE code = $1',
    [code]
  );
  return result.rows[0] ?? null;
}

export async function findAllCourses(): Promise<Course[]> {
  const result = await pool.query<Course>(
    'SELECT * FROM courses ORDER BY created_at DESC'
  );
  return result.rows;
}