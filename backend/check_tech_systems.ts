import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    // Obtener técnico de sistemas
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.sistemas@sitti.com' },
      select: { 
        id_usuario: true, 
        nombre: true,
        correo: true,
        id_area: true,
        area: { select: { nombre: true } }
      },
    });

    console.log('🔍 Técnico de Sistemas:');
    console.log(JSON.stringify(tecnico, null, 2));

    if (!tecnico) {
      console.log('\n❌ No existe usuario tecnico.sistemas@sitti.com');
      
      // Buscar todos los técnicos
      const tecnicos = await prisma.usuario.findMany({
        where: {
          rol: { nombre: 'técnico' }
        },
        select: {
          id_usuario: true,
          nombre: true,
          correo: true,
          id_area: true,
          area: { select: { nombre: true } }
        }
      });

      console.log('\n✅ Técnicos disponibles:');
      tecnicos.forEach(t => {
        console.log(`${t.id_usuario}. ${t.nombre} (${t.correo}) - Área: ${t.area?.nombre}`);
      });
      
      return;
    }

    // Ver tickets asignados al técnico
    const ticketsAsignados = await prisma.ticket.findMany({
      where: { id_responsable: tecnico.id_usuario },
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
        estado: { select: { nombre: true } },
        responsable: { select: { nombre: true } }
      }
    });

    console.log(`\n✅ Tickets asignados a ${tecnico.nombre}:`);
    console.log(`Total: ${ticketsAsignados.length}`);
    if (ticketsAsignados.length > 0) {
      ticketsAsignados.forEach(t => {
        console.log(`  ${t.folio} - ${t.titulo} (${t.estado.nombre})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
