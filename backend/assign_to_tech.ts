import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTicketsToTechnician() {
  try {
    console.log('🎯 ASIGNANDO TICKETS AL TÉCNICO...\n');

    // Obtener el técnico
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico@sitti.com' },
    });

    if (!tecnico) {
      console.error('❌ No se encontró el técnico');
      return;
    }

    console.log(`✅ Técnico encontrado: ${tecnico.nombre} (ID: ${tecnico.id_usuario})\n`);

    // Obtener todos los tickets sin asignar
    const ticketsNoAsignados = await prisma.ticket.findMany({
      where: { id_responsable: null },
      include: {
        area: true,
        categoria: true,
        prioridad: true,
        estado: true,
      },
    });

    console.log(`📋 Tickets sin asignar encontrados: ${ticketsNoAsignados.length}\n`);

    if (ticketsNoAsignados.length === 0) {
      console.log('ℹ️  No hay tickets sin asignar');
      return;
    }

    // Asignar todos los tickets al técnico
    let contadorAsignados = 0;
    for (const ticket of ticketsNoAsignados) {
      await prisma.ticket.update({
        where: { id_ticket: ticket.id_ticket },
        data: { id_responsable: tecnico.id_usuario },
      });
      console.log(`   ✅ ${ticket.folio} - ${ticket.titulo}`);
      contadorAsignados++;
    }

    console.log(`\n✨ ${contadorAsignados} tickets asignados al técnico correctamente\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignTicketsToTechnician();
