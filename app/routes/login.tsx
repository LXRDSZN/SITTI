import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/login";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login - SITTI" }];
};

const DEMO_USERS = [
  {
    email: "usuario.ventas@sitti.com",
    password: "password123",
    name: "Juan Pérez (Usuario)",
    role: "usuario",
    area: "Ventas",
  },
  {
    email: "tecnico@sitti.com",
    password: "password123",
    name: "Carlos López (Técnico)",
    role: "técnico",
    area: "Sistemas",
  },
  {
    email: "admin@sitti.com",
    password: "password123",
    name: "Gerente Sistemas",
    role: "administrador",
    area: "Administración",
  },
];

const getRoleRoute = (role: string) => {
  const roleLower = role.toLowerCase();
  if (roleLower.includes("usuario")) return "/usuario/dashboard";
  if (roleLower.includes("técnico")) return "/tecnico/dashboard";
  if (roleLower.includes("admin")) return "/admin/dashboard";
  return "/usuario/dashboard";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Redirigir después de login exitoso
  React.useEffect(() => {
    if (user) {
      const route = getRoleRoute(user.role);
      navigate(route);
    }
  }, [user, navigate]);

  const fillDemo = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SITTI</h1>
          <p className="text-blue-100">
            Sistema de Gestión de Tickets
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="usuario@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Contraseña"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Demo Users */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
              Usuarios de demo (Contraseña: password123)
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => fillDemo(user)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email} • {user.area}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
