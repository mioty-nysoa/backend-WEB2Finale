import { Request, Response } from "express";
import * as ExamService from "../services/ExamService";
import { InvalidExamDatesError } from "../services/ExamService";

export const create = async (request: Request, response: Response) => {
  try {
    const exam = await ExamService.createExam(request.body);
    return response.status(201).json(exam);
  } catch (error: any) {
    if (error instanceof InvalidExamDatesError || error.name === "InvalidExamDatesError") {
      return response.status(400).json({ message: error.message });
    }
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (request: Request, response: Response) => {
  try {
    const exams = await ExamService.getAllExams();
    return response.status(200).json(exams);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des examens :", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const addQuestion = async (request: Request, response: Response) => {
  console.log("Payload reçu pour la question :", request.body);
  try {
    const examId = request.params.id as string;
    const question = await ExamService.addQuestionToExam(examId, request.body);
    return response.status(201).json(question);
  } catch (error: any) {
    if (error instanceof ExamService.InvalidChoicesError) {
      return response.status(400).json({ message: error.message });
    }
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionsByExamId = async (request: Request, response: Response) => {
  try {
    const id = request.params.id as string;
    const questions = await ExamService.getQuestionsByExamId(id);
    return response.status(200).json(questions);
  } catch (error: any) {
    console.error("Erreur récupération questions :", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuestion = async (request: Request, response: Response) => {
  try {
    const questionId = request.params.questionId as string;
    await ExamService.deleteQuestion(questionId);
    return response.status(200).json({ message: "Question supprimée avec succès" });
  } catch (error: any) {
    console.error("Erreur suppression question :", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export const submitExam = async (request: Request, response: Response) => {
  try {
    const examId = request.params.id as string;
    const studentId = (request as any).user?.id || request.body.studentId || "student-id-placeholder";
    const answers = Array.isArray(request.body) ? request.body : request.body.answers;

    if (!answers || !Array.isArray(answers)) {
      return response.status(400).json({ message: "Le format des réponses est invalide." });
    }

    const result = await ExamService.submitExam(studentId, examId, answers);
    return response.status(200).json(result);
  } catch (error: any) {
    console.error("Erreur lors de la soumission de l'examen :", error);
    return response.status(500).json({ message: error.message || "Internal server error" });
  }
};