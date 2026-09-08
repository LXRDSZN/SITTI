import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const juan = await prisma.usuario.findUnique({
      where: { correo: 'usuario.ventas@sitti.com' },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: { select: { nombre: true } },
        area: { select: { nombre: true } }
      }
    });

    console.log('👤 INFORMACIÓN DEL USUARIO:\n');
    console.log(`Nombre: ${juan?.nombre}`);
    console.log(`Correo: ${juan?.correo}`);
    console.log(`ROL: ${juan?.rol.nombre.toUpperCase()}`);
    console.log(`Área: ${juan?.area.nombre}`);

    console.log('\n📋 TIPOS DE ROL:');
    const roles = await prisma.rol.findMany();
    roles.forEach(r => {
      const tipo = juan?.rol.nombre === r.nombre ? ' ← ESTE ES' : '';
      console.log(`  ${r.nombre}${tipo}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
