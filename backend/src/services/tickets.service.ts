import prisma from '../config/database.js';

export const getTickets = async (rol?: string, id_usuario?: number, id_area?: number) => {
  const where: any = {};

  // Filtrar según el rol
  if (rol === 'usuario' && id_usuario) {
    // Usuario solo ve sus propios tickets
    where.id_solicitante = id_usuario;
  } else if (rol === 'técnico' && id_area) {
    // Técnico ve tickets de su área
    where.id_area = id_area;
  }
  // Admin ve todos (sin filtro)

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      solicitante: { select: { id_usuario: true, nombre: true, correo: true } },
      responsable: { select: { id_usuario: true, nombre: true, correo: true } },
      area: true,
      categoria: true,
      prioridad: true,
      estado: true,
    },
    orderBy: { fecha_creacion: 'desc' },
  });

  return tickets;
};

export const getTicketById = async (id_ticket: number) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id_ticket },
    include: {
      solicitante: { select: { id_usuario: true, nombre: true, correo: true } },
      responsable: { select: { id_usuario: true, nombre: true, correo: true } },
      area: true,
      categoria: true,
      prioridad: true,
      estado: true,
      comentarios: {
        include: { usuario: { select: { nombre: true, correo: true } } },
        orderBy: { fecha: 'desc' },
      },
    },
  });

  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  return ticket;
};

export const createTicket = async (data: {
  titulo: string;
  descripcion: string;
  id_solicitante: number;
  id_area: number;
  id_categoria: number;
  id_prioridad: number;
}) => {
  // Generar folio automático
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id_ticket: 'desc' },
  });
  const nextNumber = (lastTicket?.id_ticket || 0) + 1;
  const folio = `TKT-${String(nextNumber).padStart(3, '0')}`;

  const estadoAbierto = await prisma.estado.findUnique({ where: { nombre: 'ABIERTO' } });

  const ticket = await prisma.ticket.create({
    data: {
      folio,
      titulo: data.titulo,
      descripcion: data.descripcion,
      id_solicitante: data.id_solicitante,
      id_area: data.id_area,
      id_categoria: data.id_categoria,
      id_prioridad: data.id_prioridad,
      id_estado: estadoAbierto.id_estado,
    },
    include: {
      solicitante: { select: { id_usuario: true, nombre: true, correo: true } },
      area: true,
      categoria: true,
      prioridad: true,
      estado: true,
    },
  });

  return ticket;
};

export const updateTicket = async (
  id_ticket: number,
  data: {
    titulo?: string;
    descripcion?: string;
    id_responsable?: number;
    id_prioridad?: number;
    id_estado?: number;
  }
) => {
  const ticket = await prisma.ticket.update({
    where: { id_ticket },
    data,
    include: {
      solicitante: { select: { id_usuario: true, nombre: true, correo: true } },
      responsable: { select: { id_usuario: true, nombre: true, correo: true } },
      area: true,
      categoria: true,
      prioridad: true,
      estado: true,
    },
  });

  return ticket;
};

export const deleteTicket = async (id_ticket: number) => {
  await prisma.ticket.delete({ where: { id_ticket } });
  return { success: true };
};
