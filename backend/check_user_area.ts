import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    // Ver usuario (cualquiera)
    const usuario = await prisma.usuario.findFirst({
      where: { rol: { nombre: 'usuario' } },
      select: { 
        id_usuario: true, 
        nombre: true, 
        correo: true,
        id_area: true,
        area: { select: { nombre: true } }
      }
    });

    console.log('👤 Usuario encontrado:');
    console.log(JSON.stringify(usuario, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
