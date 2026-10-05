import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

const normalizeRole = (role: string) =>
  role.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const requireRole = (...allowedRoles: string[]) => {
  const allowed = allowedRoles.map(normalizeRole);

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: req.usuario.id_usuario },
        select: { activo: true, rol: { select: { nombre: true } } },
      });

      if (!usuario || !usuario.activo) {
        return res.status(401).json({ error: 'Usuario inactivo o no encontrado' });
      }

      if (!allowed.includes(normalizeRole(usuario.rol.nombre))) {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};