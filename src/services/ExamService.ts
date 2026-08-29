import * as ExamRepository from '../repositories/ExamRepository';
import * as QuestionRepository from '../repositories/QuestionRepository';
import type { Exam, CreateExamDTO } from '../models/Exam';
import type { Question } from '../models/Question';
import type { Choice } from '../models/Choice';

export class InvalidExamDatesError extends Error {
  constructor(message: string = "La date de fin doit être après la date de début.") {
    super(message);
    this.name = 'InvalidExamDatesError';
  }
}

export class InvalidChoicesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChoicesError';
  }
}

export const createExam = async (dto: any): Promise<Exam> => {
  const courseId = dto.course_id || dto.courseId;
  
  if (!courseId) {
    throw new InvalidExamDatesError("Le cours sélectionné est obligatoire.");
  }

  const startStr = dto.start_date || dto.startDate;
  const endStr = dto.end_date || dto.endDate;

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new InvalidExamDatesError("Les dates d'examen saisies sont invalides.");
  }

  if (startDate >= endDate) {
    throw new InvalidExamDatesError("La date de fin doit être strictly après la date de début.");
  }

  const cleanDto: CreateExamDTO = {
    course_id: courseId,
    title: dto.title,
    description: dto.description,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  };

  return ExamRepository.createExam(cleanDto);
};

const validateChoices = (choices: Omit<Choice, 'id' | 'question_id'>[]): void => {
  if (choices.length < 2) {
    throw new InvalidChoicesError('Une question doit avoir au moins 2 choix');
  }

  const correctCount = choices.filter((choice: any) => {
    const isCorrectValue = choice.is_correct ?? choice.isCorrect;
    return isCorrectValue === true || isCorrectValue === "true" || isCorrectValue === 1;
  }).length;

  if (correctCount !== 1) {
    throw new InvalidChoicesError(
      `Une question doit avoir exactement une réponse correcte (trouvé: ${correctCount})`
    );
  }
};

export const addQuestionToExam = async (examId: string, dto: any) => {
  // Normalisation du tableau de choix
  const formattedChoices = (dto.choices || []).map((c: any) => ({
    text: c.text,
    is_correct: Boolean(c.is_correct ?? c.isCorrect),
  }));

  // Validation
  validateChoices(formattedChoices);

  // Appel au repository...
  return ExamRepository.addQuestionToExam(examId, dto.text, formattedChoices);
};

export const getAllExams = async (): Promise<Exam[]> => {
  return ExamRepository.getAllExams();
};

export const getQuestionsByExamId = async (examId: string) => {
  if (!examId) {
    throw new Error("L'identifiant de l'examen est obligatoire.");
  }
  return ExamRepository.findQuestionsByExamId(examId);
};

export const deleteQuestion = async (questionId: string) => {
  if (!questionId) {
    throw new Error("L'identifiant de la question est requis.");
  }
  return ExamRepository.deleteQuestion(questionId);
};

export const submitExam = async (studentId: string, examId: string, answers: any[]) => {
  if (!examId) {
    throw new Error("L'identifiant de l'examen est requis pour la soumission.");
  }

  const questions = await ExamRepository.findQuestionsByExamId(examId);

  if (!questions || questions.length === 0) {
    throw new Error("Cet examen ne contient aucune question à corriger.");
  }

  let correctCount = 0;
  const totalQuestions = questions.length;

  questions.forEach((q: any) => {
    const studentAnswer = answers.find(
      (a: any) => (a.question_id || a.questionId) === q.id
    );

    if (studentAnswer) {
      const selectedChoiceId = studentAnswer.choice_id || studentAnswer.choiceId;
      const choices = q.choices || [];
      const isCorrect = choices.some(
        (c: any) => c.id === selectedChoiceId && (c.is_correct || c.isCorrect)
      );

      if (isCorrect) {
        correctCount++;
      }
    }
  });

  const score = Math.round((correctCount / totalQuestions) * 20 * 100) / 100;

  return {
    examId,
    studentId,
    score,
    correctCount,
    totalQuestions,
    status: "COMPLETED",
    submittedAt: new Date().toISOString()
  };
};