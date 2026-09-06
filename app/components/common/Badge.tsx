import type { Ticket } from "../../types/ticket";

interface StatusBadgeProps {
  status: Ticket["status"];
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const styles: Record<Ticket["status"], string> = {
    abierto: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    "en-progreso":
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    resuelto:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    cerrado: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
  };

  const labels: Record<Ticket["status"], string> = {
    abierto: "Abierto",
    "en-progreso": "En Progreso",
    resuelto: "Resuelto",
    cerrado: "Cerrado",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]} ${className}`}
    >
      {labels[status]}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Ticket["priority"];
  className?: string;
}

export function PriorityBadge({
  priority,
  className = "",
}: PriorityBadgeProps) {
  const styles: Record<Ticket["priority"], string> = {
    baja: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
    media:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    alta: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    urgente: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };

  const labels: Record<Ticket["priority"], string> = {
    baja: "Baja",
    media: "Media",
    alta: "Alta",
    urgente: "Urgente",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[priority]} ${className}`}
    >
      {labels[priority]}
    </span>
  );
}
