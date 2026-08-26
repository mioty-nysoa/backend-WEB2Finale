import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { courseRouter } from "./controllers/CourseController";
import { examRouter } from "./controllers/ExamController";
import { studentExamRouter } from "./controllers/StudentExamController";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", userRoutes);
app.use("/api", courseRouter);
app.use("/api", examRouter);
app.use("/api", studentExamRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const swaggerDocument = parse(
  fs.readFileSync(path.join(__dirname, "../swagger.yaml"), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));