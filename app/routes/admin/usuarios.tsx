import type { Route } from "./+types/usuarios";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useState, useEffect } from "react";
import { usersService, type UserItem, type RoleItem, type AreaItem } from "../../services/users.service";
import { Toast } from "../../components/common/Alert";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Gestionar Usuarios - SITTI" }];
};

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [filterRole, setFilterRole] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form states
  const [formNombre, setFormNombre] = useState("");
  const [formCorreo, setFormCorreo] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRolId, setFormRolId] = useState<number>(0);
  const [formAreaId, setFormAreaId] = useState<number>(0);
  const [formActivo, setFormActivo] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, metaRes] = await Promise.all([
        usersService.getUsers(),
        usersService.getMeta(),
      ]);

      if (usersRes.success) {
        setUsers(usersRes.usuarios);
      }
      if (metaRes.success) {
        setRoles(metaRes.roles);
        setAreas(metaRes.areas);
        if (metaRes.roles.length > 0) setFormRolId(metaRes.roles[0].id_rol);
        if (metaRes.areas.length > 0) setFormAreaId(metaRes.areas[0].id_area);
      }
    } catch (err: any) {
      console.error("Error loading users data:", err);
      setError(err.message || "Error al cargar usuarios desde el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    // Role filter
    const roleNormalized = u.rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let matchesRole = true;
    if (filterRole === "usuario") {
      matchesRole = roleNormalized.includes("usuario");
    } else if (filterRole === "técnico") {
      matchesRole = roleNormalized.includes("tecnic");
    } else if (filterRole === "administrador") {
      matchesRole = roleNormalized.includes("admin");
    }

    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.nombre.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
      u.area.toLowerCase().includes(q) ||
      u.rol.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormNombre("");
    setFormCorreo("");
    setFormPassword("");
    setFormActivo(true);
    if (roles.length > 0) setFormRolId(roles[0].id_rol);
    if (areas.length > 0) setFormAreaId(areas[0].id_area);
    setIsCreateOpen(true);
  };

  // Create User Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formCorreo.trim() || !formRolId || !formAreaId) {
      setToast({ message: "Por favor completa todos los campos requeridos", type: "error" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await usersService.createUser({
        nombre: formNombre.trim(),
        correo: formCorreo.trim(),
        password: formPassword.trim() || "password123",
        id_rol: formRolId,
        id_area: formAreaId,
        activo: formActivo,
      });

      if (res.success) {
        setUsers((prev) => [res.usuario, ...prev]);
        setToast({ message: "Usuario registrado con éxito", type: "success" });
        setIsCreateOpen(false);
      }
    } catch (err: any) {
      setToast({ message: err.message || "Error al crear usuario", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormNombre(user.nombre);
    setFormCorreo(user.correo);
    setFormPassword("");
    setFormRolId(user.id_rol);
    setFormAreaId(user.id_area);
    setFormActivo(user.activo);
    setIsEditOpen(true);
  };

  // Edit User Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSubmitting(true);
      const res = await usersService.updateUser(editingUser.id_usuario, {
        nombre: formNombre.trim(),
        correo: formCorreo.trim(),
        password: formPassword.trim() || undefined,
        id_rol: formRolId,
        id_area: formAreaId,
        activo: formActivo,
      });

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id_usuario === editingUser.id_usuario ? res.usuario : u))
        );
        setToast({ message: "Usuario actualizado correctamente", type: "success" });
        setIsEditOpen(false);
        setEditingUser(null);
      }
    } catch (err: any) {
      setToast({ message: err.message || "Error al actualizar usuario", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar/desactivar al usuario "${user.nombre}"?`)) {
      return;
    }

    try {
      const res = await usersService.deleteUser(user.id_usuario);
      if (res.success) {
        if (res.softDeleted) {
          // Si fue desactivado por tener tickets asociados
          setUsers((prev) =>
            prev.map((u) => (u.id_usuario === user.id_usuario ? { ...u, activo: false } : u))
          );
          setToast({
            message: "El usuario tiene tickets asociados; ha sido desactivado.",
            type: "success",
          });
        } else {
          // Si fue eliminado físicamente
          setUsers((prev) => prev.filter((u) => u.id_usuario !== user.id_usuario));
          setToast({ message: "Usuario eliminado exitosamente", type: "success" });
        }
      }
    } catch (err: any) {
      setToast({ message: err.message || "Error al eliminar usuario", type: "error" });
    }
  };

  // Count role breakdown
  const counts = {
    todos: users.length,
    usuario: users.filter((u) =>
      u.rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes("usuario")
    ).length,
    técnico: users.filter((u) =>
      u.rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes("tecnic")
    ).length,
    administrador: users.filter((u) =>
      u.rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes("admin")
    ).length,
  };

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3500}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestionar Usuarios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra los accesos, roles y departamentos de los usuarios del sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Usuario
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Role Tabs */}
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            {[
              { value: "todos", label: "Todos", count: counts.todos },
              { value: "usuario", label: "Usuarios", count: counts.usuario },
              { value: "técnico", label: "Técnicos", count: counts.técnico },
              { value: "administrador", label: "Administradores", count: counts.administrador },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterRole(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filterRole === tab.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    filterRole === tab.value
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Buscar nombre, correo o área..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-600">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      <Card>
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            Cargando usuarios de la base de datos...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No se encontraron usuarios con los criterios de búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Rol
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Área / Depto.
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Estado
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id_usuario} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">
                      #{user.id_usuario}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {user.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {user.correo}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.rol.toLowerCase().includes("admin")
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                            : user.rol.toLowerCase().includes("tecnic")
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {user.area || "Sin área"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.activo
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {user.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(user)}
                          title="Editar usuario"
                        >
                          ✏️ Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          title="Eliminar o desactivar usuario"
                        >
                          🗑️ Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE USER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Crear Nuevo Usuario
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Fernanda Morales"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@sitti.com"
                  value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña (Opcional, defecto: password123)
                </label>
                <input
                  type="password"
                  placeholder="password123"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol *
                  </label>
                  <select
                    value={formRolId}
                    onChange={(e) => setFormRolId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id_rol} value={r.id_rol}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Área / Departamento *
                  </label>
                  <select
                    value={formAreaId}
                    onChange={(e) => setFormAreaId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {areas.map((a) => (
                      <option key={a.id_area} value={a.id_area}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="createActivo"
                  checked={formActivo}
                  onChange={(e) => setFormActivo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="createActivo" className="text-sm text-gray-700 dark:text-gray-300">
                  Usuario Activo (Permite iniciar sesión)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar Usuario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Modificar Usuario #{editingUser.id_usuario}
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nueva Contraseña (Dejar en blanco para conservar actual)
                </label>
                <input
                  type="password"
                  placeholder="Nueva contraseña opcional"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol *
                  </label>
                  <select
                    value={formRolId}
                    onChange={(e) => setFormRolId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id_rol} value={r.id_rol}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Área / Departamento *
                  </label>
                  <select
                    value={formAreaId}
                    onChange={(e) => setFormAreaId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {areas.map((a) => (
                      <option key={a.id_area} value={a.id_area}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editActivo"
                  checked={formActivo}
                  onChange={(e) => setFormActivo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="editActivo" className="text-sm text-gray-700 dark:text-gray-300">
                  Usuario Activo
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Actualizar Usuario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
