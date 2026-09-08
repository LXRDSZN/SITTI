import type { Ticket } from "../../types/ticket";

interface StatusBadgeProps {
  status?: Ticket["status"] | string;
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = "" }: StatusBadgeProps) {
  const statusKey = (status as string)?.toLowerCase() || "abierto";
  
  const styles: Record<string, string> = {
    abierto: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    "en-progreso":
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    en_proceso:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    resuelto:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    cerrado: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
    red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    gray: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
  };

  const labels: Record<string, string> = {
    abierto: "Abierto",
    "en-progreso": "En Progreso",
    en_proceso: "En Progreso",
    resuelto: "Resuelto",
    cerrado: "Cerrado",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[statusKey] || styles.abierto} ${className}`}
    >
      {children || labels[statusKey] || statusKey}
    </span>
  );
}

interface PriorityBadgeProps {
  priority?: Ticket["priority"] | string;
  children?: React.ReactNode;
  className?: string;
}

export function PriorityBadge({
  priority,
  children,
  className = "",
}: PriorityBadgeProps) {
  const priorityKey = (priority as string)?.toLowerCase() || "media";
  
  const styles: Record<string, string> = {
    baja: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
    media:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    alta: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    urgente: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  };

  const labels: Record<string, string> = {
    baja: "Baja",
    media: "Media",
    alta: "Alta",
    urgente: "Urgente",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[priorityKey] || styles.media} ${className}`}
    >
      {children || labels[priorityKey] || priorityKey}
    </span>
  );
}
