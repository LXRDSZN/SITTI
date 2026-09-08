import prisma from '../config/database.js';
import { createNotification } from '../controllers/notifications.controller.js';

export const getTickets = async (rol?: string, id_usuario?: number, id_area?: number) => {
  const where: any = {};

  const rolNormalized = rol ? rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  // Filtrar según el rol
  if (rolNormalized === 'usuario' && id_usuario) {
    // Usuario solo ve sus propios tickets
    where.id_solicitante = id_usuario;
  } else if (rolNormalized === 'tecnico' && id_area) {
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
  
  if (!estadoAbierto) {
    throw new Error('Estado ABIERTO no existe');
  }

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

  // Crear notificaciones para todos los técnicos activos
  try {
    const tecnicos = await prisma.usuario.findMany({
      where: {
        rol: {
          nombre: {
            in: ['Técnico', 'técnico', 'Tecnico', 'tecnico', 'TÉCNICO', 'TECNICO'],
            mode: 'insensitive',
          },
        },
        activo: true,
      },
      select: { id_usuario: true },
    });

    for (const tecnico of tecnicos) {
      await createNotification(
        tecnico.id_usuario,
        ticket.id_ticket,
        `📌 Nuevo ticket en ${ticket.area.nombre}`,
        `El usuario ${ticket.solicitante.nombre} ha creado el ticket ${ticket.folio}: "${ticket.titulo}"`,
        'ticket_creado'
      );
    }
  } catch (error) {
    console.error('Error creating technician notifications:', error);
  }

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
  // Obtener ticket antes de actualizar para detectar cambios
  const ticketAnterior = await prisma.ticket.findUnique({
    where: { id_ticket },
    include: { solicitante: true, estado: true },
  });

  if (!ticketAnterior) {
    throw new Error('Ticket no encontrado');
  }

  const ticket = await prisma.ticket.update({
    where: { id_ticket },
    data: {
      ...data,
      fecha_actualizacion: new Date(),
      // Si se resuelve, registrar fecha de cierre
      ...(data.id_estado && 
        (await prisma.estado.findUnique({ where: { id_estado: data.id_estado } }))?.nombre === 'RESUELTO'
        ? { fecha_cierre: new Date() }
        : {}),
    },
    include: {
      solicitante: { select: { id_usuario: true, nombre: true, correo: true } },
      responsable: { select: { id_usuario: true, nombre: true, correo: true } },
      area: true,
      categoria: true,
      prioridad: true,
      estado: true,
    },
  });

  // Crear notificaciones según los cambios
  if (data.id_responsable && data.id_responsable !== ticketAnterior.id_responsable) {
    // Notificar al usuario que su ticket fue asignado
    await createNotification(
      ticketAnterior.id_solicitante,
      id_ticket,
      `🔧 Ticket asignado`,
      `Tu ticket ${ticket.folio} "${ticket.titulo}" ha sido asignado a un técnico`,
      'ticket_asignado'
    );
  }

  // Detectar si el estado cambió a RESUELTO
  if (data.id_estado) {
    const nuevoEstado = await prisma.estado.findUnique({
      where: { id_estado: data.id_estado },
    });

    if (nuevoEstado?.nombre === 'RESUELTO' && ticketAnterior.estado.nombre !== 'RESUELTO') {
      // Notificar al usuario que su ticket fue resuelto
      await createNotification(
        ticketAnterior.id_solicitante,
        id_ticket,
        `✅ Ticket resuelto`,
        `Tu ticket ${ticket.folio} "${ticket.titulo}" ha sido resuelto`,
        'ticket_resuelto'
      );
    } else if (
      nuevoEstado?.nombre !== ticketAnterior.estado.nombre &&
      nuevoEstado?.nombre !== 'RESUELTO'
    ) {
      // Notificar actualización de estado
      await createNotification(
        ticketAnterior.id_solicitante,
        id_ticket,
        `📋 Ticket actualizado`,
        `Tu ticket ${ticket.folio} ahora está en estado: ${nuevoEstado?.nombre}`,
        'ticket_actualizado'
      );
    }
  }

  return ticket;
};

export const deleteTicket = async (id_ticket: number) => {
  await prisma.ticket.delete({ where: { id_ticket } });
  return { success: true };
};
