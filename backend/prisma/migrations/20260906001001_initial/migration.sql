-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "areas" (
    "id_area" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id_area")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "prioridades" (
    "id_prioridad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "prioridades_pkey" PRIMARY KEY ("id_prioridad")
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id_ticket" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "id_solicitante" INTEGER NOT NULL,
    "id_responsable" INTEGER,
    "id_area" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_prioridad" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "fecha_cierre" TIMESTAMP(3),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id_ticket")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id_comentario" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "adjuntos" (
    "id_adjunto" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre_archivo" TEXT NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjuntos_pkey" PRIMARY KEY ("id_adjunto")
);

-- CreateTable
CREATE TABLE "historial_tickets" (
    "id_historial" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "valor_anterior" TEXT,
    "valor_nuevo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_tickets_pkey" PRIMARY KEY ("id_historial")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "areas_nombre_key" ON "areas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "prioridades_nombre_key" ON "prioridades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_nombre_key" ON "estados"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "usuarios_id_rol_idx" ON "usuarios"("id_rol");

-- CreateIndex
CREATE INDEX "usuarios_id_area_idx" ON "usuarios"("id_area");

-- CreateIndex
CREATE INDEX "usuarios_correo_idx" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_folio_key" ON "tickets"("folio");

-- CreateIndex
CREATE INDEX "tickets_id_solicitante_idx" ON "tickets"("id_solicitante");

-- CreateIndex
CREATE INDEX "tickets_id_responsable_idx" ON "tickets"("id_responsable");

-- CreateIndex
CREATE INDEX "tickets_id_area_idx" ON "tickets"("id_area");

-- CreateIndex
CREATE INDEX "tickets_id_categoria_idx" ON "tickets"("id_categoria");

-- CreateIndex
CREATE INDEX "tickets_id_prioridad_idx" ON "tickets"("id_prioridad");

-- CreateIndex
CREATE INDEX "tickets_id_estado_idx" ON "tickets"("id_estado");

-- CreateIndex
CREATE INDEX "tickets_folio_idx" ON "tickets"("folio");

-- CreateIndex
CREATE INDEX "comentarios_id_ticket_idx" ON "comentarios"("id_ticket");

-- CreateIndex
CREATE INDEX "comentarios_id_usuario_idx" ON "comentarios"("id_usuario");

-- CreateIndex
CREATE INDEX "adjuntos_id_ticket_idx" ON "adjuntos"("id_ticket");

-- CreateIndex
CREATE INDEX "adjuntos_id_usuario_idx" ON "adjuntos"("id_usuario");

-- CreateIndex
CREATE INDEX "historial_tickets_id_ticket_idx" ON "historial_tickets"("id_ticket");

-- CreateIndex
CREATE INDEX "historial_tickets_id_usuario_idx" ON "historial_tickets"("id_usuario");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "areas"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "areas"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_prioridad_fkey" FOREIGN KEY ("id_prioridad") REFERENCES "prioridades"("id_prioridad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjuntos" ADD CONSTRAINT "adjuntos_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adjuntos" ADD CONSTRAINT "adjuntos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_tickets" ADD CONSTRAINT "historial_tickets_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_tickets" ADD CONSTRAINT "historial_tickets_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
