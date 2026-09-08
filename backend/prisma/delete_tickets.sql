-- Eliminar todos los tickets
DELETE FROM tickets;

-- Resetear el contador de ID (si es PostgreSQL)
ALTER SEQUENCE tickets_id_ticket_seq RESTART WITH 1;
