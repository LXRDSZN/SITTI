import { api } from './api.js';

export interface ReportFilters {
  desde?: string;
  hasta?: string;
  id_area?: number;
  id_estado?: number;
  id_prioridad?: number;
}

export interface ReportCount {
  nombre: string;
  cantidad: number;
}

export interface ReportData {
  generatedAt: string;
  filtros: ReportFilters;
  resumen: {
    total: number;
    abiertos: number;
    asignados: number;
    enProceso: number;
    resueltos: number;
    sinResponsable: number;
    porcentajeResolucion: number;
    tiempoPromedioHoras: number;
  };
  porEstado: ReportCount[];
  porPrioridad: ReportCount[];
  porArea: ReportCount[];
  porCategoria: ReportCount[];
  porTecnico: ReportCount[];
  opciones: {
    estados: Array<{ id_estado: number; nombre: string }>;
    prioridades: Array<{ id_prioridad: number; nombre: string }>;
    areas: Array<{ id_area: number; nombre: string }>;
    categorias: Array<{ id_categoria: number; nombre: string }>;
  };
  tickets: Array<{
    folio: string;
    fechaCreacion: string;
    fechaCierre: string;
    area: string;
    categoria: string;
    prioridad: string;
    estado: string;
    responsable: string;
  }>;
}

export interface ReportResponse {
  success: boolean;
  report: ReportData;
}

export const reportsService = {
  async getReport(filters: ReportFilters): Promise<ReportResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
    return api.get(`/api/reports?${params.toString()}`);
  },
};