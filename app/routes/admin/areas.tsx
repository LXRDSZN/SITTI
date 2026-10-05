import type { Route } from "./+types/areas";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { areasService, type AreaItem } from "../../services/areas.service";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Áreas - SITTI" }];
};

export default function Areas() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    areasService
      .getAreas()
      .then((response) => {
        if (!cancelled) setAreas(response.areas);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las áreas",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading]);

  const startEditing = (area: AreaItem) => {
    setEditingId(area.id_area);
    setEditName(area.nombre);
    setEditActive(area.activo);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditActive(true);
  };

  const saveArea = async (id: number) => {
    if (!editName.trim()) {
      setError("El nombre del área es obligatorio");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await areasService.updateArea(id, {
        nombre: editName.trim(),
        activo: editActive,
      });
      setAreas((currentAreas) =>
        currentAreas.map((area) =>
          area.id_area === id ? response.area : area,
        ),
      );
      cancelEditing();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el área",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionar Áreas
        </h1>
        <Button>Crear Área</Button>
      </div>

      {isLoading && (
        <p className="text-gray-600 dark:text-gray-400">Cargando áreas...</p>
      )}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!isLoading && !error && areas.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No hay áreas registradas en la base de datos.
        </p>
      )}

      <div className="grid gap-4">
        {areas.map((area) => (
          <Card key={area.id_area}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {area.nombre}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estado: {area.activo ? "Activa" : "Inactiva"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  editingId === area.id_area
                    ? cancelEditing()
                    : startEditing(area)
                }
              >
                {editingId === area.id_area ? "Cancelar" : "Editar"}
              </Button>
            </div>
            {editingId === area.id_area && (
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del área"
                  disabled={isSaving}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(event) => setEditActive(event.target.checked)}
                    disabled={isSaving}
                  />
                  Área activa
                </label>
                <Button
                  className="w-full"
                  onClick={() => saveArea(area.id_area)}
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
