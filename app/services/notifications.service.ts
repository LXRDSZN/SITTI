import { api } from './api';

export interface Notification {
  id_notificacion: number;
  id_usuario: number;
  id_ticket: number;
  titulo: string;
  mensaje: string;
  tipo: 'ticket_resuelto' | 'ticket_asignado' | 'ticket_actualizado' | 'comentario';
  leido: boolean;
  fecha_creacion: string;
  fecha_lectura: string | null;
  ticket?: {
    id_ticket: number;
    folio: string;
    titulo: string;
  };
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  count: number;
  unreadCount: number;
}

class NotificationsService {
  async getNotifications(): Promise<NotificationsResponse> {
    return api.get<NotificationsResponse>('/api/notificaciones');
  }

  async markAsRead(id: number): Promise<{ success: boolean; message: string }> {
    return api.put<{ success: boolean; message: string }>(`/api/notificaciones/${id}/read`, {});
  }

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return api.put<{ success: boolean; message: string }>('/api/notificaciones/read-all', {});
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return api.delete<{ success: boolean; message: string }>(`/api/notificaciones/${id}`);
  }

  async deleteAll(): Promise<{ success: boolean; message: string }> {
    return api.delete<{ success: boolean; message: string }>('/api/notificaciones');
  }
}

export const notificationsService = new NotificationsService();
