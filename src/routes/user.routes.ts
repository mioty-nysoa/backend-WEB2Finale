import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../security/authMiddleware";
import { roleMiddleware } from "../security/roleMiddleware";

const router = Router();
const controller = new UserController();

router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/", (req, res, next) => controller.list(req, res, next));
router.post("/", (req, res, next) => controller.create(req, res, next));
router.put("/:id", (req, res, next) => controller.update(req, res, next));
router.put("/:id/reset-password", (req, res, next) => controller.resetPassword(req, res, next));
router.put("/:id/reactivate", (req, res, next) => controller.reactivate(req, res, next));
router.delete("/:id", (req, res, next) => controller.deactivate(req, res, next));

export default router;