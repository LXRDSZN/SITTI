import type { Route } from "./+types/perfil";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { usersService } from "../../services/users.service";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Perfil Admin - SITTI" }];
};

export default function AdminProfile() {
  const { user, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.name,
        correo: user.email,
        telefono: user.phone || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.correo.trim()) {
      setError("El email es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      await usersService.updateUser(Number(user.id), {
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim() || null,
      });
      await checkAuth();
      setIsEditing(false);
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el perfil.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.name,
      correo: user.email,
      telefono: user.phone || "",
    });
    setError(null);
    setIsEditing(false);
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Mi Perfil
      </h1>

      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          title="Éxito"
          message="Perfil actualizado correctamente."
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardTitle>Información Personal</CardTitle>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        nombre: event.target.value,
                      }))
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        correo: event.target.value,
                      }))
                    }
                    disabled={!isEditing || loading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={user.department || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        telefono: event.target.value,
                      }))
                    }
                    disabled={!isEditing || loading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleEdit}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Admin Info */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Rol</CardTitle>
            <div className="text-center">
              <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-6 py-3 rounded-lg font-medium capitalize">
                {user.role}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Acceso completo al sistema
              </p>
            </div>
          </Card>

          <Card>
            <CardTitle>Permisos</CardTitle>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  Gestionar usuarios
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  Ver reportes
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  Configurar sistema
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  Gestionar áreas
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
