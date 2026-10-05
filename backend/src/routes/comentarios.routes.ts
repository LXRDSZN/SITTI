import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';
import { createNotification } from '../controllers/notifications.controller.js';

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

    const usuariosNotificados = new Set<number>();
    const remitente = usuario;
    const rolRemitente = rol ?? 'usuario';
    const destinatarios = await prisma.usuario.findMany({
      where: {
        activo: true,
        id_usuario: { not: req.usuario.id_usuario },
      },
      include: { rol: true },
    });

    for (const destinatario of destinatarios) {
      const rolDestinatario = destinatario.rol.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const esAdministrador = rolDestinatario === 'administrador';
      const esTecnico = rolDestinatario === 'tecnico';
      const esSolicitante = destinatario.id_usuario === ticket.id_solicitante;
      const esResponsable = destinatario.id_usuario === ticket.id_responsable;

      const debeNotificar =
        esAdministrador ||
        (rolRemitente === 'usuario' && (esTecnico && (!ticket.id_responsable || esResponsable))) ||
        (rolRemitente === 'tecnico' && esSolicitante) ||
        (rolRemitente === 'administrador' && (esSolicitante || esResponsable));

      if (debeNotificar && !usuariosNotificados.has(destinatario.id_usuario)) {
        usuariosNotificados.add(destinatario.id_usuario);
        await createNotification(
          destinatario.id_usuario,
          ticket.id_ticket,
          `💬 ${remitente?.nombre ?? 'Un usuario'} comentó en ${ticket.folio}`,
          `${remitente?.nombre ?? 'Un usuario'} (${rolRemitente}) escribió: "${comentario.trim()}"`,
          'comentario',
        );
      }
    }

    res.status(201).json({ comentario: nuevoComentario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar comentario: el autor elimina el suyo y el administrador cualquiera.
router.delete('/:id_comentario', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const idComentario = Number(req.params.id_comentario);
    if (!Number.isInteger(idComentario) || idComentario <= 0) {
      return res.status(400).json({ error: 'Comentario inválido' });
    }

    const comentario = await prisma.comentario.findUnique({
      where: { id_comentario: idComentario },
    });

    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const solicitante = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true },
    });
    const rol = (solicitante?.rol.nombre ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const esAdministrador = rol === 'administrador';
    const esAutor = comentario.id_usuario === req.usuario.id_usuario;

    if (!esAdministrador && !esAutor) {
      return res.status(403).json({
        error: 'Solo puedes eliminar tus propios comentarios',
      });
    }

    await prisma.comentario.delete({
      where: { id_comentario: idComentario },
    });

    return res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'No se pudo eliminar el comentario' });
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
