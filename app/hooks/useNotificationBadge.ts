import { useState, useEffect } from "react";
import { notificationsService } from "../services/notifications.service";

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar al montar
    loadUnreadCount();

    // Recargar cada 5 segundos
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, loading, reload: loadUnreadCount };
}
