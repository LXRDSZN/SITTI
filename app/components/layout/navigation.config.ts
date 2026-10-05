export type UserRole = "usuario" | "técnico" | "administrador";

export interface NavItem {
  label: string;
  href: string;
}

export interface RoleNavConfig {
  primaryNav: NavItem[];
  secondaryNav?: NavItem[];
}

const navigationConfig: Record<UserRole, RoleNavConfig> = {
  usuario: {
    primaryNav: [
      { label: "Dashboard", href: "/usuario/dashboard" },
      { label: "Mis Tickets", href: "/usuario/tickets" },
      { label: "Crear Ticket", href: "/usuario/tickets/nuevo" },
      { label: "Notificaciones", href: "/usuario/notificaciones" },
      { label: "Perfil", href: "/usuario/perfil" },
    ],
  },
  técnico: {
    primaryNav: [
      { label: "Dashboard", href: "/tecnico/dashboard" },
      { label: "Asignados", href: "/tecnico/asignados" },
      { label: "Cola", href: "/tecnico/cola" },
      { label: "Pendientes", href: "/tecnico/pendientes" },
      { label: "Resueltos", href: "/tecnico/resueltos" },
      { label: "Notificaciones", href: "/tecnico/notificaciones" },
      { label: "Perfil", href: "/tecnico/perfil" },
    ],
  },
  administrador: {
    primaryNav: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Tickets", href: "/admin/tickets" },
      { label: "Usuarios", href: "/admin/usuarios" },
      { label: "Áreas", href: "/admin/areas" },
      { label: "Categorías", href: "/admin/categorias" },
      { label: "Reportes", href: "/admin/reportes" },
      { label: "Notificaciones", href: "/admin/notificaciones" },
      { label: "Perfil", href: "/admin/perfil" },
    ],
  },
};

export function getNavigation(role: UserRole): RoleNavConfig {
  return navigationConfig[role] || navigationConfig.usuario;
}
