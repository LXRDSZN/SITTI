import type { Route } from "./+types/tickets.$id";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { ticketsService, type Ticket } from "../../services/tickets.service";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { CommentsSection } from "../../components/tickets/CommentsSection";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `Ticket ${params.id} - SITTI` }];
};

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

export default function AdminTicketDetail({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ titulo: "", descripcion: "", id_prioridad: 0, id_estado: 0 });

  useEffect(() => {
    ticketsService
      .getTicketById(Number(params.id))
      .then(({ ticket: loadedTicket }) => {
        setTicket(loadedTicket);
        setFormData({
          titulo: loadedTicket.titulo,
          descripcion: loadedTicket.descripcion,
          id_prioridad: loadedTicket.prioridad.id_prioridad,
          id_estado: loadedTicket.estado.id_estado,
        });
      })
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el ticket"),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket) return;
    try {
      setSaving(true);
      const response = await ticketsService.updateTicket(ticket.id_ticket, formData);
      setTicket(response.ticket);
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar el ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!ticket || !confirm(`¿Eliminar el ticket ${ticket.folio}? Esta acción no se puede deshacer.`)) return;
    try {
      await ticketsService.deleteTicket(ticket.id_ticket);
      navigate("/admin/tickets", { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar el ticket");
    }
  };

  if (loading) return <Card><p className="text-center py-8">Cargando ticket...</p></Card>;
  if (error && !ticket) return <Alert type="error" title="Error" message={error} />;
  if (!ticket) return <p className="text-center py-8">Ticket no encontrado</p>;

  return (
    <div className="space-y-8">
      {error && <Alert type="error" title="Error" message={error} onClose={() => setError(null)} />}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-blue-600 dark:text-blue-400">{ticket.folio}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ticket.titulo}</h1>
          <div className="flex gap-3 mt-3">
            <StatusBadge status={getStatusColor(ticket.estado.nombre)}>{ticket.estado.nombre}</StatusBadge>
            <PriorityBadge priority={getPriorityColor(ticket.prioridad.nombre)}>{ticket.prioridad.nombre}</PriorityBadge>
          </div>
        </div>
        <Button variant="danger" onClick={handleDelete}>Eliminar Ticket</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardTitle>{isEditing ? "Editar Ticket" : "Descripción"}</CardTitle>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <input
                  value={formData.titulo}
                  onChange={(event) => setFormData({ ...formData, titulo: event.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <textarea
                  value={formData.descripcion}
                  onChange={(event) => setFormData({ ...formData, descripcion: event.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={6}
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar Cambios"}</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={saving}>Cancelar</Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{ticket.descripcion}</p>
            )}
          </Card>
          <CommentsSection ticketId={ticket.id_ticket} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle>Información del Ticket</CardTitle>
            <dl className="space-y-4 text-sm">
              <div><dt className="text-gray-600 dark:text-gray-400">Área</dt><dd>{ticket.area.nombre}</dd></div>
              <div><dt className="text-gray-600 dark:text-gray-400">Categoría</dt><dd>{ticket.categoria.nombre}</dd></div>
              <div><dt className="text-gray-600 dark:text-gray-400">Solicitante</dt><dd>{ticket.solicitante.nombre}</dd></div>
              <div><dt className="text-gray-600 dark:text-gray-400">Responsable</dt><dd>{ticket.responsable?.nombre || "Sin asignar"}</dd></div>
            </dl>
          </Card>
          {isEditing && (
            <Card>
              <CardTitle>Clasificación</CardTitle>
              <div className="space-y-4">
                <label className="block text-sm">Estado
                  <select value={formData.id_estado} onChange={(event) => setFormData({ ...formData, id_estado: Number(event.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700">
                    <option value={1}>ABIERTO</option>
                    <option value={2}>ASIGNADO</option>
                    <option value={3}>EN_PROCESO</option>
                    <option value={4}>PENDIENTE</option>
                    <option value={5}>RESUELTO</option>
                    <option value={6}>CERRADO</option>
                  </select>
                </label>
                <label className="block text-sm">Prioridad
                  <select value={formData.id_prioridad} onChange={(event) => setFormData({ ...formData, id_prioridad: Number(event.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700">
                    <option value={1}>BAJA</option>
                    <option value={2}>MEDIA</option>
                    <option value={3}>ALTA</option>
                  </select>
                </label>
              </div>
            </Card>
          )}
          {!isEditing && <Button className="w-full" variant="secondary" onClick={() => setIsEditing(true)}>Editar Ticket</Button>}
        </div>
      </div>
    </div>
  );
}
