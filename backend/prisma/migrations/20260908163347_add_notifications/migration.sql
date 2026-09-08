-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateIndex
CREATE INDEX "notificaciones_id_usuario_idx" ON "notificaciones"("id_usuario");

-- CreateIndex
CREATE INDEX "notificaciones_id_ticket_idx" ON "notificaciones"("id_ticket");

-- CreateIndex
CREATE INDEX "notificaciones_leido_idx" ON "notificaciones"("leido");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE CASCADE ON UPDATE CASCADE;
