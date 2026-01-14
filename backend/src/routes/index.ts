import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';

const router = Router();

/**
 * Main API Routes
 * All routes are prefixed with /api
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Project routes
router.use('/projects', projectRoutes);

export default router;
