import bcrypt from 'bcrypt';
import prisma from '../src/config/database.js';

const passwordHash = await bcrypt.hash('password123', 10);

const updates = [
  {
    correo: 'tecnico.sistemas@sitti.com',
    nombre: 'Cesar Galicia',
  },
  {
    correo: 'admin.sistemas@sitti.com',
    nombre: 'Esteban Urbina Cruz',
  },
];

try {
  await prisma.$transaction(async (transaction) => {
    for (const user of updates) {
      const existing = await transaction.usuario.findUnique({
        where: { correo: user.correo },
        select: { id_usuario: true },
      });

      if (!existing) {
        throw new Error(`No se encontró el usuario demo ${user.correo}`);
      }

      await transaction.usuario.update({
        where: { id_usuario: existing.id_usuario },
        data: {
          nombre: user.nombre,
          password_hash: passwordHash,
          activo: true,
        },
      });
    }
  });

  console.log('Usuarios demo actualizados correctamente.');
} finally {
  await prisma.$disconnect();
}
