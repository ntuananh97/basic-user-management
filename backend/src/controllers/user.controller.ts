import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../middlewares/errorHandler';
import { ExtendedRequest } from '@/types/express';

/**
 * User Controller Layer
 * Handles HTTP requests and responses for user operations
 */
export class UserController {
  /**
   * GET /api/users
   * Get all users
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  });

  /**
   * GET /api/users/:id
   * Get a single user by ID
   */
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  });

  /**
   * GET /api/users/me
   * Get current user
   */
  getCurrentUser = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const user = await userService.getCurrentUser(req.user!.id);
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  });

  /**
   * PUT /api/users/me
   * Update current user profile
   */
  updateProfile = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const user = await userService.updateProfile(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  });

  /**
   * PUT /api/users/me/password
   * Change current user password
   */
  changePassword = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    await userService.changePassword(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  });

  /**
   * POST /api/users
   * Create a new user
   */
  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  });

  /**
   * PUT /api/users/:id
   * Update an existing user
   */
  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  });

  /**
   * DELETE /api/users/:id
   * Delete a user
   */
  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });
}

// Export singleton instance
export const userController = new UserController();
