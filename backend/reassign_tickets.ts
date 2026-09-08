import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reassignTickets() {
  try {
    console.log('🔄 Reasignando tickets...\n');

    // Obtener técnico
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.taller@sitti.com' },
    });

    if (!tecnico) {
      throw new Error('Técnico no encontrado');
    }

    // Obtener estados
    const estados = await prisma.estado.findMany();
    const estadoMap: Record<string, number> = {};
    estados.forEach(e => {
      estadoMap[e.nombre] = e.id_estado;
    });

    console.log('📊 Estados disponibles:', estadoMap);

    // Actualizar asignaciones
    const updates = [
      { id: 9, estado: 'EN_PROCESO', desc: 'TK-001 - Sistema de cotización lento' },
      { id: 10, estado: 'EN_PROCESO', desc: 'TK-002 - Error al exportar a PDF' },
      { id: 13, estado: 'EN_PROCESO', desc: 'TK-005 - Sincronización de datos falla' },
      { id: 11, estado: 'PENDIENTE', desc: 'TK-003 - Acceso denegado a módulo ventas' },
    ];

    for (const update of updates) {
      await prisma.ticket.update({
        where: { id_ticket: update.id },
        data: {
          id_responsable: tecnico.id_usuario,
          id_estado: estadoMap[update.estado],
          fecha_actualizacion: new Date(),
        },
      });
      console.log(`✅ ${update.desc} → ${update.estado}`);
    }

    console.log('\n✅ Reasignación completada');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

reassignTickets();
