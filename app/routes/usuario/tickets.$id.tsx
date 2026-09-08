import type { Route } from "./+types/tickets.\$id";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `Ticket ${params.id} - SITTI` }];
};

export default function TicketDetail({ params }: Route.ComponentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getTicketById(parseInt(params.id));
        setTicket(response.ticket);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el ticket");
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTicket();
    }
  }, [params.id, user]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <Alert
          type="error"
          title="Error"
          message={error || "Ticket no encontrado"}
        />
        <Button onClick={() => navigate("/usuario/tickets")}>
          Volver a Mis Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {ticket.titulo}
        </h1>
        <div className="flex gap-3 mb-4">
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
        {ticket.estado.nombre === "RESUELTO" && (
          <Alert type="success" message="Este ticket ha sido resuelto ✓" />
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Descripción</CardTitle>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ticket.descripcion}
            </p>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardTitle>Comentarios</CardTitle>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hay comentarios aún
                </p>
              </div>
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Agrega un comentario..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <Button className="mt-3" disabled={!comment.trim()}>
                  Comentar
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardTitle>Información</CardTitle>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Folio
                </dt>
                <dd className="text-gray-900 dark:text-white font-mono">
                  {ticket.folio}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Área
                </dt>
                <dd className="text-gray-900 dark:text-white">{ticket.area.nombre}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Categoría
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.categoria.nombre}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Creado
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(ticket.fecha_creacion).toLocaleDateString("es-ES")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Actualizado
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(ticket.fecha_actualizacion).toLocaleDateString("es-ES")}
                </dd>
              </div>
              {ticket.responsable && (
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">
                    Asignado a
                  </dt>
                  <dd className="text-gray-900 dark:text-white">
                    {ticket.responsable.nombre}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Button className="w-full" variant="secondary" disabled>
            Editar Ticket (Próximamente)
          </Button>
        </div>
      </div>
    </div>
  );
}
