import * as CourseRepository from '../repositories/CourseRepository.js';
import type { Course, CreateCourseDTO } from '../models/Course.js';

export class CourseCodeAlreadyExistsError extends Error {
  constructor(code: string) {
    super(`Un cours avec le code "${code}" existe déjà`);
    this.name = 'CourseCodeAlreadyExistsError';
  }
}

export async function createCourse(dto: CreateCourseDTO): Promise<Course> {
  const existing = await CourseRepository.findCourseByCode(dto.code);
  if (existing) {
    throw new CourseCodeAlreadyExistsError(dto.code);
  }
  return CourseRepository.createCourse(dto);
}

export async function listCourses(): Promise<Course[]> {
  return CourseRepository.findAllCourses();
}