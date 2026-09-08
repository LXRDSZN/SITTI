import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';

const router = Router();

// Crear comentario
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id_ticket, comentario } = req.body;

    if (!id_ticket || !comentario) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const nuevoComentario = await prisma.comentario.create({
      data: {
        id_ticket,
        id_usuario: req.usuario.id_usuario,
        comentario,
      },
      include: {
        usuario: { select: { nombre: true, correo: true } },
      },
    });

    res.status(201).json({ comentario: nuevoComentario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener comentarios de un ticket
router.get('/ticket/:id_ticket', async (req: Request, res: Response) => {
  try {
    const { id_ticket } = req.params;

    const comentarios = await prisma.comentario.findMany({
      where: { id_ticket: parseInt(id_ticket) },
      include: {
        usuario: { select: { nombre: true, correo: true } },
      },
      orderBy: { fecha: 'desc' },
    });

    res.json({ comentarios });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
