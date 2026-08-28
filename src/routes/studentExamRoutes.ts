import { Router } from "express";
import * as StudentExamController from "../controllers/StudentExamController";

const myRouter = Router();
myRouter.get("/exams", StudentExamController.listAvailable);
myRouter.get("/exams/:id", StudentExamController.getOne);
myRouter.post("/exams/:id/submit", StudentExamController.submit);
myRouter.get("/results", StudentExamController.myResults);

const examResultsRouter = Router();
examResultsRouter.get("/:id/results", StudentExamController.examResults);

export { myRouter, examResultsRouter };