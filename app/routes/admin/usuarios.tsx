import type { Route } from "./+types/usuarios";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Usuarios - SITTI" }];
};

const mockAdminUsers = [
  {
    id: "user-1",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@company.com",
    role: "usuario",
    status: "activo",
    lastLogin: "2024-09-05",
  },
  {
    id: "tech-1",
    name: "María García",
    email: "maria.garcia@company.com",
    role: "técnico",
    status: "activo",
    lastLogin: "2024-09-06",
  },
  {
    id: "tech-2",
    name: "Pedro Martínez",
    email: "pedro.martinez@company.com",
    role: "técnico",
    status: "inactivo",
    lastLogin: "2024-08-30",
  },
  {
    id: "admin-1",
    name: "Juan López",
    email: "juan.lopez@company.com",
    role: "administrador",
    status: "activo",
    lastLogin: "2024-09-06",
  },
];

export default function Users() {
  const [filterRole, setFilterRole] = useState<string>("todos");

  const filteredUsers =
    filterRole === "todos"
      ? mockAdminUsers
      : mockAdminUsers.filter((u) => u.role === filterRole);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionar Usuarios
        </h1>
        <Button>Crear Usuario</Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "todos", label: "Todos" },
            { value: "usuario", label: "Usuarios" },
            { value: "técnico", label: "Técnicos" },
            { value: "administrador", label: "Administradores" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterRole(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterRole === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
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
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Último Login
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 capitalize text-gray-700 dark:text-gray-300">
                    {user.role}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "activo"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {user.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {user.lastLogin}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                      <Button variant="danger" size="sm">
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
