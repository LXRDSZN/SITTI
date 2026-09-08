import type { Route } from "./+types/pendientes";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Tickets Pendientes - SITTI" }];
};

export default function PendingTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getAllTickets();
        // Filtrar tickets pendientes (ABIERTO o EN_PROCESO)
        const pendientes = response.tickets.filter(
          (t) => t.estado.nombre === "ABIERTO" || t.estado.nombre === "EN_PROCESO"
        );
        setTickets(pendientes);
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

  const abiertos = tickets.filter((t) => t.estado.nombre === "ABIERTO").length;
  const enProceso = tickets.filter((t) => t.estado.nombre === "EN_PROCESO").length;

  const getDaysPending = (fecha: string) => {
    return Math.floor(
      (Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getStateColor = (estado: string) => {
    if (estado === "ABIERTO") return "red";
    if (estado === "EN_PROCESO") return "yellow";
    return "gray";
  };

  const getPriorityColor = (prioridad: string) => {
    if (prioridad === "ALTA") return "red";
    if (prioridad === "MEDIA") return "yellow";
    return "green";
  };

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
          <p className="text-4xl font-bold text-red-600">{abiertos}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            En Progreso
          </p>
          <p className="text-4xl font-bold text-yellow-600">{enProceso}</p>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardTitle>Listado de Tickets Pendientes</CardTitle>
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Cargando tickets...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400 py-8">
            Error: {error}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Folio
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
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id_ticket}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {ticket.folio}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.titulo}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={getStateColor(ticket.estado.nombre)}
                      >
                        {ticket.estado.nombre}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge
                        priority={getPriorityColor(ticket.prioridad.nombre)}
                      >
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {getDaysPending(ticket.fecha_creacion)}d
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/tecnico/tickets/${ticket.id_ticket}`}>
                        <Button variant="primary" size="sm">
                          Continuar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tickets.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                ¡Excelente! No tienes tickets pendientes
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
