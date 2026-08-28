import { Router } from "express";
import * as CourseController from "../controllers/CourseController";

const router = Router();

router.get("/", CourseController.list);
router.post("/", CourseController.create);

export default router;