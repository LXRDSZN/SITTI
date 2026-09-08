import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notifications.controller";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET - Obtener notificaciones del usuario
router.get("/", getUserNotifications);

// PUT - Marcar una notificación como leída
router.put("/:id/read", markNotificationAsRead);

// PUT - Marcar todas como leídas
router.put("/read-all", markAllNotificationsAsRead);

// DELETE - Eliminar una notificación
router.delete("/:id", deleteNotification);

// DELETE - Eliminar todas las notificaciones
router.delete("/", deleteAllNotifications);

export default router;
