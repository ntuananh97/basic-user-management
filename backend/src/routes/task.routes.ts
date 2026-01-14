import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { checkAuthentication } from '../middlewares/checkAuth';
import { validateTaskQuery } from '../middlewares/validateQuery';
import { validate } from '@/middlewares/validation';
import { createTaskSchema, updateTaskSchema,  } from '@/types/task.types';

const router = Router();

/**
 * Task Routes
 * All routes are prefixed with /api/tasks
 */

// GET /api/tasks - Get all tasks (authenticated users, with optional filters)
router.get('/by-project/:projectId', checkAuthentication, validateTaskQuery, taskController.getTasksByProject);

// // GET /api/tasks/:id - Get task by ID (authenticated users)
// router.get('/:id', checkAuthentication, validate(taskIdSchema), taskController.getTaskById);

// POST /api/tasks - Create new task (project owner only)
router.post('/', checkAuthentication, validate(createTaskSchema), taskController.createTask);

// PUT /api/tasks/:id - Update task (project owner or assignee)
router.put('/:id', checkAuthentication, validate(updateTaskSchema), taskController.updateTask);

// // DELETE /api/tasks/:id - Delete task (project owner only)
// router.delete('/:id', checkAuthentication, validate(taskIdSchema), taskController.deleteTask);

export default router;
