import type { Route } from "./+types/cola";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useState, useEffect } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Cola de Tickets - SITTI" }];
};

export default function TicketQueue() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getAllTickets();
        // Filtrar tickets ABIERTO (sin asignar) ordenados por prioridad
        const abiertos = response.tickets.filter(
          (t) => t.estado.nombre === "ABIERTO"
        );
        // Ordenar por prioridad (ALTA primero)
        abiertos.sort((a, b) => {
          const prioridadMap: Record<string, number> = {
            URGENTE: 0,
            ALTA: 1,
            MEDIA: 2,
            BAJA: 3,
          };
          return (
            (prioridadMap[a.prioridad.nombre] || 99) -
            (prioridadMap[b.prioridad.nombre] || 99)
          );
        });
        setTickets(abiertos);
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

  const handleTakeTicket = async (ticketId: number) => {
    try {
      setLoadingId(ticketId);
      // Cambiar estado a EN_PROCESO (id 3) y asignar al técnico actual
      await ticketsService.updateTicket(ticketId, {
        id_responsable: parseInt(user.id),
        id_estado: 3, // EN_PROCESO
      });

      // Remover ticket de la cola
      setTickets((prev) => prev.filter((t) => t.id_ticket !== ticketId));
    } catch (err) {
      console.error("Error al tomar ticket:", err);
    } finally {
      setLoadingId(null);
    }
  };

  if (!user) return null;

  const getPriorityColor = (prioridad: string) => {
    if (prioridad === "ALTA" || prioridad === "URGENTE") return "red";
    if (prioridad === "MEDIA") return "yellow";
    return "green";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Cola de Tickets
      </h1>

      {/* Summary Card */}
      <Card className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          Tickets Disponibles
        </p>
        <p className="text-4xl font-bold text-purple-600">{tickets.length}</p>
      </Card>

      {/* Tickets Available */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tickets Disponibles para Tomar
        </h2>

        {loading ? (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Cargando tickets...
            </p>
          </Card>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
            <p className="text-red-800 dark:text-red-300">Error: {error}</p>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              ¡Excelente! No hay tickets disponibles en la cola
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id_ticket} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticket.folio}
                      </h3>
                      <PriorityBadge
                        priority={getPriorityColor(ticket.prioridad.nombre)}
                      >
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      {ticket.titulo}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {ticket.descripcion.substring(0, 150)}...
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Área: {ticket.area.nombre}</span>
                      <span>Solicitante: {ticket.solicitante.nombre}</span>
                      <span>
                        Creado:{" "}
                        {new Date(ticket.fecha_creacion).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTakeTicket(ticket.id_ticket)}
                    disabled={loadingId === ticket.id_ticket}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {loadingId === ticket.id_ticket
                      ? "Asignando..."
                      : "Tomar Ticket"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
