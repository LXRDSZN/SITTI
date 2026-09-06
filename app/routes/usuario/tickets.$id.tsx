import type { Route } from "./+types/tickets.\$id";
import { mockTickets } from "../../utils/mockData";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useState } from "react";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `Ticket ${params.id} - SITTI` }];
};

export default function TicketDetail({ params }: Route.ComponentProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const ticket = mockTickets.find((t) => t.id === params.id);

  if (!ticket || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {ticket.title}
        </h1>
        <div className="flex gap-3 mb-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Descripción</CardTitle>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ticket.description}
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
                  ID del Ticket
                </dt>
                <dd className="text-gray-900 dark:text-white font-mono">
                  {ticket.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Área
                </dt>
                <dd className="text-gray-900 dark:text-white">{ticket.area}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Categoría
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.category}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Creado
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(ticket.createdAt).toLocaleDateString("es-ES")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Actualizado
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(ticket.updatedAt).toLocaleDateString("es-ES")}
                </dd>
              </div>
              {ticket.assignedTo && (
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">
                    Asignado a
                  </dt>
                  <dd className="text-gray-900 dark:text-white">
                    {ticket.assignedTo}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Button className="w-full" variant="secondary">
            Editar Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
