import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setupUsers() {
  try {
    console.log('🗑️  LIMPIANDO USUARIOS Y ROLES...\n');

    // Eliminar usuarios
    const deletedUsuarios = await prisma.usuario.deleteMany();
    console.log(`✅ ${deletedUsuarios.count} usuarios eliminados\n`);

    // Eliminar roles
    const deletedRoles = await prisma.rol.deleteMany();
    console.log(`✅ ${deletedRoles.count} roles eliminados\n`);

    console.log('📋 CREANDO NUEVOS ROLES...\n');

    // Crear roles
    const rolUsuario = await prisma.rol.create({
      data: { nombre: 'usuario' },
    });
    console.log(`✅ Rol creado: usuario`);

    const rolTecnico = await prisma.rol.create({
      data: { nombre: 'técnico' },
    });
    console.log(`✅ Rol creado: técnico`);

    const rolAdmin = await prisma.rol.create({
      data: { nombre: 'administrador' },
    });
    console.log(`✅ Rol creado: administrador\n`);

    console.log('🏢 OBTENER ÁREAS...\n');

    // Obtener áreas
    const areaVentas = await prisma.area.findUnique({ where: { nombre: 'Ventas' } });
    const areaTaller = await prisma.area.findUnique({ where: { nombre: 'Taller' } });
    const areaRefacciones = await prisma.area.findUnique({ where: { nombre: 'Refacciones' } });
    const areaSistemas = await prisma.area.findUnique({ where: { nombre: 'Sistemas' } });
    const areaAdmin = await prisma.area.findUnique({ where: { nombre: 'Administración' } });

    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('👥 CREANDO USUARIOS...\n');

    // 1️⃣ USUARIOS (1 por área)
    console.log('1️⃣  USUARIOS (1 por cada área):\n');

    const usuariosArea = [
      {
        nombre: 'Juan Pérez',
        correo: 'usuario.ventas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario.id_rol,
        id_area: areaVentas?.id_area || 1,
      },
      {
        nombre: 'Roberto García',
        correo: 'usuario.taller@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario.id_rol,
        id_area: areaTaller?.id_area || 3,
      },
      {
        nombre: 'María López',
        correo: 'usuario.refacciones@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario.id_rol,
        id_area: areaRefacciones?.id_area || 2,
      },
      {
        nombre: 'Luis Rodríguez',
        correo: 'usuario.sistemas@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolUsuario.id_rol,
        id_area: areaSistemas?.id_area || 13,
      },
    ];

    for (const usuarioData of usuariosArea) {
      const user = await prisma.usuario.create({ data: usuarioData as any });
      console.log(`   ✅ ${user.nombre} (${user.correo}) - Área: ${usuarioData.id_area}`);
    }

    // 2️⃣ TÉCNICO (1 que cubre TODAS las áreas)
    console.log('\n2️⃣  TÉCNICO (Resuelve tickets de TODAS las áreas):\n');

    const tecnico = await prisma.usuario.create({
      data: {
        nombre: 'Carlos López (Técnico)',
        correo: 'tecnico@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolTecnico.id_rol,
        id_area: areaSistemas?.id_area || 13,
      } as any,
    });

    console.log(`   ✅ ${tecnico.nombre} (${tecnico.correo})\n`);

    // 3️⃣ ADMINISTRADOR (1 único)
    console.log('3️⃣  ADMINISTRADOR:\n');

    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Gerente Sistemas (Administrador)',
        correo: 'admin@sitti.com',
        password_hash: hashedPassword,
        id_rol: rolAdmin.id_rol,
        id_area: areaAdmin?.id_area || 4,
      } as any,
    });

    console.log(`   ✅ ${admin.nombre} (${admin.correo})\n`);

    console.log('✨ ESTRUCTURA CREADA CORRECTAMENTE\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║          CREDENCIALES DE ACCESO                       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    console.log('\n👤 USUARIOS (1 por área):');
    console.log('   usuario.ventas@sitti.com / password123 (Ventas)');
    console.log('   usuario.taller@sitti.com / password123 (Taller)');
    console.log('   usuario.refacciones@sitti.com / password123 (Refacciones)');
    console.log('   usuario.sistemas@sitti.com / password123 (Sistemas)');
    
    console.log('\n👨‍💼 TÉCNICO (resuelve todas las áreas):');
    console.log('   tecnico@sitti.com / password123');
    
    console.log('\n👑 ADMINISTRADOR:');
    console.log('   admin@sitti.com / password123');

    console.log('\n═════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUsers();
