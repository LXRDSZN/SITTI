import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, requireRole('Administrador'), async (_req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });

    res.json({ success: true, categorias });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'No se pudieron obtener las categorías' });
  }
});

router.put('/:id', authMiddleware, requireRole('Administrador'), async (req: Request, res: Response) => {
  try {
    const id_categoria = Number(req.params.id);
    const { nombre, descripcion, activo } = req.body;

    if (!Number.isInteger(id_categoria) || id_categoria <= 0) {
      return res.status(400).json({ success: false, error: 'El identificador de la categoría no es válido' });
    }

    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'El nombre de la categoría es obligatorio' });
    }

    if (descripcion !== null && typeof descripcion !== 'string') {
      return res.status(400).json({ success: false, error: 'La descripción no es válida' });
    }

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ success: false, error: 'El estado de la categoría no es válido' });
    }

    const categoria = await prisma.categoria.update({
      where: { id_categoria },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion === null ? null : descripcion.trim(),
        activo,
      },
    });

    res.json({ success: true, categoria });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ success: false, error: 'Ya existe una categoría con ese nombre' });
    }

    console.error('Error updating category:', error);
    res.status(500).json({ success: false, error: 'No se pudo actualizar la categoría' });
  }
});

export default router;