import type { Route } from "./+types/perfil";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { usersService } from "../../services/users.service";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Perfil - SITTI" }];
};

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Perfil actualizado correctamente.");
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  const [passwordData, setPasswordData] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
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
    setSuccessMessage("Perfil actualizado correctamente.");

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

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!passwordData.actual || !passwordData.nueva || !passwordData.confirmar) {
      setError("Completa todos los campos de contraseña.");
      return;
    }
    if (passwordData.nueva.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (passwordData.nueva !== passwordData.confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await usersService.updateUser(Number(user.id), {
        password: passwordData.nueva,
        currentPassword: passwordData.actual,
      });
      setPasswordData({ actual: "", nueva: "", confirmar: "" });
      setSuccessMessage("Contraseña actualizada correctamente.");
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cambiar la contraseña.",
      );
    } finally {
      setLoading(false);
    }
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
          message={successMessage}
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

          <Card>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Contraseña actual"
                value={passwordData.actual}
                onChange={(event) =>
                  setPasswordData((current) => ({ ...current, actual: event.target.value }))
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Nueva contraseña (mínimo 8 caracteres)"
                value={passwordData.nueva}
                onChange={(event) =>
                  setPasswordData((current) => ({ ...current, nueva: event.target.value }))
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={passwordData.confirmar}
                onChange={(event) =>
                  setPasswordData((current) => ({ ...current, confirmar: event.target.value }))
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:bg-gray-700 dark:text-white"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardTitle>Rol</CardTitle>
            <div className="text-center">
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-6 py-3 rounded-lg font-medium capitalize">
                {user.role}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Técnico de soporte
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
