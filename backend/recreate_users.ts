import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function recreateUsers() {
  try {
    console.log('🗑️  ELIMINANDO USUARIOS ACTUALES...\n');

    // Eliminar todos los usuarios
    const deleted = await prisma.usuario.deleteMany();
    console.log(`✅ ${deleted.count} usuarios eliminados\n`);

    console.log('👥 CREANDO NUEVOS USUARIOS POR ROL Y FUNCIÓN...\n');

    // Obtener roles
    const rolUsuario = await prisma.rol.findUnique({ where: { nombre: 'usuario' } });
    const rolTecnico = await prisma.rol.findUnique({ where: { nombre: 'técnico' } });
    const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'administrador' } });

    // Obtener áreas
    const areaVentas = await prisma.area.findUnique({ where: { nombre: 'Ventas' } });
    const areaTaller = await prisma.area.findUnique({ where: { nombre: 'Taller' } });
    const areaRefacciones = await prisma.area.findUnique({ where: { nombre: 'Refacciones' } });
    const areaSistemas = await prisma.area.findUnique({ where: { nombre: 'Sistemas' } });
    const areaAdmin = await prisma.area.findUnique({ where: { nombre: 'Administración' } });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1️⃣ USUARIOS (MUCHOS)
    console.log('1️⃣  ROL: USUARIO (Muchos usuarios)');
    console.log('   Función: Crear tickets, ver sus propios tickets\n');

    const usuariosNormales = [
      {
        nombre: 'Juan Pérez',
        correo: 'juan.perez@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario?.id_rol || 1,
        id_area: areaVentas?.id_area || 1,
      },
      {
        nombre: 'María García',
        correo: 'maria.garcia@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario?.id_rol || 1,
        id_area: areaVentas?.id_area || 1,
      },
      {
        nombre: 'Luis Rodríguez',
        correo: 'luis.rodriguez@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario?.id_rol || 1,
        id_area: areaTaller?.id_area || 3,
      },
      {
        nombre: 'Ana López',
        correo: 'ana.lopez@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario?.id_rol || 1,
        id_area: areaRefacciones?.id_area || 2,
      },
    ];

    for (const usuarioData of usuariosNormales) {
      const user = await prisma.usuario.create({ data: usuarioData as any });
      console.log(`   ✅ ${user.nombre} (${user.correo})`);
    }

    // 2️⃣ TÉCNICO (1 único que cubre todas las áreas)
    console.log('\n2️⃣  ROL: TÉCNICO (1 único)');
    console.log('   Función: Gestionar tickets de todas las áreas, cambiar estados, agregar notas\n');

    const tecnico = await prisma.usuario.create({
      data: {
        nombre: 'Carlos López (Técnico)',
        correo: 'tecnico@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolTecnico?.id_rol || 2,
        id_area: areaSistemas?.id_area || 13,
      } as any,
    });

    console.log(`   ✅ ${tecnico.nombre} (${tecnico.correo})`);

    // 3️⃣ ADMINISTRADOR (1 único)
    console.log('\n3️⃣  ROL: ADMINISTRADOR (1 único)');
    console.log('   Función: Control total del sistema\n');

    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Gerente Sistemas (Administrador)',
        correo: 'admin.sistemas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolAdmin?.id_rol || 3,
        id_area: areaAdmin?.id_area || 4,
      } as any,
    });

    console.log(`   ✅ ${admin.nombre} (${admin.correo})`);

    console.log('\n✨ USUARIOS CREADOS CORRECTAMENTE\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║          CREDENCIALES DE ACCESO                       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\n👤 USUARIOS (Rol: Usuario):');
    console.log('   juan.perez@sitti.com / password123');
    console.log('   maria.garcia@sitti.com / password123');
    console.log('   luis.rodriguez@sitti.com / password123');
    console.log('   ana.lopez@sitti.com / password123');
    console.log('\n👨‍💼 TÉCNICO (Rol: Técnico):');
    console.log('   tecnico@sitti.com / password123');
    console.log('\n👑 ADMINISTRADOR (Rol: Administrador):');
    console.log('   admin.sistemas@sitti.com / password123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateUsers();
