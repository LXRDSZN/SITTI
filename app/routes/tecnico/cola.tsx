import type { Route } from "./+types/cola";
import { getTicketsByTechnician, getUnassignedTickets } from "../../utils/mockData";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Cola de Trabajo - SITTI" }];
};

export default function WorkQueue() {
  const { user } = useAuth();

  if (!user) return null;

  const myTickets = getTicketsByTechnician(user.id);
  const urgentTickets = myTickets
    .filter((t) => t.status !== "resuelto" && t.status !== "cerrado")
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        urgente: 0,
        alta: 1,
        media: 2,
        baja: 3,
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const unassignedTickets = getUnassignedTickets();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Cola de Trabajo
      </h1>

      {/* My Priority Queue */}
      <Card>
        <CardTitle>Mis Tickets por Prioridad</CardTitle>
        <div className="space-y-2">
          {urgentTickets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tienes tickets activos
            </p>
          ) : (
            urgentTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-8 text-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <Link to={`/tecnico/tickets/${ticket.id}`}>
                  <Button variant="primary" size="sm">
                    Atender
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Available Tickets */}
      <Card>
        <CardTitle>Tickets Disponibles para Tomar</CardTitle>
        <div className="space-y-2">
          {unassignedTickets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No hay tickets disponibles
            </p>
          ) : (
            unassignedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {ticket.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {ticket.description.substring(0, 80)}...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Tomar
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
