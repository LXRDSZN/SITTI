import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const bgColors = {
    success: "bg-green-50 dark:bg-green-900/20",
    error: "bg-red-50 dark:bg-red-900/20",
    warning: "bg-yellow-50 dark:bg-yellow-900/20",
    info: "bg-blue-50 dark:bg-blue-900/20",
  };

  const borderColors = {
    success: "border-green-200 dark:border-green-700",
    error: "border-red-200 dark:border-red-700",
    warning: "border-yellow-200 dark:border-yellow-700",
    info: "border-blue-200 dark:border-blue-700",
  };

  const textColors = {
    success: "text-green-800 dark:text-green-300",
    error: "text-red-800 dark:text-red-300",
    warning: "text-yellow-800 dark:text-yellow-300",
    info: "text-blue-800 dark:text-blue-300",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`
        p-4 rounded-lg border ${bgColors[type]} ${borderColors[type]}
        flex items-start gap-3 ${textColors[type]}
      `}
    >
      <span className="text-xl font-bold flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">
        {title && <h3 className="font-semibold">{title}</h3>}
        <p className={title ? "text-sm mt-1" : "text-sm"}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: "bg-green-600 dark:bg-green-700",
    error: "bg-red-600 dark:bg-red-700",
    warning: "bg-yellow-600 dark:bg-yellow-700",
    info: "bg-blue-600 dark:bg-blue-700",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white
        flex items-center gap-3 shadow-lg animate-in
        ${bgColors[type]}
      `}
    >
      <span className="text-xl">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
