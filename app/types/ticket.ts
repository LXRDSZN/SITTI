export type TicketStatus = "abierto" | "en-progreso" | "resuelto" | "cerrado";
export type TicketPriority = "baja" | "media" | "alta" | "urgente";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: string;
  assignedTo?: string;
  area: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: string[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
