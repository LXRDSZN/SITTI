import type { Route } from "./+types/categorias";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import {
  categoriesService,
  type CategoryItem,
} from "../../services/categories.service";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Categorías - SITTI" }];
};

export default function Categories() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    categoriesService
      .getCategories()
      .then((response) => {
        if (!cancelled) setCategories(response.categorias);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las categorías",
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

  const startEditing = (category: CategoryItem) => {
    setEditingId(category.id_categoria);
    setEditName(category.nombre);
    setEditDescription(category.descripcion || "");
    setEditActive(category.activo);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditActive(true);
  };

  const saveCategory = async (id: number) => {
    if (!editName.trim()) {
      setError("El nombre de la categoría es obligatorio");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await categoriesService.updateCategory(id, {
        nombre: editName.trim(),
        descripcion: editDescription.trim() || null,
        activo: editActive,
      });
      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id_categoria === id ? response.categoria : category,
        ),
      );
      cancelEditing();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar la categoría",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionar Categorías
        </h1>
        <Button>Crear Categoría</Button>
      </div>

      {isLoading && (
        <p className="text-gray-600 dark:text-gray-400">
          Cargando categorías...
        </p>
      )}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!isLoading && !error && categories.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No hay categorías registradas en la base de datos.
        </p>
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id_categoria}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {category.nombre}
                </h3>
                <p className="mb-3 text-gray-600 dark:text-gray-400">
                  {category.descripcion || "Sin descripción"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estado: {category.activo ? "Activa" : "Inactiva"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  editingId === category.id_categoria
                    ? cancelEditing()
                    : startEditing(category)
                }
              >
                {editingId === category.id_categoria ? "Cancelar" : "Editar"}
              </Button>
            </div>
            {editingId === category.id_categoria && (
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre de la categoría"
                  disabled={isSaving}
                />
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción"
                  rows={3}
                  disabled={isSaving}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(event) => setEditActive(event.target.checked)}
                    disabled={isSaving}
                  />
                  Categoría activa
                </label>
                <Button
                  className="w-full"
                  onClick={() => saveCategory(category.id_categoria)}
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
