import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await userService.listStudents();
      return res.status(200).json(students);
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, initialPassword } = req.body;
    try {
      const student = await userService.createStudent(name, email, initialPassword);
      return res.status(201).json(student);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const { name, email } = req.body;
    try {
      const student = await userService.updateStudent(id, name, email);
      return res.status(200).json(student);
    } catch (err) {
      return next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    
    try {
      const id= req.params.id as string;
      const newPassword  = req.body?.newPassword || req.body.password;

      await userService.resetPassword(id, newPassword);
      return res.status(200).json({ message: "Mot de passe réinitialisé avec succè" });
    } catch (err) {
      return next(err);
    }
  }

  async desactivate(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    try {
      const student = await userService.desactivateStudent(id);
      return res.status(200).json(student);
    } catch (err) {
      return next(err);
    }
  }

  async reactivate(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    try {
      const student = await userService.reactivateStudent(id);
      return res.status(200).json(student);
    } catch (err) {
      return next(err);
    }
  }
}