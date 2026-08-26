export interface Attempt {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  submitted_at: Date;
}

export interface StudentAnswerDTO {
  question_id: string;
  choice_id: string | null;
}

export interface SubmitExamDTO {
  answers: StudentAnswerDTO[];
}