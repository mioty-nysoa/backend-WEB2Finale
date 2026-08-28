import { Router } from "express";
import * as ExamController from "../controllers/ExamController";

const router = Router();

router.post("/", ExamController.create);
router.post("/:id/questions", ExamController.addQuestion);

export default router;