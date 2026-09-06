import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),

  // Usuario routes
  route("usuario/dashboard", "routes/usuario/dashboard.tsx"),
  route("usuario/tickets", "routes/usuario/tickets.tsx"),
  route("usuario/tickets/:id", "routes/usuario/tickets.$id.tsx"),
  route("usuario/tickets/nuevo", "routes/usuario/tickets.new.tsx"),
  route("usuario/notificaciones", "routes/usuario/notificaciones.tsx"),
  route("usuario/perfil", "routes/usuario/perfil.tsx"),

  // Técnico routes
  route("tecnico/dashboard", "routes/tecnico/dashboard.tsx"),
  route("tecnico/asignados", "routes/tecnico/asignados.tsx"),
  route("tecnico/cola", "routes/tecnico/cola.tsx"),
  route("tecnico/tickets/:id", "routes/tecnico/tickets.$id.tsx"),
  route("tecnico/pendientes", "routes/tecnico/pendientes.tsx"),
  route("tecnico/resueltos", "routes/tecnico/resueltos.tsx"),
  route("tecnico/notificaciones", "routes/tecnico/notificaciones.tsx"),
  route("tecnico/perfil", "routes/tecnico/perfil.tsx"),

  // Admin routes
  route("admin/dashboard", "routes/admin/dashboard.tsx"),
  route("admin/tickets", "routes/admin/tickets.tsx"),
  route("admin/tickets/:id", "routes/admin/tickets.$id.tsx"),
  route("admin/usuarios", "routes/admin/usuarios.tsx"),
  route("admin/areas", "routes/admin/areas.tsx"),
  route("admin/categorias", "routes/admin/categorias.tsx"),
  route("admin/reportes", "routes/admin/reportes.tsx"),
  route("admin/configuracion", "routes/admin/configuracion.tsx"),
  route("admin/perfil", "routes/admin/perfil.tsx"),
] satisfies RouteConfig;
