import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      select: {
        id_ticket: true,
        folio: true,
        titulo: true,
      },
      orderBy: { id_ticket: 'asc' },
    });

    console.log('📋 Tickets disponibles:');
    tickets.forEach(t => {
      console.log(`  ${t.id_ticket}. ${t.folio} - ${t.titulo}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTickets();
