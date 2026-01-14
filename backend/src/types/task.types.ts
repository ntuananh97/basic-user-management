import { z } from 'zod';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().trim().min(2, 'Title must be at least 2 characters'),
        description: z.string().trim().optional(),
        status: z.string().trim().min(1, 'Status is required'),
        projectId: z.string().uuid('Invalid project ID'),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().trim().min(2, 'Title must be at least 2 characters').optional(),
        description: z.string().trim().optional(),
        status: z.string().trim().min(1, 'Status is required').optional(),
        assigneeId: z.string().uuid('Invalid assignee ID').optional(),
    }),
});

export const taskIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];

export enum TaskStatus {
    TODO = 'todo',
    DOING = 'doing',
    DONE = 'done',
}
