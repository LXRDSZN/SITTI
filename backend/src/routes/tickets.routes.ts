import { Router } from 'express';
import { listTickets, getMyTickets, getTicket, create, update, remove } from '../controllers/tickets.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', listTickets);

// Rutas protegidas
router.get('/my-tickets', authMiddleware, getMyTickets);
router.get('/:id', authMiddleware, getTicket);
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

export default router;
