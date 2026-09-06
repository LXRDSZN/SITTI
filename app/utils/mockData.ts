import type { User, Ticket, Area, Category } from "../types/user";

// Mock Users by Role
export const mockUsers: Record<string, User> = {
  usuario: {
    id: "user-1",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@company.com",
    role: "usuario",
    department: "IT Support",
    phone: "+34 123 456 789",
  },
  técnico: {
    id: "tech-1",
    name: "María García",
    email: "maria.garcia@company.com",
    role: "técnico",
    department: "Technical Support",
    phone: "+34 987 654 321",
  },
  administrador: {
    id: "admin-1",
    name: "Juan López",
    email: "juan.lopez@company.com",
    role: "administrador",
    department: "Administration",
    phone: "+34 555 666 777",
  },
};

// Mock Areas
export const mockAreas: Area[] = [
  {
    id: "area-1",
    name: "Infraestructura",
    description: "Gestión de servidores y red",
    manager: "tech-1",
  },
  {
    id: "area-2",
    name: "Aplicaciones",
    description: "Soporte de aplicaciones empresariales",
    manager: "tech-2",
  },
  {
    id: "area-3",
    name: "Soporte de Usuario",
    description: "Soporte técnico general",
    manager: "tech-3",
  },
  {
    id: "area-4",
    name: "Seguridad",
    description: "Gestión de seguridad y permisos",
    manager: "admin-1",
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Hardware",
    description: "Problemas de hardware",
    area: "area-1",
  },
  {
    id: "cat-2",
    name: "Red",
    description: "Problemas de conectividad",
    area: "area-1",
  },
  {
    id: "cat-3",
    name: "Software",
    description: "Problemas de software",
    area: "area-2",
  },
  {
    id: "cat-4",
    name: "Email",
    description: "Problemas de correo electrónico",
    area: "area-3",
  },
  {
    id: "cat-5",
    name: "Acceso",
    description: "Problemas de acceso y permisos",
    area: "area-4",
  },
  {
    id: "cat-6",
    name: "Contraseña",
    description: "Restablecimiento de contraseña",
    area: "area-3",
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    title: "Mi laptop no enciende",
    description:
      "Cuando presiono el botón de encendido, no sucede nada. El cargador está conectado.",
    status: "abierto",
    priority: "alta",
    createdBy: "user-1",
    assignedTo: "tech-1",
    area: "area-1",
    category: "cat-1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-2",
    title: "No puedo acceder a la red WiFi",
    description: "Aparece el mensaje de contraseña incorrecta pero es la correcta",
    status: "en-progreso",
    priority: "media",
    createdBy: "user-2",
    assignedTo: "tech-2",
    area: "area-1",
    category: "cat-2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-3",
    title: "Aplicación de reportes no abre",
    description: "Error: Unable to load module. Código de error: ERR_001",
    status: "en-progreso",
    priority: "alta",
    createdBy: "user-1",
    assignedTo: "tech-1",
    area: "area-2",
    category: "cat-3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-4",
    title: "No recibo correos",
    description:
      "Llevo 3 días sin recibir correos en mi bandeja de entrada",
    status: "resuelto",
    priority: "urgente",
    createdBy: "user-3",
    assignedTo: "tech-3",
    area: "area-3",
    category: "cat-4",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-5",
    title: "Necesito acceso a carpeta compartida",
    description: "Se me denió el acceso a \\\\servidor\\proyectos",
    status: "resuelto",
    priority: "media",
    createdBy: "user-4",
    assignedTo: "tech-1",
    area: "area-4",
    category: "cat-5",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-6",
    title: "Olvidé mi contraseña",
    description: "Necesito restablecer mi contraseña de Windows",
    status: "resuelto",
    priority: "baja",
    createdBy: "user-5",
    assignedTo: "tech-3",
    area: "area-3",
    category: "cat-6",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-7",
    title: "Impresora no funciona",
    description: "La impresora de la tercera planta no imprime correctamente",
    status: "abierto",
    priority: "baja",
    createdBy: "user-6",
    area: "area-1",
    category: "cat-1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-8",
    title: "Actualización de software requerida",
    description: "Necesito que instalen la versión 5.0 de AutoCAD",
    status: "abierto",
    priority: "media",
    createdBy: "user-7",
    assignedTo: "tech-2",
    area: "area-2",
    category: "cat-3",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Get tickets by assignee
export function getTicketsByTechnician(technicianId: string): Ticket[] {
  return mockTickets.filter((t) => t.assignedTo === technicianId);
}

// Get unassigned tickets
export function getUnassignedTickets(): Ticket[] {
  return mockTickets.filter((t) => !t.assignedTo);
}

// Get user's tickets
export function getUserTickets(userId: string): Ticket[] {
  return mockTickets.filter((t) => t.createdBy === userId);
}

// Get tickets by status
export function getTicketsByStatus(
  status: Ticket["status"]
): Ticket[] {
  return mockTickets.filter((t) => t.status === status);
}
