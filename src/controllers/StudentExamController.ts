import { Request, Response } from "express";
import * as ExamRepository from "../repositories/ExamRepository";
import * as QuestionRepository from "../repositories/QuestionRepository";
import * as CorrectionService from "../services/CorrectionService";
import * as ResultRepository from "../repositories/ResultRepository";

const getUserId = (request: Request): string => {
 
  const user = (request as any).user;
  if (user && (user.userId || user.id)) {
    return user.userId || user.id;
  }

 const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
       const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      return payload.userId || payload.id || payload.sub;
    } catch (e) {
      console.error("Erreur de décodage du token :", e);
    }
  }

  return request.body.studentId || request.body.userId || "student-id-placeholder";
};

export async function listAvailable(_request: Request, response: Response) {
  try {
    const exams = await ExamRepository.findAvailableExams();
    response.status(200).json(exams);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function getOne(request: Request, response: Response) {
  try {
    const examId = request.params.id as string;
    const questions = await QuestionRepository.findQuestionsForStudent(examId);
    response.status(200).json(questions);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export const submit = async (request: Request, response: Response) => {
  try {
    const examId = request.params.id as string;
    const userId = getUserId(request);

    // Extraction hyper sécurisée pour toujours passer un tableau à CorrectionService
    let rawAnswers = [];
    if (Array.isArray(request.body)) {
      rawAnswers = request.body;
    } else if (request.body && Array.isArray(request.body.answers)) {
      rawAnswers = request.body.answers;
    }

    // Objet normalisé avec la propriété answers requise
    const submissionPayload = {
      answers: rawAnswers
    };

    // Selon ce que prend votre CorrectionService (3 arguments ou 1 objet payload)
    const result = await CorrectionService.correctExam(userId, examId, submissionPayload);
    
    return response.status(200).json(result);
  } catch (error: any) {
    console.error("Erreur lors de la soumission :", error);
    return response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export async function myResults(request: Request, response: Response) {
  try {
    const userId = getUserId(request);
    const results = await ResultRepository.findAttemptsByUser(userId);
    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function examResults(request: Request, response: Response) {
  try {
    const examId = request.params.id as string;
    const results = await ResultRepository.findResultsByExamId(examId);
    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}