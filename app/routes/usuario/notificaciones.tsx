import type { Route } from "./+types/notificaciones";
import { Card, CardTitle } from "../../components/common/Card";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Notificaciones - SITTI" }];
};

const mockNotifications = [
  {
    id: "notif-1",
    title: "Ticket resuelto",
    message: "Tu ticket #ticket-4 ha sido resuelto",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "notif-2",
    title: "Actualización de ticket",
    message: "Se agregó un comentario a tu ticket #ticket-3",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "notif-3",
    title: "Ticket asignado",
    message: "Un técnico ha sido asignado a tu ticket #ticket-1",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function Notifications() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notificaciones
        </h1>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notif) => (
          <Card
            key={notif.id}
            className={`${
              !notif.read ? "border-l-4 border-l-blue-600" : ""
            } cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {notif.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {notif.timestamp.toLocaleString("es-ES")}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ×
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
