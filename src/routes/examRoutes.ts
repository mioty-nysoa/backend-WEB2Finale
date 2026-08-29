import { Router } from "express";
import * as ExamController from "../controllers/ExamController";
import { submitExam } from "../controllers/ExamController";
const router = Router();

router.post("/", ExamController.create);
router.get("/",ExamController.getAll)
router.get("/:id/questions",ExamController.getQuestionsByExamId)
router.post("/:id/questions", ExamController.addQuestion);
router.delete("/:id/questions/:questionId", ExamController.deleteQuestion);
router.post("/my/exams/:id/submit", submitExam);

export default router;