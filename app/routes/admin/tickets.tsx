import type { Route } from "./+types/tickets";
import { Card } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Todos los Tickets - SITTI" }];
};

const statusFilters = [
  { value: "todos", label: "Todos" },
  { value: "ABIERTO", label: "Abiertos" },
  { value: "ASIGNADO", label: "Asignados" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "PENDIENTE", label: "Pendientes" },
  { value: "RESUELTO", label: "Resueltos" },
  { value: "CERRADO", label: "Cerrados" },
];

const getStatusColor = (status: string) => {
  if (status === "ABIERTO") return "red";
  if (status === "ASIGNADO") return "blue";
  if (status === "EN_PROCESO" || status === "PENDIENTE") return "yellow";
  if (status === "RESUELTO" || status === "CERRADO") return "green";
  return "gray";
};

const getPriorityColor = (priority: string) => {
  if (priority === "ALTA") return "red";
  if (priority === "MEDIA") return "yellow";
  return "green";
};

export default function AllTickets() {
  const [filterStatus, setFilterStatus] = useState("todos");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ticketsService
      .getAllTickets()
      .then((response) => setTickets(response.tickets))
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los tickets"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets =
    filterStatus === "todos"
      ? tickets
      : tickets.filter((ticket) => ticket.estado.nombre === filterStatus);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Todos los Tickets
      </h1>

      <Card>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
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

      {loading && (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Cargando tickets...</p>
        </Card>
      )}

      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {["Folio", "Título", "Área", "Solicitante", "Estado", "Prioridad", "Responsable", "Acciones"].map((heading) => (
                    <th key={heading} className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id_ticket} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400">{ticket.folio}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{ticket.titulo}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{ticket.area.nombre}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{ticket.solicitante.nombre}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={getStatusColor(ticket.estado.nombre)}>{ticket.estado.nombre}</StatusBadge>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={getPriorityColor(ticket.prioridad.nombre)}>{ticket.prioridad.nombre}</PriorityBadge>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{ticket.responsable?.nombre || "Sin asignar"}</td>
                    <td className="py-3 px-4">
                      <Link to={`/admin/tickets/${ticket.id_ticket}`}>
                        <Button variant="ghost" size="sm">Ver / Editar</Button>
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
      )}
    </div>
  );
}
