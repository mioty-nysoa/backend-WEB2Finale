import { Request, Response } from "express";
import * as ExamRepository from "../repositories/ExamRepository";
import * as QuestionRepository from "../repositories/QuestionRepository";
import * as CorrectionService from "../services/CorrectionService";
import * as ResultRepository from "../repositories/ResultRepository";

function getUserId(request: Request): string {
  return (request as any).user.userId;
}

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

export async function submit(request: Request, response: Response) {
  try {
    const examId = request.params.id as string;
    const userId = getUserId(request);
    const score = await CorrectionService.correctExam(userId, examId, request.body);
    response.status(200).json({ score });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

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