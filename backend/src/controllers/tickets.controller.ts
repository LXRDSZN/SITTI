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
    const { id } = req.params;
    const ticket = await getTicketById(parseInt(id));
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

    const { id } = req.params;
    const ticket = await updateTicket(parseInt(id), req.body);
    
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
