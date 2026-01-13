import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation';
import { createUserSchema, updateUserProfileSchema, updateUserSchema, userIdSchema, changePasswordSchema } from '../types/user.types';
import { checkAuthentication } from '../middlewares/checkAuth';

const router = Router();

/**
 * User Routes
 * All routes are prefixed with /api/users
 */

// GET /api/users - Get all users
router.get('/', checkAuthentication, userController.getAllUsers);

// GET /api/users/me - Get current user
router.get('/me', checkAuthentication, userController.getCurrentUser);

// PUT /api/users/me - Update current user profile
router.put('/me', checkAuthentication, validate(updateUserProfileSchema), userController.updateProfile);

// PUT /api/users/me/password - Change current user password
router.put('/me/change-password', checkAuthentication, validate(changePasswordSchema), userController.changePassword);

// GET /api/users/:id - Get user by ID
router.get('/:id', checkAuthentication, validate(userIdSchema), userController.getUserById);

// POST /api/users - Create new user
router.post('/', checkAuthentication, validate(createUserSchema), userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', checkAuthentication, validate(updateUserSchema), userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', checkAuthentication, validate(userIdSchema), userController.deleteUser);

export default router;
