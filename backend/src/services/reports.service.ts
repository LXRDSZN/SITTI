import prisma from '../config/database.js';

export interface ReportFilters {
  desde?: string;
  hasta?: string;
  id_area?: number;
  id_estado?: number;
  id_prioridad?: number;
}

const toStartOfDay = (value: string) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toEndOfDay = (value: string) => {
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getReport = async (filters: ReportFilters) => {
  const fechaCreacion: { gte?: Date; lte?: Date } = {};

  if (filters.desde) {
    const desde = toStartOfDay(filters.desde);
    if (!desde) throw new Error('La fecha inicial no es válida');
    fechaCreacion.gte = desde;
  }

  if (filters.hasta) {
    const hasta = toEndOfDay(filters.hasta);
    if (!hasta) throw new Error('La fecha final no es válida');
    fechaCreacion.lte = hasta;
  }

  if (fechaCreacion.gte && fechaCreacion.lte && fechaCreacion.gte > fechaCreacion.lte) {
    throw new Error('La fecha inicial no puede ser posterior a la fecha final');
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(Object.keys(fechaCreacion).length > 0 ? { fecha_creacion: fechaCreacion } : {}),
      ...(filters.id_area ? { id_area: filters.id_area } : {}),
      ...(filters.id_estado ? { id_estado: filters.id_estado } : {}),
      ...(filters.id_prioridad ? { id_prioridad: filters.id_prioridad } : {}),
    },
    select: {
      id_ticket: true,
      folio: true,
      fecha_creacion: true,
      fecha_cierre: true,
      area: { select: { nombre: true } },
      categoria: { select: { nombre: true } },
      prioridad: { select: { nombre: true } },
      estado: { select: { nombre: true } },
      responsable: { select: { nombre: true } },
    },
    orderBy: { fecha_creacion: 'desc' },
  });

  const countBy = (getKey: (ticket: (typeof tickets)[number]) => string) => {
    const counts = new Map<string, number>();
    for (const ticket of tickets) {
      const key = getKey(ticket);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts, ([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre));
  };

  const resolvedTickets = tickets.filter((ticket) => ticket.fecha_cierre);
  const totalResolutionHours = resolvedTickets.reduce((total, ticket) => {
    return total + (ticket.fecha_cierre!.getTime() - ticket.fecha_creacion.getTime()) / 3600000;
  }, 0);
  const [estados, prioridades, areas, categorias] = await Promise.all([
    prisma.estado.findMany({ orderBy: { nombre: 'asc' }, select: { id_estado: true, nombre: true } }),
    prisma.prioridad.findMany({ orderBy: { nombre: 'asc' }, select: { id_prioridad: true, nombre: true } }),
    prisma.area.findMany({ orderBy: { nombre: 'asc' }, select: { id_area: true, nombre: true } }),
    prisma.categoria.findMany({ orderBy: { nombre: 'asc' }, select: { id_categoria: true, nombre: true } }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    filtros: filters,
    resumen: {
      total: tickets.length,
      abiertos: tickets.filter((ticket) => ticket.estado.nombre === 'ABIERTO').length,
      asignados: tickets.filter((ticket) => ticket.estado.nombre === 'ASIGNADO').length,
      enProceso: tickets.filter((ticket) => ticket.estado.nombre === 'EN_PROCESO').length,
      resueltos: tickets.filter((ticket) => ticket.estado.nombre === 'RESUELTO').length,
      sinResponsable: tickets.filter((ticket) => !ticket.responsable).length,
      porcentajeResolucion: tickets.length
        ? Number(((resolvedTickets.length / tickets.length) * 100).toFixed(1))
        : 0,
      tiempoPromedioHoras: resolvedTickets.length
        ? Number((totalResolutionHours / resolvedTickets.length).toFixed(1))
        : 0,
    },
    porEstado: countBy((ticket) => ticket.estado.nombre),
    porPrioridad: countBy((ticket) => ticket.prioridad.nombre),
    porArea: countBy((ticket) => ticket.area.nombre),
    porCategoria: countBy((ticket) => ticket.categoria.nombre),
    porTecnico: countBy((ticket) => ticket.responsable?.nombre || 'Sin asignar'),
    opciones: { estados, prioridades, areas, categorias },
    tickets: tickets.map((ticket) => ({
      folio: ticket.folio,
      fechaCreacion: ticket.fecha_creacion.toISOString(),
      fechaCierre: ticket.fecha_cierre?.toISOString() || '',
      area: ticket.area.nombre,
      categoria: ticket.categoria.nombre,
      prioridad: ticket.prioridad.nombre,
      estado: ticket.estado.nombre,
      responsable: ticket.responsable?.nombre || 'Sin asignar',
    })),
  };
};