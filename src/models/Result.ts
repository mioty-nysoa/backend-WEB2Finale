export interface Attempt {
  id: number;
  user_id: number;
  exam_id: number;
  score: number;
  submitted_at: Date;
}

export interface StudentAnswerDTO {
  question_id: number;
  choice_id: number | null; // null si non répondu (RG-05)
}

export interface SubmitExamDTO {
  answers: StudentAnswerDTO[];
}