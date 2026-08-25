import * as QuestionRepository from '../repositories/QuestionRepository.js';
import * as ResultRepository from '../repositories/ResultRepository.js';
import type { SubmitExamDTO } from '../models/Result.js';

export async function correctExam(userId: number, examId: number, submission: SubmitExamDTO): Promise<number> {
  const questions = await QuestionRepository.findQuestionsWithAnswers(examId);

  const submittedByQuestion = new Map<number, number>();
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

  await ResultRepository.saveAttempt(userId, examId, score);

  return score;
}
