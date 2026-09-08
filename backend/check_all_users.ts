import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { 
        id_usuario: true, 
        nombre: true, 
        correo: true,
        id_area: true,
        rol: { select: { nombre: true } },
        area: { select: { nombre: true } }
      }
    });

    console.log('👥 TODOS LOS USUARIOS:\n');
    usuarios.forEach(u => {
      console.log(`${u.id_usuario}. ${u.nombre}`);
      console.log(`   Correo: ${u.correo}`);
      console.log(`   Rol: ${u.rol.nombre}`);
      console.log(`   Área: ${u.area?.nombre || 'SIN ÁREA'} (ID: ${u.id_area})\n`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
