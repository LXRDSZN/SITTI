import type { Route } from "./+types/perfil";
import { useAuth } from "../../context/AuthContext";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/common/Alert";
import { useState, useEffect } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Perfil - SITTI" }];
};

const PROFILE_CHANGE_COOLDOWN = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    correo: user?.email || "",
    telefono: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });
  const [canChangeProfile, setCanChangeProfile] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);

  useEffect(() => {
    const lastChange = localStorage.getItem("lastProfileChange");
    if (lastChange) {
      const lastChangeDate = parseInt(lastChange);
      const timeSinceChange = Date.now() - lastChangeDate;
      
      if (timeSinceChange < PROFILE_CHANGE_COOLDOWN) {
        setCanChangeProfile(false);
        const daysRemaining = Math.ceil(
          (PROFILE_CHANGE_COOLDOWN - timeSinceChange) / (24 * 60 * 60 * 1000)
        );
        setDaysUntilChange(daysRemaining);
      }
    }
  }, []);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canChangeProfile) {
      setError(`No puedes cambiar tu perfil aún. Intenta en ${daysUntilChange} días.`);
      return;
    }

    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!formData.correo.trim()) {
      setError("El email es requerido");
      return;
    }

    try {
      setLoading(true);
      console.log("Actualizando perfil:", formData);
      localStorage.setItem("lastProfileChange", Date.now().toString());
      setCanChangeProfile(false);
      setDaysUntilChange(30);
      setSuccessMessage("Perfil actualizado correctamente. Podrás cambiar tu nombre nuevamente en 30 días.");
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordData.passwordActual.trim()) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }

    if (!passwordData.passwordNueva.trim()) {
      setError("Debes ingresar una contraseña nueva");
      return;
    }

    if (passwordData.passwordNueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (passwordData.passwordNueva !== passwordData.passwordConfirmar) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.passwordActual === passwordData.passwordNueva) {
      setError("La contraseña nueva no puede ser igual a la actual");
      return;
    }

    try {
      setLoading(true);
      console.log("Cambiando contraseña");
      setSuccessMessage("Contraseña cambiada correctamente");
      setSuccess(true);
      setIsChangingPassword(false);
      setPasswordData({
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: "",
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
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
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Información Personal</CardTitle>
            {!canChangeProfile && (
              <Alert
                type="warning"
                message={`Podrás cambiar tu nombre en ${daysUntilChange} días`}
              />
            )}
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Nombre {canChangeProfile ? "" : "(Bloqueado)"}
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    disabled={!isEditing || loading || !canChangeProfile}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email (No editable)
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  placeholder="(Opcional)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <Button 
                      type="submit" 
                      disabled={loading || !canChangeProfile}
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setFormData({
                          nombre: user.name,
                          correo: user.email,
                          telefono: user.phone || "",
                        });
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    disabled={!canChangeProfile}
                  >
                    {canChangeProfile ? "Editar Perfil" : "No puedes editar aún"}
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.passwordActual}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      passwordActual: e.target.value,
                    })
                  }
                  disabled={!isChangingPassword || loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Contraseña Nueva (Mínimo 8 caracteres)
                  </label>
                  <input
                    type="password"
                    value={passwordData.passwordNueva}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        passwordNueva: e.target.value,
                      })
                    }
                    disabled={!isChangingPassword || loading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordData.passwordConfirmar}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        passwordConfirmar: e.target.value,
                      })
                    }
                    disabled={!isChangingPassword || loading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isChangingPassword ? (
                  <>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Cambiando..." : "Cambiar Contraseña"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          passwordActual: "",
                          passwordNueva: "",
                          passwordConfirmar: "",
                        });
                        setError(null);
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Cambiar Contraseña
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Account Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Información de Cuenta</CardTitle>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rol</p>
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg font-medium capitalize">
                  {user.role}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Área (No editable)
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.department}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tu área de trabajo no puede ser cambiada. Contacta con administración si necesitas cambiarla.
              </p>
            </div>
          </Card>

          <Card>
            <CardTitle>Restricciones</CardTitle>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  📝 Cambio de Nombre
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {canChangeProfile
                    ? "Puedes cambiar tu nombre"
                    : `Disponible en ${daysUntilChange} día(s)`}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  🔒 Contraseña
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Puedes cambiar tu contraseña en cualquier momento
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  📍 Área
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  No editable (Contacta Admin)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
