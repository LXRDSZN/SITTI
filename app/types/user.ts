export type UserRole = "usuario" | "técnico" | "administrador";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Ticket types
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

// Area type
export interface Area {
  id: string;
  name: string;
  description: string;
  manager?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description: string;
  area: string;
}
