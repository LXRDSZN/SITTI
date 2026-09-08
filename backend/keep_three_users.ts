import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function keepThreeUsers() {
  try {
    console.log('🗑️  ELIMINANDO USUARIOS INNECESARIOS...\n');

    // Eliminar a Carlos López (Técnico Taller) - tecnico.taller@sitti.com
    const deleted1 = await prisma.usuario.deleteMany({
      where: { correo: 'tecnico.taller@sitti.com' }
    });
    console.log(`✅ Eliminado: Carlos López (Técnico Taller) - ${deleted1.count}`);

    // Eliminar a Admin Sistema - admin@sitti.com
    const deleted2 = await prisma.usuario.deleteMany({
      where: { correo: 'admin@sitti.com' }
    });
    console.log(`✅ Eliminado: Admin Sistema - ${deleted2.count}`);

    console.log('\n✨ USUARIOS FINALES:\n');

    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        area: { select: { nombre: true } }
      }
    });

    usuarios.forEach(u => {
      console.log(`${u.id_usuario}. ${u.nombre}`);
      console.log(`   Correo: ${u.correo}`);
      console.log(`   Área: ${u.area.nombre}\n`);
    });

    console.log('📝 CREDENCIALES:');
    console.log('  usuario.ventas@sitti.com / password123');
    console.log('  tecnico.sistemas@sitti.com / password123');
    console.log('  admin.sistemas@sitti.com / password123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

keepThreeUsers();
