import { api } from "./api";

export interface Comment {
  id_comentario: number;
  id_ticket: number;
  id_usuario: number;
  comentario: string;
  fecha: string;
  usuario: {
    nombre: string;
    correo: string;
  };
}

export const commentsService = {
  async getByTicket(ticketId: number): Promise<{ comentarios: Comment[] }> {
    return api.get(`/api/comentarios/ticket/${ticketId}`);
  },

  async create(ticketId: number, comentario: string): Promise<{ comentario: Comment }> {
    return api.post("/api/comentarios", {
      id_ticket: ticketId,
      comentario,
    });
  },

  async delete(commentId: number): Promise<{ success: boolean; message: string }> {
    return api.delete(`/api/comentarios/${commentId}`);
  },
};
