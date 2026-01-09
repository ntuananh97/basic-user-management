import { Router } from 'express';
import userRoutes from './user.routes';

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

// User routes
router.use('/users', userRoutes);

export default router;
