import type { Route } from "./+types/dashboard";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { ticketsService, type Ticket } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Dashboard - Técnico - SITTI" }];
};

type StateFilter = "TODOS" | "ABIERTO" | "ASIGNADO" | "EN_PROCESO" | "RESUELTO";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateFilter>("TODOS");

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

  // Filtrar tickets por estado seleccionado
  const filteredTickets = selectedState === "TODOS" 
    ? tickets 
    : tickets.filter((t) => t.estado.nombre === selectedState);

  // Calcular estadísticas
  const abiertos = tickets.filter((t) => t.estado.nombre === "ABIERTO").length;
  const asignados = tickets.filter((t) => t.estado.nombre === "ASIGNADO").length;
  const enProceso = tickets.filter((t) => t.estado.nombre === "EN_PROCESO").length;
  const resueltos = tickets.filter((t) => t.estado.nombre === "RESUELTO").length;

  const stats = [
    { label: "Abiertos", value: abiertos, color: "red", state: "ABIERTO" as StateFilter },
    { label: "Asignados", value: asignados, color: "blue", state: "ASIGNADO" as StateFilter },
    { label: "En Progreso", value: enProceso, color: "yellow", state: "EN_PROCESO" as StateFilter },
    { label: "Resueltos", value: resueltos, color: "green", state: "RESUELTO" as StateFilter },
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
            Dashboard Técnico
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {user.name} • {user.department}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Ver todos los tickets de todas las áreas organizados por estado
          </p>
        </div>
      </div>

      {/* Stats Grid - Clickeable para filtrar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Botón "TODOS" */}
        <button
          onClick={() => setSelectedState("TODOS")}
          className={`p-4 rounded-lg transition-all ${
            selectedState === "TODOS"
              ? "bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-600"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400"
          }`}
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Todos los Tickets</p>
          <p className="text-4xl font-bold text-indigo-600">{tickets.length}</p>
        </button>

        {/* Stats individuales */}
        {stats.map((stat) => (
          <button
            key={stat.state}
            onClick={() => setSelectedState(stat.state)}
            className={`p-4 rounded-lg transition-all ${
              selectedState === stat.state
                ? `bg-${stat.color}-100 dark:bg-${stat.color}-900/30 border-2 border-${stat.color}-600`
                : `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-${stat.color}-400`
            }`}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </button>
        ))}
      </div>

      {/* Tickets por Estado */}
      <Card>
        <CardTitle>
          {selectedState === "TODOS"
            ? "Todos los tickets"
            : `Tickets ${selectedState}`}
        </CardTitle>

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

        {!loading && !error && filteredTickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No hay tickets con estado "{selectedState}"
            </p>
          </div>
        )}

        {!loading && !error && filteredTickets.length > 0 && (
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
                    Categoría
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
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id_ticket}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      {ticket.folio}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ticket.titulo}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {ticket.descripcion.substring(0, 40)}...
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {ticket.area.nombre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.solicitante.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ticket.categoria.nombre}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={getPriorityColor(ticket.prioridad.nombre)}>
                        {ticket.prioridad.nombre}
                      </PriorityBadge>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/tecnico/tickets/${ticket.id_ticket}`}>
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
