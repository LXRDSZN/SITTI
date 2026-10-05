import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getReportController } from '../controllers/reports.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, requireRole('Administrador'), getReportController);

export default router;