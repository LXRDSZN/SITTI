import type { Route } from "./+types/configuracion";
import { Card, CardTitle } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Configuración - SITTI" }];
};

export default function Settings() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Configuración
      </h1>

      {/* General Settings */}
      <Card>
        <CardTitle>Configuración General</CardTitle>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Nombre del Sistema
            </label>
            <input
              type="text"
              defaultValue="SITTI"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              defaultValue="support@company.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-4">
            <Button>Guardar</Button>
            <Button variant="secondary">Cancelar</Button>
          </div>
        </form>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardTitle>Configuración de Email</CardTitle>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              placeholder="smtp.example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Puerto
              </label>
              <input
                type="number"
                defaultValue="587"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Encriptación
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>TLS</option>
                <option>SSL</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button>Guardar</Button>
            <Button variant="secondary">Prueba de Conexión</Button>
          </div>
        </form>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardTitle>Seguridad</CardTitle>
        <form className="space-y-6">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-gray-900 dark:text-white font-medium">
                Requerir autenticación de dos factores
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Habilitar registro de auditoría
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Tiempo de Sesión (minutos)
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <Button>Guardar Cambios</Button>
        </form>
      </Card>
    </div>
  );
}
