import type { Route } from "./+types/notificaciones";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { notificationsService, type Notification } from "../../services/notifications.service";
import { Toast } from "../../components/common/Alert";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Notificaciones - SITTI" }];
};

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setError(null);
      const response = await notificationsService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      console.error("Error loading notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationsService.delete(id);
      setNotifications((prev) => prev.filter((notif) => notif.id_notificacion !== id));
      setToast({ message: "Notificación eliminada", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleClearAll = async () => {
    if (!confirm("¿Eliminar todas las notificaciones?")) return;
    try {
      await notificationsService.deleteAll();
      setNotifications([]);
      setToast({ message: "Todas las notificaciones eliminadas", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id_notificacion === id ? { ...notif, leido: true } : notif
        )
      );
    } catch (err: any) {
      console.error("Error marking as read:", err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.leido) {
      await handleMarkAsRead(notif.id_notificacion);
    }
    if (notif.ticket?.id_ticket) {
      navigate(`/tecnico/tickets/${notif.ticket.id_ticket}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
      setToast({ message: "Todas marcadas como leídas", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.leido).length;

  if (!user) return null;

  const getNotificationColor = (tipo: string) => {
    if (tipo === "ticket_creado") return "bg-purple-50 dark:bg-purple-900/20 border-l-purple-600";
    if (tipo === "ticket_resuelto") return "bg-green-50 dark:bg-green-900/20 border-l-green-600";
    if (tipo === "ticket_asignado") return "bg-blue-50 dark:bg-blue-900/20 border-l-blue-600";
    if (tipo === "ticket_actualizado") return "bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-600";
    if (tipo === "comentario") return "bg-indigo-50 dark:bg-indigo-900/20 border-l-indigo-600";
    return "bg-gray-50 dark:bg-gray-900/20 border-l-gray-600";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notificaciones
          </h1>
        </div>
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            Cargando notificaciones...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Marcar todas como leídas
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Limpiar todo
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-600">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id_notificacion}
              className={`border-l-4 ${getNotificationColor(notif.tipo)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notif.titulo}
                    </h3>
                    {!notif.leido && (
                      <span className="w-3 h-3 bg-blue-600 rounded-full" title="No leída" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {notif.mensaje}
                  </p>
                  {notif.ticket && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Ticket: <span className="font-mono underline text-blue-600 dark:text-blue-400">{notif.ticket.folio}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {new Date(notif.fecha_creacion).toLocaleString("es-ES")}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(notif.id_notificacion);
                  }}
                  className="ml-4 flex-shrink-0 text-2xl text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Eliminar notificación"
                >
                  ×
                </button>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              No tienes notificaciones
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
