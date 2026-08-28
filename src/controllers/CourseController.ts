import { Request, Response } from "express";
import * as CourseService from "../services/CourseService";

export async function create(request: Request, response: Response) {
  try {
    const { code, name, description } = request.body;
    const course = await CourseService.createCourse({ code, name, description });
    response.status(201).json(course);
  } catch (error) {
    if (error instanceof CourseService.CourseCodeAlreadyExistsError) {
      response.status(409).json({ message: error.message });
      return;
    }
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function list(_request: Request, response: Response) {
  try {
    const courses = await CourseService.listCourses();
    response.status(200).json(courses);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
}