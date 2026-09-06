import type { Route } from "./+types/tickets";
import { getUserTickets } from "../../utils/mockData";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Mis Tickets - SITTI" }];
};

export default function UserTickets() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  if (!user) return null;

  const userTickets = getUserTickets(user.id);
  const filteredTickets =
    filterStatus === "todos"
      ? userTickets
      : userTickets.filter((t) => t.status === filterStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mis Tickets
        </h1>
        <Link to="/usuario/tickets/nuevo">
          <Button>Nuevo Ticket</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "todos", label: "Todos" },
            { value: "abierto", label: "Abiertos" },
            { value: "en-progreso", label: "En Progreso" },
            { value: "resuelto", label: "Resueltos" },
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

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {ticket.description.substring(0, 100)}...
                </p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>ID: {ticket.id}</span>
                  <span>Área: {ticket.area}</span>
                  <span>
                    Creado:{" "}
                    {new Date(ticket.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
              <Link to={`/usuario/tickets/${ticket.id}`}>
                <Button variant="primary" size="sm">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </Card>
        ))}
        {filteredTickets.length === 0 && (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              No hay tickets que coincidan con los filtros
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
