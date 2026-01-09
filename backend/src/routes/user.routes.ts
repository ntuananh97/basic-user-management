import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validation';
import { createUserSchema, updateUserSchema, userIdSchema } from '../types/user.types';

const router = Router();

/**
 * User Routes
 * All routes are prefixed with /api/users
 */

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validate(userIdSchema), userController.getUserById);

// POST /api/users - Create new user
router.post('/', validate(createUserSchema), userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validate(updateUserSchema), userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validate(userIdSchema), userController.deleteUser);

export default router;
