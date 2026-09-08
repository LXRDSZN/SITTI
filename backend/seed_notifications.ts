import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear notificaciones de prueba para el usuario 1
  console.log("Creando notificaciones de prueba...");

  // Obtener el primer usuario (usuario de ventas)
  const usuario = await prisma.usuario.findFirst();
  const ticket = await prisma.ticket.findFirst();

  if (!usuario || !ticket) {
    console.log("No hay usuarios o tickets para crear notificaciones");
    return;
  }

  const notificaciones = await prisma.notificacion.createMany({
    data: [
      {
        id_usuario: usuario.id_usuario,
        id_ticket: ticket.id_ticket,
        titulo: "✓ Ticket resuelto",
        mensaje: `Tu ticket ${ticket.folio} "${ticket.titulo}" ha sido resuelto`,
        tipo: "ticket_resuelto",
        leido: false,
      },
      {
        id_usuario: usuario.id_usuario,
        id_ticket: ticket.id_ticket,
        titulo: "🔧 Ticket asignado",
        mensaje: `Tu ticket ${ticket.folio} ha sido asignado a un técnico`,
        tipo: "ticket_asignado",
        leido: false,
      },
      {
        id_usuario: usuario.id_usuario,
        id_ticket: ticket.id_ticket,
        titulo: "📋 Ticket actualizado",
        mensaje: `Tu ticket ${ticket.folio} ahora está en estado: EN PROGRESO`,
        tipo: "ticket_actualizado",
        leido: true,
      },
    ],
  });

  console.log(`✅ ${notificaciones.count} notificaciones creadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
