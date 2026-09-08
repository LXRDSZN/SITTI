import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const prioridades = await prisma.prioridad.findMany();
    console.log('✅ Prioridades en BD:');
    prioridades.forEach(p => {
      console.log(`${p.id_prioridad}. ${p.nombre}`);
    });

    const areas = await prisma.area.findMany();
    console.log('\n✅ Áreas en BD:');
    areas.forEach(a => {
      console.log(`${a.id_area}. ${a.nombre}`);
    });

    const categorias = await prisma.categoria.findMany();
    console.log('\n✅ Categorías en BD:');
    categorias.forEach(c => {
      console.log(`${c.id_categoria}. ${c.nombre}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
