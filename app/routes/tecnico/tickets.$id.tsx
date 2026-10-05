import type { Route } from "./+types/tickets.\$id";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ticketsService, type Ticket } from "../../services/tickets.service";
import { CommentsSection } from "../../components/tickets/CommentsSection";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `Ticket ${params.id} - SITTI` }];
};

export default function TechnicianTicketDetail({ params }: Route.ComponentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getTicketById(parseInt(params.id));
        setTicket(response.ticket);
        setNewStatus(response.ticket.estado.nombre);
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
        <Button onClick={() => navigate("/tecnico/asignados")}>
          Volver a Tickets Asignados
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    if (newStatus === ticket.estado.nombre) {
      return;
    }

    try {
      // Mapear nombre de estado a id
      const estadoMap: Record<string, number> = {
        "ABIERTO": 1,
        "ASIGNADO": 2,
        "EN_PROCESO": 3,
        "PENDIENTE": 4,
        "RESUELTO": 5,
        "CERRADO": 6,
      };

      const idEstado = estadoMap[newStatus];
      const response = await ticketsService.updateTicket(ticket.id_ticket, {
        id_estado: idEstado,
      });

      // Actualizar el ticket localmente con la respuesta del servidor
      setTicket(response.ticket);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

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
                    : "blue"
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
          <Alert type="success" message="Ticket resuelto ✓" />
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Details and Work Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Descripción del Problema</CardTitle>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ticket.descripcion}
            </p>
          </Card>

          <CommentsSection
            ticketId={ticket.id_ticket}
            title="Notas de Trabajo y Comentarios"
            placeholder="Describe el trabajo realizado..."
          />

          {/* Update Status */}
          <Card>
            <CardTitle>Actualizar Estado</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Nuevo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ABIERTO">Abierto</option>
                  <option value="ASIGNADO">Asignado</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={newStatus === ticket.estado.nombre}
              >
                {newStatus === ticket.estado.nombre
                  ? "Sin cambios"
                  : "Actualizar Estado"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardTitle>Información del Ticket</CardTitle>
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
                <dd className="text-gray-900 dark:text-white">
                  {ticket.area.nombre}
                </dd>
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
                  Prioridad
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.prioridad.nombre}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Solicitante
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.solicitante.nombre}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Email Solicitante
                </dt>
                <dd className="text-gray-900 dark:text-white text-xs">
                  {ticket.solicitante.correo}
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
                  {new Date(ticket.fecha_actualizacion).toLocaleDateString(
                    "es-ES"
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          <Button
            onClick={() => navigate("/tecnico/asignados")}
            variant="secondary"
            className="w-full"
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
