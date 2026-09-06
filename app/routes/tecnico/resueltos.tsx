import type { Route } from "./+types/resueltos";
import { getTicketsByTechnician } from "../../utils/mockData";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Tickets Resueltos - SITTI" }];
};

export default function ResolvedTickets() {
  const { user } = useAuth();

  if (!user) return null;

  const tickets = getTicketsByTechnician(user.id).filter(
    (t) => t.status === "resuelto"
  );

  const avgResolutionTime =
    tickets.length > 0
      ? Math.round(
          tickets.reduce((sum, t) => {
            if (t.resolvedAt) {
              const days = Math.floor(
                (new Date(t.resolvedAt).getTime() -
                  new Date(t.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }
            return sum;
          }, 0) / tickets.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tickets Resueltos
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Total Resueltos
          </p>
          <p className="text-4xl font-bold text-green-600">{tickets.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Tiempo Promedio
          </p>
          <p className="text-4xl font-bold text-blue-600">{avgResolutionTime}d</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Tasa de Resolución
          </p>
          <p className="text-4xl font-bold text-purple-600">
            {tickets.length > 0 ? "100%" : "0%"}
          </p>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardTitle>Listado de Tickets Resueltos</CardTitle>
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
                  Resuelto En
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Tiempo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => {
                const resolutionDays =
                  ticket.resolvedAt &&
                  Math.floor(
                    (new Date(ticket.resolvedAt).getTime() -
                      new Date(ticket.createdAt).getTime()) /
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
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.resolvedAt
                        ? new Date(ticket.resolvedAt).toLocaleDateString(
                            "es-ES"
                          )
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">
                      {resolutionDays}d
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay tickets resueltos aún
          </p>
        )}
      </Card>
    </div>
  );
}
