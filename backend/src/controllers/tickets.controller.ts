import type { Request, Response } from 'express';
import { getTickets, getTicketById, createTicket, updateTicket, deleteTicket } from '../services/tickets.service.js';
import prisma from '../config/database.js';

export const listTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await getTickets();
    res.json({ tickets });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyTickets = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true, area: true },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rolLower = usuario.rol.nombre.toLowerCase();
    const tickets = await getTickets(rolLower, usuario.id_usuario, usuario.id_area);
    
    res.json({ tickets });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const ticket = await getTicketById(parseInt(id));
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const rol = usuario.rol.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const puedeVer =
      rol === 'administrador' ||
      rol === 'tecnico' ||
      (rol === 'usuario' && ticket.id_solicitante === usuario.id_usuario);

    if (!puedeVer) {
      return res.status(403).json({ error: 'No tienes permisos para consultar este ticket' });
    }

    res.json({ ticket });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { titulo, descripcion, id_area, id_categoria, id_prioridad } = req.body;

    if (!titulo || !descripcion || !id_area || !id_categoria || !id_prioridad) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const ticket = await createTicket({
      titulo,
      descripcion,
      id_solicitante: req.usuario.id_usuario,
      id_area,
      id_categoria,
      id_prioridad,
    });

    res.status(201).json({ ticket });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const id_ticket = parseInt(req.params.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: req.usuario.id_usuario },
      include: { rol: true },
    });
    const ticketActual = await prisma.ticket.findUnique({
      where: { id_ticket },
      include: { estado: true },
    });

    if (!usuario || !ticketActual) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const rol = usuario.rol.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const esAdministradorOTecnico = rol === 'administrador' || rol === 'tecnico';
    const esSolicitante = rol === 'usuario' && ticketActual.id_solicitante === usuario.id_usuario;

    if (!esAdministradorOTecnico && !esSolicitante) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este ticket' });
    }

    if (esSolicitante && ticketActual.estado.nombre !== 'ABIERTO') {
      return res.status(409).json({
        error: 'Solo puedes editar tickets que todavía están abiertos',
      });
    }

    if (esSolicitante) {
      const allowedKeys = ['titulo', 'descripcion', 'id_prioridad'];
      const hasRestrictedField = Object.keys(req.body).some((key) => !allowedKeys.includes(key));
      if (hasRestrictedField) {
        return res.status(403).json({
          error: 'Como solicitante solo puedes actualizar título, descripción y prioridad',
        });
      }
    }

    const ticket = await updateTicket(id_ticket, req.body);
    
    res.json({ ticket });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    await deleteTicket(parseInt(id));
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
