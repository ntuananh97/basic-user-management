import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().trim().min(2, 'Title must be at least 2 characters'),
        description: z.string().trim().optional(),
    }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];

