import type { Route } from "./+types/reportes";
import { mockTickets } from "../../utils/mockData";
import { Card, CardTitle } from "../../components/common/Card";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Reportes - SITTI" }];
};

export default function Reports() {
  const totalTickets = mockTickets.length;
  const openTickets = mockTickets.filter((t) => t.status === "abierto").length;
  const resolvedTickets = mockTickets.filter(
    (t) => t.status === "resuelto"
  ).length;
  const avgResolutionTime = mockTickets
    .filter((t) => t.resolvedAt)
    .reduce((sum, t) => {
      if (t.resolvedAt) {
        const days = Math.floor(
          (new Date(t.resolvedAt).getTime() -
            new Date(t.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }
      return sum;
    }, 0);

  const stats = [
    { label: "Total de Tickets", value: totalTickets },
    { label: "Tickets Abiertos", value: openTickets },
    { label: "Tickets Resueltos", value: resolvedTickets },
    {
      label: "Tiempo Prom. Resolución",
      value: resolvedTickets > 0 ? Math.round(avgResolutionTime / resolvedTickets) + " días" : "N/A",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Reportes
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* By Priority */}
      <Card>
        <CardTitle>Tickets por Prioridad</CardTitle>
        <div className="space-y-3">
          {[
            {
              priority: "urgente",
              count: mockTickets.filter((t) => t.priority === "urgente").length,
              color: "red",
            },
            {
              priority: "alta",
              count: mockTickets.filter((t) => t.priority === "alta").length,
              color: "orange",
            },
            {
              priority: "media",
              count: mockTickets.filter((t) => t.priority === "media").length,
              color: "yellow",
            },
            {
              priority: "baja",
              count: mockTickets.filter((t) => t.priority === "baja").length,
              color: "green",
            },
          ].map((item) => (
            <div key={item.priority} className="flex items-center gap-4">
              <div className="w-32 capitalize font-medium text-gray-900 dark:text-white">
                {item.priority}
              </div>
              <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div
                  className={`h-full bg-${item.color}-500`}
                  style={{
                    width: `${((item.count / totalTickets) * 100).toFixed(0)}%`,
                  }}
                />
              </div>
              <div className="w-12 text-right font-medium text-gray-900 dark:text-white">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* By Status */}
      <Card>
        <CardTitle>Tickets por Estado</CardTitle>
        <div className="space-y-3">
          {[
            {
              status: "abierto",
              count: mockTickets.filter((t) => t.status === "abierto").length,
              color: "blue",
            },
            {
              status: "en-progreso",
              count: mockTickets.filter((t) => t.status === "en-progreso")
                .length,
              color: "yellow",
            },
            {
              status: "resuelto",
              count: mockTickets.filter((t) => t.status === "resuelto").length,
              color: "green",
            },
            {
              status: "cerrado",
              count: mockTickets.filter((t) => t.status === "cerrado").length,
              color: "gray",
            },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-4">
              <div className="w-32 capitalize font-medium text-gray-900 dark:text-white">
                {item.status.replace("-", " ")}
              </div>
              <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div
                  className={`h-full bg-${item.color}-500`}
                  style={{
                    width: `${((item.count / totalTickets) * 100).toFixed(0)}%`,
                  }}
                />
              </div>
              <div className="w-12 text-right font-medium text-gray-900 dark:text-white">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
