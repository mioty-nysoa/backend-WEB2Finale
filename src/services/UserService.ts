import { UserRepository } from "../repositories/UserRepository";
import { hashPassword, comparePassword } from "../security/password";
import { signToken } from "../security/jwt";
import { ApiError } from "../security/ApiError";
import { SafeUser, User } from "../models/User";

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
}

export class UserService {
  private userRepository = new UserRepository();

  async login(email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    console.log("--> EMAIL REÇU :", email);
    console.log("--> PASSWORD REÇU :", password);
    const user = await this.userRepository.findByEmail(email);
    console.log("--> USER BDD :", user);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.is_active) {
      throw new ApiError(401, "This account has been deactivated");
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user: toSafeUser(user) };
  }

   async listStudents(): Promise<SafeUser[]> {
    const students = await this.userRepository.findAllStudents();
    return students.map(toSafeUser);
  }

  async createStudent(name: string, email: string, initialPassword: string): Promise<SafeUser> {
    if (!name || !email || !initialPassword) {
      throw new ApiError(400, "Name, email and password are required");
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const passwordHash = await hashPassword(initialPassword);
    const student = await this.userRepository.create(name, email, passwordHash, "STUDENT");
    return toSafeUser(student);
  }

  async updateStudent(id: string, name: string, email: string): Promise<SafeUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing || existing.role !== "STUDENT") {
      throw new ApiError(404, "Student not found");
    }

    const updatedName = name || existing.name;
  const updatedEmail = email || existing.email;

    const updated = await this.userRepository.updateProfile(id, updatedName, updatedEmail);
    if (!updated) {
      throw new ApiError(404, "Student not found");
    }
    return toSafeUser(updated);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing || existing.role !== "STUDENT") {
      throw new ApiError(404, "Student not found");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const passwordHash = await hashPassword(newPassword);
    await this.userRepository.updatePassword(id, passwordHash);
  }

  async desactivateStudent(id: string): Promise<SafeUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing || existing.role !== "STUDENT") {
      throw new ApiError(404, "Student not found");
    }

    const updated = await this.userRepository.setActiveStatus(id, false);
    return toSafeUser(updated!);
  }

  async reactivateStudent(id: string): Promise<SafeUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing || existing.role !== "STUDENT") {
      throw new ApiError(404, "Student not found");
    }

    const updated = await this.userRepository.setActiveStatus(id, true);
    return toSafeUser(updated!);
  }
}