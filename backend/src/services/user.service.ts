import { prisma } from '../config/database';
import { CreateUserInput, UpdateUserInput } from '../types/user.types';
import { NotFoundError, ConflictError } from '../types/errors';
import { User } from '@prisma/client';

/**
 * User Service Layer
 * Handles all business logic and database operations for users
 */
export class UserService {
  /**
   * Get all users from database
   */
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  /**
   * Get a single user by ID
   * @throws {NotFoundError} If user doesn't exist
   */
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Create a new user
   * @throws {ConflictError} If email already exists
   */
  async createUser(data: CreateUserInput): Promise<User> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError(`User with email ${data.email} already exists`);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });

    return user;
  }

  /**
   * Update an existing user
   * @throws {NotFoundError} If user doesn't exist
   * @throws {ConflictError} If email already taken by another user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    // Check if user exists
    await this.getUserById(id);

    // If updating email, check if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(`Email ${data.email} is already taken`);
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return user;
  }

  /**
   * Delete a user by ID
   * @throws {NotFoundError} If user doesn't exist
   */
  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    await this.getUserById(id);

    // Delete user
    await prisma.user.delete({
      where: { id },
    });
  }
}

// Export singleton instance
export const userService = new UserService();
