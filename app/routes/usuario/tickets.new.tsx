import type { Route } from "./+types/tickets.new";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Alert, Toast } from "../../components/common/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ticketsService } from "../../services/tickets.service";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Nuevo Ticket - SITTI" }];
};

const PRIORITY_MAP: Record<string, number> = {
  baja: 1,       // ID de prioridad BAJA
  media: 2,      // ID de prioridad MEDIA
  alta: 3,       // ID de prioridad ALTA
  urgente: 3,    // No hay URGENTE, se mapea a ALTA
};

export default function NewTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userAreaName, setUserAreaName] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "media" as const,
    category: "1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Obtener el área del usuario al montar el componente
  useEffect(() => {
    if (user?.area) {
      setUserAreaName(user.area);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar campos
    if (!formData.title.trim()) {
      setError("El título es requerido");
      return;
    }

    if (formData.title.length < 5) {
      setError("El título debe tener al menos 5 caracteres");
      return;
    }

    if (!formData.description.trim()) {
      setError("La descripción es requerida");
      return;
    }

    if (formData.description.length < 10) {
      setError("La descripción debe tener al menos 10 caracteres");
      return;
    }

    if (!formData.category) {
      setError("Debes seleccionar una categoría");
      return;
    }

    if (!user?.id_area) {
      setError("No se pudo determinar tu área de trabajo");
      return;
    }

    try {
      setLoading(true);

      const response = await ticketsService.createTicket({
        titulo: formData.title.trim(),
        descripcion: formData.description.trim(),
        id_area: user.id_area,
        id_categoria: parseInt(formData.category),
        id_prioridad: PRIORITY_MAP[formData.priority],
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/usuario/tickets/${response.ticket.id_ticket}`);
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el ticket";
      setError(errorMessage);
      console.error("Error creating ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crear Nuevo Ticket
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Describe tu problema y nos ayudaremos a resolverlo
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error al crear ticket"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          title="Ticket creado exitosamente"
          message="Redirigiendo al ticket..."
        />
      )}

      <Card>
        <CardTitle>Información del Ticket</CardTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Resumen del problema (mínimo 5 caracteres)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.title.length}/Mínimo 5 caracteres
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Proporciona detalles del problema (mínimo 10 caracteres)..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.description.length}/Mínimo 10 caracteres
            </p>
          </div>

          {/* Area - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Área *
            </label>
            <input
              type="text"
              value={userAreaName}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tu área de trabajo (no puede ser cambiada)
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Categoría *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="1">Hardware</option>
              <option value="2">Software</option>
              <option value="3">Redes / Conectividad</option>
              <option value="4">Impresoras</option>
              <option value="5">Accesos / Cuentas</option>
              <option value="6">Otros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Prioridad
            </label>
            <div className="flex gap-3">
              {[
                { value: "baja", label: "Baja" },
                { value: "media", label: "Media" },
                { value: "alta", label: "Alta" },
                { value: "urgente", label: "Urgente" },
              ].map((priority) => (
                <label key={priority.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Ticket"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/usuario/tickets")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
