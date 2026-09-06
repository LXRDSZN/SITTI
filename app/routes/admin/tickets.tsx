import type { Route } from "./+types/tickets";
import { mockTickets } from "../../utils/mockData";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Todos los Tickets - SITTI" }];
};

export default function AllTickets() {
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  const filteredTickets =
    filterStatus === "todos"
      ? mockTickets
      : mockTickets.filter((t) => t.status === filterStatus);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Todos los Tickets
      </h1>

      {/* Filters */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "todos", label: "Todos" },
            { value: "abierto", label: "Abiertos" },
            { value: "en-progreso", label: "En Progreso" },
            { value: "resuelto", label: "Resueltos" },
            { value: "cerrado", label: "Cerrados" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tickets Table */}
      <Card>
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
                  Creador
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Asignado
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
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
                    {ticket.createdBy}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {ticket.assignedTo || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/admin/tickets/${ticket.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay tickets que coincidan con los filtros
          </p>
        )}
      </Card>
    </div>
  );
}
