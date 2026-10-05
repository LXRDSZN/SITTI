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

export default function TicketDetail({ params }: Route.ComponentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    id_prioridad: 0,
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getTicketById(parseInt(params.id));
        setTicket(response.ticket);
        setFormData({
          titulo: response.ticket.titulo,
          descripcion: response.ticket.descripcion,
          id_prioridad: response.ticket.prioridad.id_prioridad,
        });
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

  const canEdit = ticket?.estado.nombre === "ABIERTO";

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket) return;

    try {
      setSaving(true);
      setError(null);
      const response = await ticketsService.updateTicket(ticket.id_ticket, formData);
      setTicket(response.ticket);
      setIsEditing(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el ticket",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!ticket) return;
    setFormData({
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      id_prioridad: ticket.prioridad.id_prioridad,
    });
    setError(null);
    setIsEditing(false);
  };

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
            <CardTitle>{isEditing ? "Editar Ticket" : "Descripción"}</CardTitle>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <input
                  value={formData.titulo}
                  onChange={(event) =>
                    setFormData({ ...formData, titulo: event.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Título"
                  required
                />
                <textarea
                  value={formData.descripcion}
                  onChange={(event) =>
                    setFormData({ ...formData, descripcion: event.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={6}
                  placeholder="Descripción"
                  required
                />
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Prioridad
                  <select
                    value={formData.id_prioridad}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        id_prioridad: Number(event.target.value),
                      })
                    }
                    className="mt-1 w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={1}>BAJA</option>
                    <option value={2}>MEDIA</option>
                    <option value={3}>ALTA</option>
                  </select>
                </label>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {ticket.descripcion}
              </p>
            )}
          </Card>

          <CommentsSection ticketId={ticket.id_ticket} />
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

          {!isEditing && (
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={!canEdit}
            >
              {canEdit ? "Editar Ticket" : "Ticket no editable"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
