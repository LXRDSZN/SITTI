import { api } from './api.js';

export interface Ticket {
  id_ticket: number;
  folio: string;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_cierre?: string;
  solicitante: {
    id_usuario: number;
    nombre: string;
    correo: string;
  };
  responsable?: {
    id_usuario: number;
    nombre: string;
    correo: string;
  };
  area: {
    id_area: number;
    nombre: string;
  };
  categoria: {
    id_categoria: number;
    nombre: string;
  };
  prioridad: {
    id_prioridad: number;
    nombre: string;
  };
  estado: {
    id_estado: number;
    nombre: string;
  };
}

export const ticketsService = {
  async getAllTickets(): Promise<{ tickets: Ticket[] }> {
    return api.get('/tickets');
  },

  async getMyTickets(): Promise<{ tickets: Ticket[] }> {
    return api.get('/tickets/my-tickets');
  },

  async getTicketById(id: number): Promise<{ ticket: Ticket }> {
    return api.get(`/tickets/${id}`);
  },

  async createTicket(data: {
    titulo: string;
    descripcion: string;
    id_area: number;
    id_categoria: number;
    id_prioridad: number;
  }): Promise<{ ticket: Ticket }> {
    return api.post('/tickets', data);
  },

  async updateTicket(
    id: number,
    data: Partial<{
      titulo: string;
      descripcion: string;
      id_responsable: number;
      id_prioridad: number;
      id_estado: number;
    }>
  ): Promise<{ ticket: Ticket }> {
    return api.put(`/tickets/${id}`, data);
  },

  async deleteTicket(id: number): Promise<{ success: boolean }> {
    return api.delete(`/tickets/${id}`);
  },
};
