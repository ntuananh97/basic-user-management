import { Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { taskService } from '@/services/task.service';
import { ExtendedRequest } from '@/types/express';
import { RequestWithValidatedQuery } from '@/middlewares/validateQuery';
import { TaskStatus } from '@/types/task.types';

/**
 * Task Controller Layer
 * Handles HTTP requests and responses for task operations
 */
export class TaskController {
  /**
   * GET /api/tasks
   * Get all tasks with pagination and filters
   */
  getTasksByProject = asyncHandler(async (req: RequestWithValidatedQuery, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const result = await taskService.getTasksByProject(userId, {
      ...req.validatedQuery,
      projectId: req.params.projectId,
      status: req.validatedQuery.status as TaskStatus,
      assigneeId: req.validatedQuery.assigneeId as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: result,
    });
  });

  /**
   * GET /api/tasks/:id
   * Get task by ID
   */
  getTaskById = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id;
    const task = await taskService.getTaskById(id, userId);

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  });

  /**
   * POST /api/tasks
   * Create new task
   */
  createTask = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const task = await taskService.createTask(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  });

  /**
   * PUT /api/tasks/:id
   * Update task
   */
  updateTask = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id;
    const task = await taskService.updateTask(id, req.body, userId);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  });

  /**
   * DELETE /api/tasks/:id
   * Delete task
   */
  deleteTask = asyncHandler(async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id;
    await taskService.deleteTask(id, userId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  });
}

// Export singleton instance
export const taskController = new TaskController();
