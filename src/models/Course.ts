export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  created_at?: Date;
}

export interface CreateCourseDTO {
  code: string;
  name: string;
  description: string;
}