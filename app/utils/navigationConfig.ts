import type { UserRole } from "../types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface RoleNavConfig {
  primaryNav: NavItem[];
  secondaryNav: NavItem[];
}

export const navigationConfigs: Record<UserRole, RoleNavConfig> = {
  usuario: {
    primaryNav: [
      { label: "Dashboard", href: "/usuario/dashboard", icon: "📊" },
      { label: "Mis Tickets", href: "/usuario/tickets", icon: "🎫" },
      { label: "Nuevo Ticket", href: "/usuario/tickets/nuevo", icon: "➕" },
      {
        label: "Notificaciones",
        href: "/usuario/notificaciones",
        icon: "🔔",
      },
    ],
    secondaryNav: [
      { label: "Perfil", href: "/usuario/perfil", icon: "👤" },
      { label: "Cerrar Sesión", href: "/login", icon: "🚪" },
    ],
  },
  técnico: {
    primaryNav: [
      { label: "Dashboard", href: "/tecnico/dashboard", icon: "📊" },
      { label: "Tickets Asignados", href: "/tecnico/asignados", icon: "🎯" },
      { label: "Cola de Trabajo", href: "/tecnico/cola", icon: "📋" },
      { label: "Tickets Pendientes", href: "/tecnico/pendientes", icon: "⏳" },
      { label: "Tickets Resueltos", href: "/tecnico/resueltos", icon: "✅" },
      {
        label: "Notificaciones",
        href: "/tecnico/notificaciones",
        icon: "🔔",
      },
    ],
    secondaryNav: [
      { label: "Perfil", href: "/tecnico/perfil", icon: "👤" },
      { label: "Cerrar Sesión", href: "/login", icon: "🚪" },
    ],
  },
  administrador: {
    primaryNav: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
      { label: "Todos los Tickets", href: "/admin/tickets", icon: "🎫" },
      { label: "Usuarios", href: "/admin/usuarios", icon: "👥" },
      { label: "Áreas", href: "/admin/areas", icon: "🏢" },
      { label: "Categorías", href: "/admin/categorias", icon: "📁" },
      { label: "Reportes", href: "/admin/reportes", icon: "📈" },
      { label: "Configuración", href: "/admin/configuracion", icon: "⚙️" },
    ],
    secondaryNav: [
      { label: "Perfil", href: "/admin/perfil", icon: "👤" },
      { label: "Cerrar Sesión", href: "/login", icon: "🚪" },
    ],
  },
};

export function getNavigation(role: UserRole): RoleNavConfig {
  return navigationConfigs[role];
}
