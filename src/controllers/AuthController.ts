import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { ApiError } from "../security/ApiError";

const userService = new UserService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    try {
      const result = await userService.login(email, password);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}