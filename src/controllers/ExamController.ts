import { Request, Response } from "express";
import * as ExamService from "../services/ExamService";

export async function create(request: Request, response: Response) {
  try {
    const { course_id, title, description, start_date, end_date } = request.body;
    const exam = await ExamService.createExam({ course_id, title, description, start_date, end_date });
    response.status(201).json(exam);
  } catch (error) {
    if (error instanceof ExamService.InvalidExamDatesError) {
      response.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function addQuestion(request: Request, response: Response) {
  try {
    const examId = request.params.id as string;
    const { statement, points, choices } = request.body;
    const question = await ExamService.addQuestionToExam(examId, statement, points, choices);
    response.status(201).json(question);
  } catch (error) {
    if (error instanceof ExamService.InvalidChoicesError) {
      response.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}