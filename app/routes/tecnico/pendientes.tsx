import type { Route } from "./+types/pendientes";
import { getTicketsByTechnician } from "../../utils/mockData";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Tickets Pendientes - SITTI" }];
};

export default function PendingTickets() {
  const { user } = useAuth();

  if (!user) return null;

  const tickets = getTicketsByTechnician(user.id).filter(
    (t) => t.status === "abierto" || t.status === "en-progreso"
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tickets Pendientes
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Total Pendientes
          </p>
          <p className="text-4xl font-bold text-blue-600">{tickets.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Abiertos
          </p>
          <p className="text-4xl font-bold text-red-600">
            {tickets.filter((t) => t.status === "abierto").length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            En Progreso
          </p>
          <p className="text-4xl font-bold text-yellow-600">
            {tickets.filter((t) => t.status === "en-progreso").length}
          </p>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardTitle>Listado de Tickets</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Título
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Prioridad
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Días
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => {
                const daysPending = Math.floor(
                  (Date.now() - new Date(ticket.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {ticket.id}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.title}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {daysPending}d
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/tecnico/tickets/${ticket.id}`}>
                        <Button variant="primary" size="sm">
                          Continuar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            ¡Excelente! No tienes tickets pendientes
          </p>
        )}
      </Card>
    </div>
  );
}
