import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function restoreUsers() {
  try {
    console.log('👥 RESTAURANDO USUARIOS POR DEFECTO...\n');

    // Obtener roles
    const rolUsuario = await prisma.rol.findUnique({ where: { nombre: 'usuario' } });
    const rolTecnico = await prisma.rol.findUnique({ where: { nombre: 'técnico' } });
    const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'administrador' } });

    // Obtener áreas
    const areaVentas = await prisma.area.findUnique({ where: { nombre: 'Ventas' } });
    const areaTaller = await prisma.area.findUnique({ where: { nombre: 'Taller' } });
    const areaSistemas = await prisma.area.findUnique({ where: { nombre: 'Sistemas' } });
    const areaAdmin = await prisma.area.findUnique({ where: { nombre: 'Administración' } });

    const hashedPassword = await bcrypt.hash('password123', 10);

    const usuarios = [
      {
        nombre: 'Juan Pérez (Usuario)',
        correo: 'usuario.ventas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario?.id_rol || 1,
        id_area: areaVentas?.id_area || 1,
      },
      {
        nombre: 'Carlos López (Técnico)',
        correo: 'tecnico.taller@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolTecnico?.id_rol || 2,
        id_area: areaTaller?.id_area || 3,
      },
      {
        nombre: 'Admin Sistema',
        correo: 'admin@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolAdmin?.id_rol || 3,
        id_area: areaAdmin?.id_area || 4,
      },
      {
        nombre: 'Carlos López (Técnico Sistemas)',
        correo: 'tecnico.sistemas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolTecnico?.id_rol || 2,
        id_area: areaSistemas?.id_area || 13,
      },
      {
        nombre: 'Gerente Sistemas',
        correo: 'admin.sistemas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolAdmin?.id_rol || 3,
        id_area: areaSistemas?.id_area || 13,
      },
    ];

    for (const usuarioData of usuarios) {
      const user = await prisma.usuario.create({
        data: usuarioData as any,
      });
      console.log(`✅ ${user.nombre}`);
      console.log(`   Correo: ${user.correo}`);
      console.log(`   Área: ${[areaVentas, areaTaller, areaSistemas, areaAdmin].find(a => a?.id_area === user.id_area)?.nombre}\n`);
    }

    console.log('✨ USUARIOS RESTAURADOS\n');
    console.log('📝 CREDENCIALES:');
    console.log('  usuario.ventas@sitti.com / password123');
    console.log('  tecnico.taller@sitti.com / password123');
    console.log('  tecnico.sistemas@sitti.com / password123');
    console.log('  admin@sitti.com / password123');
    console.log('  admin.sistemas@sitti.com / password123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreUsers();
