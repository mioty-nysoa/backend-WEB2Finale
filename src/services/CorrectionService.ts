import * as QuestionRepository from '../repositories/QuestionRepository';
import * as ResultRepository from '../repositories/ResultRepository';
import type { SubmitExamDTO } from '../models/Result';

export async function correctExam(studentId: string, examId: string, submission: SubmitExamDTO): Promise<number> {
  const questions = await QuestionRepository.findQuestionsWithAnswers(examId);
  const submittedByQuestion = new Map<string, string>();
  
  const answersList = submission?.answers || [];
  for (const answer of answersList) {
    const qId = (answer as any).question_id || (answer as any).questionId;
    const cId = (answer as any).choice_id || (answer as any).choiceId;

    if (qId !== undefined && qId !== null && cId !== undefined && cId !== null) {
      submittedByQuestion.set(String(qId).trim(), String(cId).trim());
    }
  }

  let score = 0;

  for (const question of questions) {
    const choices = (question as any).choices || (question as any).options || [];
    
    const correctChoice = choices.find(
      (choice: any) => choice.is_correct === true || choice.isCorrect === true || choice.is_correct === 1
    );
    
    if (!correctChoice) {
      continue;
    }

    const qIdStr = String((question as any).id || (question as any).question_id).trim();
    const submittedChoiceId = submittedByQuestion.get(qIdStr);
    const correctChoiceId = String(correctChoice.id || correctChoice.choice_id).trim();

    if (submittedChoiceId && submittedChoiceId === correctChoiceId) {
      score += Number((question as any).points || 1);
    }
  }

  await ResultRepository.saveAttempt(studentId, examId, score);

  return score;
}