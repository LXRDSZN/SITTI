import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creando notificaciones para técnicos...");

  // Obtener técnicos
  const tecnicos = await prisma.usuario.findMany({
    where: {
      rol: { nombre: "Técnico" },
    },
  });

  // Obtener un ticket
  const ticket = await prisma.ticket.findFirst();

  if (!tecnicos.length || !ticket) {
    console.log("No hay técnicos o tickets para crear notificaciones");
    return;
  }

  // Crear notificaciones para cada técnico
  for (const tecnico of tecnicos) {
    await prisma.notificacion.create({
      data: {
        id_usuario: tecnico.id_usuario,
        id_ticket: ticket.id_ticket,
        titulo: "📌 Nuevo ticket en " + (ticket.area?.nombre || "tu área"),
        mensaje: `Nuevo ticket ${ticket.folio} "${ticket.titulo}" ha llegado a tu área`,
        tipo: "ticket_creado",
        leido: false,
      },
    });
  }

  console.log(`✅ Notificaciones creadas para ${tecnicos.length} técnicos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
