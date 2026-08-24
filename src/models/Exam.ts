export interface Exam {
  id: number;
  course_id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
}

export interface CreateExamDTO {
  course_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}