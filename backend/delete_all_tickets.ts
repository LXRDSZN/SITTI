import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllTickets() {
  try {
    console.log('🔍 Verificando tickets existentes...');
    const countBefore = await prisma.ticket.count();
    console.log(`📊 Tickets antes: ${countBefore}`);

    if (countBefore > 0) {
      console.log('\n🗑️  Eliminando todos los tickets...');
      const result = await prisma.ticket.deleteMany({});
      console.log(`✅ Tickets eliminados: ${result.count}`);
    }

    const countAfter = await prisma.ticket.count();
    console.log(`\n✨ Estado final: ${countAfter} tickets en BD`);
    console.log('✓ Base de datos limpia\n');

  } catch (error) {
    console.error('❌ Error al eliminar tickets:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllTickets();
