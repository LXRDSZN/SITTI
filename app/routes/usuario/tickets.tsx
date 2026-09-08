import type { Route } from "./+types/tickets";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Mis Tickets - SITTI" }];
};

export default function UserTickets() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getMyTickets();
        setTickets(response.tickets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar tickets");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  if (!user) return null;

  const getStateKey = (estadoNombre: string): string => {
    const estado = estadoNombre.toUpperCase();
    if (estado === "ABIERTO") return "abierto";
    if (estado === "EN_PROCESO") return "en-progreso";
    if (estado === "RESUELTO") return "resuelto";
    return "otros";
  };

  const filteredTickets =
    filterStatus === "todos"
      ? tickets
      : tickets.filter((t) => getStateKey(t.estado.nombre) === filterStatus);

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

      {/* Loading */}
      {loading && (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            Cargando tickets...
          </p>
        </Card>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
          <p className="text-red-800 dark:text-red-300">
            ✕ Error: {error}
          </p>
        </Card>
      )}

      {/* Tickets List */}
      {!loading && (
        <div className="grid gap-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <Card key={ticket.id_ticket}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticket.titulo}
                      </h3>
                      <StatusBadge
                        status={
                          ticket.estado.nombre === "ABIERTO"
                            ? "red"
                            : ticket.estado.nombre === "EN_PROCESO"
                              ? "yellow"
                              : ticket.estado.nombre === "RESUELTO"
                                ? "green"
                                : "gray"
                        }
                      >
                        {ticket.estado.nombre}
                      </StatusBadge>
                      <PriorityBadge
                        priority={
                          ticket.prioridad.nombre === "ALTA"
                            ? "red"
                            : ticket.prioridad.nombre === "MEDIA"
                              ? "yellow"
                              : "green"
                        }
                      >
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {ticket.descripcion.substring(0, 100)}...
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <span>Folio: {ticket.folio}</span>
                      <span>Área: {ticket.area.nombre}</span>
                      <span>
                        Creado:{" "}
                        {new Date(ticket.fecha_creacion).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                  </div>
                  <Link to={`/usuario/tickets/${ticket.id_ticket}`}>
                    <Button variant="secondary" className="text-xs py-1 px-2">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                No hay tickets que coincidan con los filtros
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
