import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    // Verificar si hay comentarios
    const comentarios = await prisma.comentario.findMany({
      take: 5,
    });
    console.log('✅ Tabla Comentario existe');
    console.log(`Total comentarios: ${comentarios.length}`);
    
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log('❌ Tabla Comentario NO existe');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
