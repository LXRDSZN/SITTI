import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTickets() {
  try {
    // Obtener técnico
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.taller@sitti.com' },
      select: { id_usuario: true, nombre: true },
    });

    console.log('🔍 Técnico:', tecnico);

    // Ver todos los tickets
    const tickets = await prisma.ticket.findMany({
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
        id_responsable: true,
        responsable: { select: { nombre: true } },
        id_estado: true,
        estado: { select: { nombre: true } },
      },
    });

    console.log('\n📋 Todos los tickets:');
    tickets.forEach(t => {
      console.log(`${t.id_ticket}. ${t.folio} - ${t.titulo}`);
      console.log(`   Responsable: ${t.responsable?.nombre || 'N/A'} (ID: ${t.id_responsable})`);
      console.log(`   Estado: ${t.estado.nombre}`);
    });

    // Filtrar asignados al técnico
    const asignados = tickets.filter(t => t.id_responsable === tecnico?.id_usuario);
    console.log(`\n✅ Tickets asignados a ${tecnico?.nombre}:`);
    if (asignados.length === 0) {
      console.log('   ❌ NINGUNO');
    } else {
      asignados.forEach(t => {
        console.log(`   ${t.folio} - ${t.titulo} (${t.estado.nombre})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTickets();
