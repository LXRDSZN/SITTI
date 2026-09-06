import type { Route } from "./+types/areas";
import { mockAreas } from "../../utils/mockData";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useState } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Áreas - SITTI" }];
};

export default function Areas() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionar Áreas
        </h1>
        <Button>Crear Área</Button>
      </div>

      {/* Areas List */}
      <div className="grid gap-4">
        {mockAreas.map((area) => (
          <Card key={area.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {area.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {area.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Gerente: {area.manager || "No asignado"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setEditingId(editingId === area.id ? null : area.id)
                  }
                >
                  {editingId === area.id ? "Cancelar" : "Editar"}
                </Button>
                <Button variant="danger" size="sm">
                  Eliminar
                </Button>
              </div>
            </div>

            {editingId === area.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <input
                    type="text"
                    defaultValue={area.name}
                    placeholder="Nombre del área"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    defaultValue={area.description}
                    placeholder="Descripción"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
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
