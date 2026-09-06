import type { Route } from "./+types/categorias";
import { mockCategories } from "../../utils/mockData";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Categorías - SITTI" }];
};

export default function Categories() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionar Categorías
        </h1>
        <Button>Crear Categoría</Button>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {mockCategories.map((category) => (
          <Card key={category.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {category.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Área: {category.area}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setEditingId(editingId === category.id ? null : category.id)
                  }
                >
                  {editingId === category.id ? "Cancelar" : "Editar"}
                </Button>
                <Button variant="danger" size="sm">
                  Eliminar
                </Button>
              </div>
            </div>

            {editingId === category.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <input
                    type="text"
                    defaultValue={category.name}
                    placeholder="Nombre de la categoría"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    defaultValue={category.description}
                    placeholder="Descripción"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <select
                    defaultValue={category.area}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecciona un área</option>
                    <option value="area-1">Infraestructura</option>
                    <option value="area-2">Aplicaciones</option>
                    <option value="area-3">Soporte de Usuario</option>
                  </select>
                  <Button className="w-full">Guardar Cambios</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
