import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTickets() {
  try {
    console.log('🔄 Asignando tickets a Carlos López (Técnico)...\n');

    // Obtener técnico
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.taller@sitti.com' },
    });

    if (!tecnico) {
      throw new Error('Técnico no encontrado');
    }

    // Obtener estados
    const estadoEnProceso = await prisma.estado.findUnique({
      where: { nombre: 'EN_PROCESO' },
    });

    const estadoAsignado = await prisma.estado.findUnique({
      where: { nombre: 'ASIGNADO' },
    });

    if (!estadoEnProceso || !estadoAsignado) {
      throw new Error('Estados no encontrados');
    }

    // Asignar tickets: 9, 10, 13 en proceso
    const ticketsEnProceso = [9, 10, 13];
    
    for (const id of ticketsEnProceso) {
      await prisma.ticket.update({
        where: { id_ticket: id },
        data: {
          id_responsable: tecnico.id_usuario,
          id_estado: estadoEnProceso.id_estado,
        },
      });
    }

    // Asignar ticket 11 como ASIGNADO
    await prisma.ticket.update({
      where: { id_ticket: 11 },
      data: {
        id_responsable: tecnico.id_usuario,
        id_estado: estadoAsignado.id_estado,
      },
    });

    console.log('✅ Tickets asignados a Carlos López:');
    console.log('   - TK-001 (EN_PROCESO)');
    console.log('   - TK-002 (EN_PROCESO)');
    console.log('   - TK-005 (EN_PROCESO)');
    console.log('   - TK-003 (ASIGNADO)\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

assignTickets();
