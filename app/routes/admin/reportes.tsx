import type { Route } from "./+types/reportes";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import {
  reportsService,
  type ReportCount,
  type ReportData,
  type ReportFilters,
} from "../../services/reports.service";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Reportes - SITTI" }];
};

const today = new Date().toISOString().slice(0, 10);
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  .toISOString()
  .slice(0, 10);

const colors = ["bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-red-500", "bg-purple-500"];

function Distribution({ title, items }: { title: string; items: ReportCount[] }) {
  const total = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos para los filtros seleccionados.</p>
        )}
        {items.map((item, index) => (
          <div key={item.nombre} className="flex items-center gap-3">
            <span className="w-36 truncate text-sm font-medium text-gray-900 dark:text-white">
              {item.nombre}
            </span>
            <div className="h-7 flex-1 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full ${colors[index % colors.length]}`}
                style={{ width: `${total ? (item.cantidad / total) * 100 : 0}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm font-semibold text-gray-900 dark:text-white">
              {item.cantidad}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadCsv(report: ReportData) {
  const headers = ["Folio", "Fecha de creación", "Fecha de cierre", "Área", "Categoría", "Prioridad", "Estado", "Responsable"];
  const rows = report.tickets.map((ticket) => [
    ticket.folio,
    ticket.fechaCreacion,
    ticket.fechaCierre,
    ticket.area,
    ticket.categoria,
    ticket.prioridad,
    ticket.estado,
    ticket.responsable,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-sitti-${today}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    desde: firstDayOfMonth,
    hasta: today,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
  }, [isAuthenticated, isAuthLoading]);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reportsService.getReport(filters);
      setReport(response.report);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo generar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) void generateReport();
  }, [isAuthLoading, isAuthenticated]);

  const updateFilter = (key: keyof ReportFilters, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value === "" ? undefined : key.startsWith("id_") ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reportes</h1>
        <Button onClick={() => report && downloadCsv(report)} disabled={!report || isLoading}>
          Descargar CSV
        </Button>
      </div>

      <Card>
        <CardTitle>Filtros del reporte</CardTitle>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Desde
            <input type="date" value={filters.desde || ""} onChange={(event) => updateFilter("desde", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Hasta
            <input type="date" value={filters.hasta || ""} onChange={(event) => updateFilter("hasta", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Área
            <select value={filters.id_area || ""} onChange={(event) => updateFilter("id_area", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
              <option value="">Todas</option>
              {report?.opciones.areas.map((area) => <option key={area.id_area} value={area.id_area}>{area.nombre}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Estado
            <select value={filters.id_estado || ""} onChange={(event) => updateFilter("id_estado", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
              <option value="">Todos</option>
              {report?.opciones.estados.map((estado) => <option key={estado.id_estado} value={estado.id_estado}>{estado.nombre}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Prioridad
            <select value={filters.id_prioridad || ""} onChange={(event) => updateFilter("id_prioridad", event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
              <option value="">Todas</option>
              {report?.opciones.prioridades.map((prioridad) => <option key={prioridad.id_prioridad} value={prioridad.id_prioridad}>{prioridad.nombre}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={generateReport} disabled={isLoading}>
            {isLoading ? "Generando..." : "Generar reporte"}
          </Button>
        </div>
      </Card>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {report && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              ["Total de tickets", report.resumen.total],
              ["Abiertos", report.resumen.abiertos],
              ["Resueltos", report.resumen.resueltos],
              ["Promedio resolución", `${report.resumen.tiempoPromedioHoras} h`],
            ].map(([label, value]) => (
              <Card key={label} className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{value}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Distribution title="Tickets por estado" items={report.porEstado} />
            <Distribution title="Tickets por prioridad" items={report.porPrioridad} />
            <Distribution title="Tickets por área" items={report.porArea} />
            <Distribution title="Tickets por categoría" items={report.porCategoria} />
            <Distribution title="Tickets por técnico" items={report.porTecnico} />
          </div>
        </>
      )}
    </div>
  );
}
