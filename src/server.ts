import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import examRoutes from "./routes/examRoutes";
import { myRouter, examResultsRouter } from "./routes/studentExamRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "https://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exams", examResultsRouter);
app.use("/api/my", myRouter);

const swaggerDocument = parse(
  fs.readFileSync(path.join(__dirname, "../swagger.yaml"), "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});