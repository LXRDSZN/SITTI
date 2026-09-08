import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener notificaciones del usuario
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const notifications = await prisma.notificacion.findMany({
      where: {
        id_usuario: userId,
      },
      include: {
        ticket: {
          select: {
            id_ticket: true,
            folio: true,
            titulo: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.leido).length,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT - Marcar notificación como leída
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const notification = await prisma.notificacion.updateMany({
      where: {
        id_notificacion: parseInt(id),
        id_usuario: userId,
      },
      data: {
        leido: true,
        fecha_lectura: new Date(),
      },
    });

    if (notification.count === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Notificación no encontrada" });
    }

    res.json({ success: true, message: "Notificación marcada como leída" });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT - Marcar todas como leídas
export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).userId;

    await prisma.notificacion.updateMany({
      where: {
        id_usuario: userId,
        leido: false,
      },
      data: {
        leido: true,
        fecha_lectura: new Date(),
      },
    });

    res.json({ success: true, message: "Todas las notificaciones marcadas como leídas" });
  } catch (error: any) {
    console.error("Error marking all notifications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Eliminar notificación
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const notification = await prisma.notificacion.deleteMany({
      where: {
        id_notificacion: parseInt(id),
        id_usuario: userId,
      },
    });

    if (notification.count === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Notificación no encontrada" });
    }

    res.json({ success: true, message: "Notificación eliminada" });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Eliminar todas las notificaciones
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    await prisma.notificacion.deleteMany({
      where: {
        id_usuario: userId,
      },
    });

    res.json({ success: true, message: "Todas las notificaciones eliminadas" });
  } catch (error: any) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Función helper para crear notificaciones (usada desde otros controladores)
export const createNotification = async (
  userId: number,
  ticketId: number,
  titulo: string,
  mensaje: string,
  tipo: string
) => {
  try {
    return await prisma.notificacion.create({
      data: {
        id_usuario: userId,
        id_ticket: ticketId,
        titulo,
        mensaje,
        tipo,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
