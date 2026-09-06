import type { Route } from "./+types/dashboard";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Dashboard - Admin - SITTI" }];
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getAllTickets();
        setTickets(response.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar tickets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  if (!user) return null;

  // Calcular estadísticas
  const abiertos = tickets.filter((t) => t.estado.nombre === "ABIERTO").length;
  const asignados = tickets.filter((t) => t.estado.nombre === "ASIGNADO").length;
  const enProceso = tickets.filter((t) => t.estado.nombre === "EN_PROCESO").length;
  const resueltos = tickets.filter((t) => t.estado.nombre === "RESUELTO").length;

  const stats = [
    { label: "Tickets Totales", value: tickets.length, color: "blue" },
    { label: "Abiertos", value: abiertos, color: "red" },
    { label: "Asignados", value: asignados, color: "purple" },
    { label: "En Proceso", value: enProceso, color: "yellow" },
  ];

  const getStateColor = (estado: string) => {
    switch (estado) {
      case "ABIERTO":
        return "red";
      case "ASIGNADO":
        return "blue";
      case "EN_PROCESO":
        return "yellow";
      case "RESUELTO":
        return "green";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "red";
      case "MEDIA":
        return "yellow";
      case "BAJA":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Panel de control del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/tickets">
            <Button variant="secondary">Ver todos</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Todos los Tickets */}
      <Card>
        <CardTitle>Todos los Tickets del Sistema</CardTitle>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Cargando tickets...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No hay tickets en el sistema</p>
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
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
                    Área
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Solicitante
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Prioridad
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id_ticket}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400">
                      {ticket.folio}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {ticket.titulo}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.area.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.solicitante.nombre}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={getStateColor(ticket.estado.nombre)}>
                        {ticket.estado.nombre}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={getPriorityColor(ticket.prioridad.nombre)}>
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/admin/tickets/${ticket.id_ticket}`}>
                        <Button className="text-xs py-1 px-2">Ver</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
