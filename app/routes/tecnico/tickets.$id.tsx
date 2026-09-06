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

export default function TechnicianTicketDetail({ params }: Route.ComponentProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>("");
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
        {/* Ticket Details and Work Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Descripción del Problema</CardTitle>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ticket.description}
            </p>
          </Card>

          {/* Work Log */}
          <Card>
            <CardTitle>Bitácora de Trabajo</CardTitle>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hay comentarios de trabajo aún
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Agregar Nota de Trabajo
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe lo que has hecho..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <Button className="mt-3" disabled={!comment.trim()}>
                  Agregar Nota
                </Button>
              </div>
            </div>
          </Card>

          {/* Status Update */}
          <Card>
            <CardTitle>Cambiar Estado</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "en-progreso", label: "En Progreso" },
                { value: "resuelto", label: "Resuelto" },
                { value: "cerrado", label: "Cerrado" },
              ].map((s) => (
                <Button
                  key={s.value}
                  variant={status === s.value ? "primary" : "secondary"}
                  onClick={() => setStatus(s.value)}
                  className="w-full"
                >
                  {s.label}
                </Button>
              ))}
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
                  ID
                </dt>
                <dd className="text-gray-900 dark:text-white font-mono">
                  {ticket.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Creado por
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.createdBy}
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
                  Última actualización
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(ticket.updatedAt).toLocaleDateString("es-ES")}
                </dd>
              </div>
            </dl>
          </Card>

          <Button className="w-full" disabled={!status}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
