import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  try {
    console.log('🗑️  ELIMINANDO TODOS LOS REGISTROS DE DATOS...\n');

    // Eliminar en orden de dependencias (foreign keys)
    
    // 1. Comentarios
    const comentariosDeleted = await prisma.comentario.deleteMany();
    console.log(`✅ Comentarios eliminados: ${comentariosDeleted.count}`);

    // 2. Tickets
    const ticketsDeleted = await prisma.ticket.deleteMany();
    console.log(`✅ Tickets eliminados: ${ticketsDeleted.count}`);

    // 3. Usuarios (excepto rol, área, etc que son maestros)
    const usuariosDeleted = await prisma.usuario.deleteMany();
    console.log(`✅ Usuarios eliminados: ${usuariosDeleted.count}`);

    console.log('\n✨ BASE DE DATOS LIMPIADA\n');
    console.log('Registros mantenidos (maestros):');
    console.log('  ✓ Roles');
    console.log('  ✓ Áreas');
    console.log('  ✓ Categorías');
    console.log('  ✓ Prioridades');
    console.log('  ✓ Estados');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
