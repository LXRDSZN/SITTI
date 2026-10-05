import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, requireRole('Administrador'), async (_req: Request, res: Response) => {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
    });

    res.json({ success: true, areas });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({ success: false, error: 'No se pudieron obtener las áreas' });
  }
});

router.put('/:id', authMiddleware, requireRole('Administrador'), async (req: Request, res: Response) => {
  try {
    const id_area = Number(req.params.id);
    const { nombre, activo } = req.body;

    if (!Number.isInteger(id_area) || id_area <= 0) {
      return res.status(400).json({ success: false, error: 'El identificador del área no es válido' });
    }

    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'El nombre del área es obligatorio' });
    }

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ success: false, error: 'El estado del área no es válido' });
    }

    const area = await prisma.area.update({
      where: { id_area },
      data: { nombre: nombre.trim(), activo },
    });

    res.json({ success: true, area });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ success: false, error: 'Área no encontrada' });
    }

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ success: false, error: 'Ya existe un área con ese nombre' });
    }

    console.error('Error updating area:', error);
    res.status(500).json({ success: false, error: 'No se pudo actualizar el área' });
  }
});

export default router;