import type { Route } from "./+types/resueltos";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Tickets Resueltos - SITTI" }];
};

export default function ResolvedTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getAllTickets();
        // Filtrar solo tickets RESUELTO
        const resueltos = response.tickets.filter(
          (t) => t.estado.nombre === "RESUELTO"
        );
        setTickets(resueltos);
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

  const getDaysTaken = (fechaCreacion: string, fechaCierre?: string) => {
    const end = fechaCierre ? new Date(fechaCierre).getTime() : Date.now();
    return Math.floor(
      (end - new Date(fechaCreacion).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getPriorityColor = (prioridad: string) => {
    if (prioridad === "ALTA") return "red";
    if (prioridad === "MEDIA") return "yellow";
    return "green";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tickets Resueltos
      </h1>

      {/* Summary Card */}
      <Card className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          Total Resueltos
        </p>
        <p className="text-4xl font-bold text-green-600">{tickets.length}</p>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardTitle>Listado de Tickets Resueltos</CardTitle>
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
                    Prioridad
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Días
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Resuelto
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
                      <PriorityBadge
                        priority={getPriorityColor(ticket.prioridad.nombre)}
                      >
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {getDaysTaken(ticket.fecha_creacion, ticket.fecha_cierre)}d
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ Completado
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/tecnico/tickets/${ticket.id_ticket}`}>
                        <Button variant="secondary" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tickets.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No tienes tickets resueltos aún
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
