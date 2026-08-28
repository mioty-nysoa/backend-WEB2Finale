import * as QuestionRepository from '../repositories/QuestionRepository';
import * as ResultRepository from '../repositories/ResultRepository';
import type { SubmitExamDTO } from '../models/Result';

export async function correctExam(studentId: string, examId: string, submission: SubmitExamDTO): Promise<number> {
  const questions = await QuestionRepository.findQuestionsWithAnswers(examId);

  const submittedByQuestion = new Map<string, string>();
  for (const answer of submission.answers) {
    if (answer.choice_id !== null) {
      submittedByQuestion.set(answer.question_id, answer.choice_id);
    }
  }

  let score = 0;

  for (const question of questions) {
    const correctChoice = (question.choices ?? []).find((choice) => choice.is_correct);
    if (!correctChoice) {
      // Question mal configurée (aucun choix marqué correct) : on ne peut pas la noter, on l'ignore
      continue;
    }

    const submittedChoiceId = submittedByQuestion.get(question.id);
    if (submittedChoiceId !== undefined && submittedChoiceId === correctChoice.id) {
      score += question.points;
    }
  }

  await ResultRepository.saveAttempt(studentId, examId, score);

  return score;
}
