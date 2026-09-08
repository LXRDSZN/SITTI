import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';
import { hashPassword } from '../utils/password.js';

const router = Router();

// GET /api/users - Obtener todos los usuarios con su rol y área
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: true,
        area: true,
      },
      orderBy: {
        id_usuario: 'desc',
      },
    });

    res.json({
      success: true,
      usuarios: usuarios.map(u => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        correo: u.correo,
        id_rol: u.id_rol,
        rol: u.rol.nombre,
        id_area: u.id_area,
        area: u.area.nombre,
        activo: u.activo,
        creado_en: u.creado_en,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/roles-areas - Obtener catálogo de roles y áreas para formularios
router.get('/meta/roles-areas', authMiddleware, async (req: Request, res: Response) => {
  try {
    const roles = await prisma.rol.findMany();
    const areas = await prisma.area.findMany({ where: { activo: true } });

    res.json({
      success: true,
      roles,
      areas,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users - Crear un nuevo usuario
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { nombre, correo, password, id_rol, id_area, activo } = req.body;

    if (!nombre || !correo || !id_rol || !id_area) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos (nombre, correo, id_rol, id_area)' });
    }

    // Verificar si el correo ya existe
    const existente = await prisma.usuario.findUnique({ where: { correo } });
    if (existente) {
      return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado' });
    }

    const passwordHash = await hashPassword(password || 'password123');

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password_hash: passwordHash,
        id_rol: parseInt(id_rol),
        id_area: parseInt(id_area),
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      include: {
        rol: true,
        area: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        id_rol: nuevoUsuario.id_rol,
        rol: nuevoUsuario.rol.nombre,
        id_area: nuevoUsuario.id_area,
        area: nuevoUsuario.area.nombre,
        activo: nuevoUsuario.activo,
        creado_en: nuevoUsuario.creado_en,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/users/:id - Actualizar datos de un usuario
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, id_rol, id_area, activo } = req.body;

    const id_usuario = parseInt(id);

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id_usuario } });
    if (!usuarioExistente) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (correo !== undefined) dataToUpdate.correo = correo;
    if (id_rol !== undefined) dataToUpdate.id_rol = parseInt(id_rol);
    if (id_area !== undefined) dataToUpdate.id_area = parseInt(id_area);
    if (activo !== undefined) dataToUpdate.activo = Boolean(activo);
    if (password && password.trim().length > 0) {
      dataToUpdate.password_hash = await hashPassword(password);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario },
      data: dataToUpdate,
      include: {
        rol: true,
        area: true,
      },
    });

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      usuario: {
        id_usuario: usuarioActualizado.id_usuario,
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        id_rol: usuarioActualizado.id_rol,
        rol: usuarioActualizado.rol.nombre,
        id_area: usuarioActualizado.id_area,
        area: usuarioActualizado.area.nombre,
        activo: usuarioActualizado.activo,
        creado_en: usuarioActualizado.creado_en,
      },
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:id - Eliminar o desactivar un usuario
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const id_usuario = parseInt(id);

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id_usuario } });
    if (!usuarioExistente) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene tickets o registros asociados
    const countTickets = await prisma.ticket.count({
      where: {
        OR: [
          { id_solicitante: id_usuario },
          { id_responsable: id_usuario },
        ],
      },
    });

    if (countTickets > 0) {
      // Soft-delete (desactivar usuario para conservar historial de tickets)
      await prisma.usuario.update({
        where: { id_usuario },
        data: { activo: false },
      });
      return res.json({
        success: true,
        message: 'El usuario tiene tickets asociados, fue desactivado correctamente',
        softDeleted: true,
      });
    }

    // Hard-delete si no tiene historial
    await prisma.usuario.delete({
      where: { id_usuario },
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
