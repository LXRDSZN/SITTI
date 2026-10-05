import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';

const router = Router();

// Crear comentario
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id_ticket, comentario } = req.body;

    if (!id_ticket || typeof comentario !== 'string' || !comentario.trim()) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id_ticket: Number(id_ticket) },
      include: { solicitante: true },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true },
    });
    const rol = usuario?.rol.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const puedeComentar =
      rol === 'administrador' ||
      rol === 'tecnico' ||
      (rol === 'usuario' && ticket.id_solicitante === req.usuario.id_usuario);

    if (!puedeComentar) {
      return res.status(403).json({ error: 'No tienes permisos para comentar este ticket' });
    }

    const nuevoComentario = await prisma.comentario.create({
      data: {
        id_ticket: Number(id_ticket),
        id_usuario: req.usuario.id_usuario,
        comentario: comentario.trim(),
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
router.get('/ticket/:id_ticket', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id_ticket } = req.params;
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id_ticket: Number(id_ticket) },
      include: { solicitante: true },
    });
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true },
    });

    if (!ticket || !usuario) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const rol = usuario.rol.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const puedeVer =
      rol === 'administrador' ||
      rol === 'tecnico' ||
      (rol === 'usuario' && ticket.id_solicitante === req.usuario.id_usuario);

    if (!puedeVer) {
      return res.status(403).json({ error: 'No tienes permisos para consultar los comentarios' });
    }

    const comentarios = await prisma.comentario.findMany({
      where: { id_ticket: Number(id_ticket) },
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
