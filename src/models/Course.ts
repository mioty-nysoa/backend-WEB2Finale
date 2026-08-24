export interface Course {
  id: number;
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