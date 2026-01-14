import { CreateTaskInput, TaskStatus, UpdateTaskInput } from '@/types/task.types';
import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../types/errors';
import { Prisma, Task, UserStatus } from '@prisma/client';
import { IPaginatedParams, IPaginatedResponse } from '@/types/common';

/**
 * Task Service Layer
 * Handles all business logic and database operations for tasks
 */
export class TaskService {
  /**
   * Get all tasks with pagination and filters
   * @param userId - Current user ID
   * @param query - Query parameters for pagination and filtering
   * @returns Paginated list of tasks
   */
  async getTasksByProject(userId: string, query: IPaginatedParams & { projectId: string; status?: TaskStatus; assigneeId?: string }): Promise<IPaginatedResponse<Task>> {
    const { page, limit, sort, sortOrder, projectId, status, assigneeId } = query;
    const skip = (page - 1) * limit;

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [sort]: sortOrder,
    };

    // Build where clause with project owner verification
    const where: Prisma.TaskWhereInput = {
      projectId,
      project: {
        ownerId: userId,
      },
    };
    if (status) {
      where.status = status;
    }
    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    const [total, tasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    // If no tasks found, verify if project exists or user has no permission
    if (total === 0) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenError('You do not have permission to view tasks for this project');
      }
    }

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get task by ID
   * @param id - Task ID
   * @param userId - Current user ID (for authorization)
   * @returns Task data with project and assignee
   */
  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            ownerId: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check if user has access (is assignee or project owner)
    if (task.assigneeId !== userId && task.project.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to view this task');
    }

    return task;
  }

  /**
   * Create new task
   * @param userId - Current user ID (must be project owner)
   * @param data - Task data
   * @returns Created task
   */
  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    // Verify that the user owns the project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { owner: true }
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenError('Only project owner can create tasks');
    }
    
    if (project.owner.status !== UserStatus.active || project.owner.deletedAt !== null) {
      throw new ForbiddenError('Project owner is not active or has been deleted');
    }
    
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        projectId: data.projectId,
      },
     
    });

    return task;
  }

  /**
   * Update task
   * @param id - Task ID
   * @param data - Updated task data
   * @param userId - Current user ID (for authorization)
   * @returns Updated task
   */
  async updateTask(id: string, data: UpdateTaskInput, userId: string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check if user is project owner or assignee
    if (task.project.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    // If changing assignee, verify the new assignee exists
    if (data.assigneeId && data.assigneeId !== task.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId, deletedAt: null, status: UserStatus.active },
      });

      if (!assignee) {
        throw new NotFoundError('Assignee not found');
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        assigneeId: data.assigneeId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return updatedTask;
  }

  /**
   * Delete task
   * @param id - Task ID
   * @param userId - Current user ID (for authorization)
   */
  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Only project owner can delete tasks
    if (task.project.ownerId !== userId) {
      throw new ForbiddenError('Only project owner can delete tasks');
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}

// Export singleton instance
export const taskService = new TaskService();
