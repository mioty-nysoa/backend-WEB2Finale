import { pool } from "../config/db";
import { User, UserRole } from "../models/User";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findAllStudents(): Promise<User[]> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async create(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole
  ): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, passwordHash, role]
    );
    return result.rows[0];
  }

  async updateProfile(id: string, name: string, email: string): Promise<User | null> {
    const result = await pool.query<User>(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    return result.rows[0] ?? null;
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2",
      [passwordHash, id]
    );
  }

  async setActiveStatus(id: string, isActive: boolean): Promise<User | null> {
    const result = await pool.query<User>(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *",
      [isActive, id]
    );
    return result.rows[0] ?? null;
  }
}