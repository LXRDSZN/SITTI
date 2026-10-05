import { useEffect, useState } from "react";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { Card, CardTitle } from "../common/Card";
import { commentsService, type Comment } from "../../services/comments.service";
import { useAuth } from "../../context/AuthContext";

interface CommentsSectionProps {
  ticketId: number;
  title?: string;
  placeholder?: string;
}

export function CommentsSection({
  ticketId,
  title = "Comentarios",
  placeholder = "Agrega un comentario...",
}: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setError(null);
      const response = await commentsService.getByTicket(ticketId);
      setComments(response.comentarios);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los comentarios",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, [ticketId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await commentsService.create(ticketId, text);
      setComments((current) => [response.comentario, ...current]);
      setComment("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo guardar el comentario",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("¿Eliminar este comentario? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      setError(null);
      await commentsService.delete(commentId);
      setComments((current) =>
        current.filter((item) => item.id_comentario !== commentId),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo eliminar el comentario",
      );
    }
  };

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cargando comentarios...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay comentarios aún
          </p>
        ) : (
          comments.map((item) => (
            <article
              key={item.id_comentario}
              className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.usuario.nombre}
                </p>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.fecha).toLocaleString("es-MX")}
                  </time>
                  {user &&
                    (String(item.id_usuario) === user.id ||
                      user.role === "administrador") && (
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id_comentario)}
                        className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {item.comentario}
              </p>
            </article>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={2000}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <Button
          type="submit"
          className="mt-3"
          disabled={!comment.trim() || submitting}
        >
          {submitting ? "Guardando..." : "Comentar"}
        </Button>
      </form>
    </Card>
  );
}
