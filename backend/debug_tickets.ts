import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debug() {
  try {
    console.log('🔍 VERIFICANDO TICKETS...\n');

    // Ver técnico de sistemas
    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.sistemas@sitti.com' },
      select: { id_usuario: true, nombre: true, id_area: true }
    });

    console.log('👤 Técnico de Sistemas:');
    console.log(`   ID: ${tecnico?.id_usuario}, Área: ${tecnico?.id_area}\n`);

    // Ver todos los tickets
    const allTickets = await prisma.ticket.findMany({
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
        id_area: true,
        id_responsable: true,
        id_estado: true,
        estado: { select: { nombre: true } },
        area: { select: { nombre: true } },
        responsable: { select: { nombre: true } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    console.log('📋 TODOS LOS TICKETS EN BD:');
    console.log(`Total: ${allTickets.length}\n`);
    allTickets.forEach(t => {
      console.log(`${t.folio} | ${t.titulo}`);
      console.log(`  Área: ${t.area.nombre} (ID: ${t.id_area})`);
      console.log(`  Estado: ${t.estado.nombre}`);
      console.log(`  Responsable: ${t.responsable?.nombre || 'SIN ASIGNAR'} (ID: ${t.id_responsable})`);
      console.log('');
    });

    // Ver tickets EN LA COLA (sin asignar y en área de sistemas)
    const enCola = await prisma.ticket.findMany({
      where: {
        id_area: 13,
        id_responsable: null
      },
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
        estado: { select: { nombre: true } }
      }
    });

    console.log(`\n📌 TICKETS EN COLA (Área Sistemas, Sin Asignar): ${enCola.length}`);
    enCola.forEach(t => {
      console.log(`  ${t.folio} - ${t.titulo} (${t.estado.nombre})`);
    });

    // Ver tickets asignados a técnico de sistemas
    if (tecnico) {
      const asignados = await prisma.ticket.findMany({
        where: {
          id_responsable: tecnico.id_usuario
        },
        select: {
          id_ticket: true,
          folio: true,
          titulo: true,
          estado: { select: { nombre: true } }
        }
      });

      console.log(`\n✅ TICKETS ASIGNADOS A ${tecnico.nombre}: ${asignados.length}`);
      asignados.forEach(t => {
        console.log(`  ${t.folio} - ${t.titulo} (${t.estado.nombre})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
