import type { Route } from "./+types/tickets.\$id";
import { mockTickets } from "../../utils/mockData";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `Ticket ${params.id} - SITTI` }];
};

export default function AdminTicketDetail({ params }: Route.ComponentProps) {
  const ticket = mockTickets.find((t) => t.id === params.id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {ticket.title}
        </h1>
        <div className="flex gap-3 mb-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Descripción</CardTitle>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ticket.description}
            </p>
          </Card>

          <Card>
            <CardTitle>Detalles Técnicos</CardTitle>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Área
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.area}
                </dd>
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
                  Creado por
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.createdBy}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400 font-medium">
                  Asignado a
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {ticket.assignedTo || "Sin asignar"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

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
              {ticket.resolvedAt && (
                <div>
                  <dt className="text-gray-600 dark:text-gray-400 font-medium">
                    Resuelto
                  </dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(ticket.resolvedAt).toLocaleDateString("es-ES")}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Button className="w-full" variant="secondary">
            Editar Ticket
          </Button>
          <Button className="w-full" variant="danger">
            Eliminar Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
