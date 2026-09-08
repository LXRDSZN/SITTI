import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTech() {
  try {
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.taller@sitti.com' },
      select: { id_usuario: true, nombre: true },
    });

    console.log('🔍 Técnico:', tecnico);

    const tickets = await prisma.ticket.findMany({
      where: { id_responsable: tecnico?.id_usuario },
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
        id_responsable: true,
        responsable: { select: { nombre: true } },
        estado: { select: { nombre: true } },
      },
    });

    console.log(`\n✅ Tickets asignados a ${tecnico?.nombre}:`);
    console.log(`Total: ${tickets.length}`);
    tickets.forEach(t => {
      console.log(`${t.folio} - ${t.titulo} (${t.estado.nombre})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTech();
