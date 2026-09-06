import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed Roles
    const rolAdmin = await prisma.rol.upsert({
      where: { nombre: 'Administrador' },
      update: {},
      create: { nombre: 'Administrador' },
    });

    const rolTecnico = await prisma.rol.upsert({
      where: { nombre: 'Técnico' },
      update: {},
      create: { nombre: 'Técnico' },
    });

    const rolUsuario = await prisma.rol.upsert({
      where: { nombre: 'Usuario' },
      update: {},
      create: { nombre: 'Usuario' },
    });

    console.log('✓ Roles creados');

    // Seed Areas - Solo las 4 áreas requeridas
    const areaVentas = await prisma.area.upsert({
      where: { nombre: 'Ventas' },
      update: { activo: true },
      create: {
        nombre: 'Ventas',
        activo: true,
      },
    });

    const areaRefacciones = await prisma.area.upsert({
      where: { nombre: 'Refacciones' },
      update: { activo: true },
      create: {
        nombre: 'Refacciones',
        activo: true,
      },
    });

    const areaTaller = await prisma.area.upsert({
      where: { nombre: 'Taller' },
      update: { activo: true },
      create: {
        nombre: 'Taller',
        activo: true,
      },
    });

    const areaAdministracion = await prisma.area.upsert({
      where: { nombre: 'Administración' },
      update: { activo: true },
      create: {
        nombre: 'Administración',
        activo: true,
      },
    });

    const areaSistemas = await prisma.area.upsert({
      where: { nombre: 'Sistemas' },
      update: { activo: true },
      create: {
        nombre: 'Sistemas',
        activo: true,
      },
    });

    console.log('✓ Áreas creadas (Ventas, Refacciones, Taller, Administración, Sistemas)');

    // Seed Categorias
    const categorias = [
      { nombre: 'Hardware', descripcion: 'Problemas con equipos de cómputo' },
      { nombre: 'Software', descripcion: 'Problemas con aplicaciones y programas' },
      {
        nombre: 'Redes / Conectividad',
        descripcion: 'Problemas de red e internet',
      },
      { nombre: 'Impresoras', descripcion: 'Problemas con impresoras y tóner' },
      { nombre: 'Accesos / Cuentas', descripcion: 'Solicitudes de acceso y cuentas' },
      { nombre: 'Otros', descripcion: 'Otros problemas no clasificados' },
    ];

    for (const cat of categorias) {
      await prisma.categoria.upsert({
        where: { nombre: cat.nombre },
        update: {},
        create: {
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          activo: true,
        },
      });
    }

    console.log('✓ Categorías creadas');

    // Seed Prioridades
    const prioridades = ['BAJA', 'MEDIA', 'ALTA'];

    for (const prioridad of prioridades) {
      await prisma.prioridad.upsert({
        where: { nombre: prioridad },
        update: {},
        create: { nombre: prioridad },
      });
    }

    console.log('✓ Prioridades creadas');

    // Seed Estados
    const estados = [
      'ABIERTO',
      'ASIGNADO',
      'EN_PROCESO',
      'PENDIENTE',
      'RESUELTO',
      'CERRADO',
    ];

    for (const estado of estados) {
      await prisma.estado.upsert({
        where: { nombre: estado },
        update: {},
        create: { nombre: estado },
      });
    }

    console.log('✓ Estados creados');

    // Seed Usuarios - 3 usuarios uno por rol con áreas asignadas
    const passwordHash = await bcrypt.hash('password123', 10);

    // Usuario USUARIO (Cliente/Solicitante) - Área Ventas
    await prisma.usuario.upsert({
      where: { correo: 'usuario.ventas@sitti.com' },
      update: { activo: true },
      create: {
        nombre: 'Juan Pérez (Usuario)',
        correo: 'usuario.ventas@sitti.com',
        password_hash: passwordHash,
        id_rol: rolUsuario.id_rol,
        id_area: areaVentas.id_area,
        activo: true,
      },
    });

    // Usuario TÉCNICO - Área Sistemas (resuelve tickets de TODAS las áreas)
    await prisma.usuario.upsert({
      where: { correo: 'tecnico.sistemas@sitti.com' },
      update: { activo: true },
      create: {
        nombre: 'Carlos López (Técnico Sistemas)',
        correo: 'tecnico.sistemas@sitti.com',
        password_hash: passwordHash,
        id_rol: rolTecnico.id_rol,
        id_area: areaSistemas.id_area,
        activo: true,
      },
    });

    // Usuario ADMINISTRADOR - Área Sistemas
    await prisma.usuario.upsert({
      where: { correo: 'admin.sistemas@sitti.com' },
      update: { activo: true },
      create: {
        nombre: 'Gerente Sistemas',
        correo: 'admin.sistemas@sitti.com',
        password_hash: passwordHash,
        id_rol: rolAdmin.id_rol,
        id_area: areaSistemas.id_area,
        activo: true,
      },
    });

    console.log('✓ Usuarios creados:');
    console.log('  - Usuario: usuario.ventas@sitti.com (Ventas)');
    console.log('  - Técnico: tecnico.sistemas@sitti.com (Sistemas - resuelve todas las áreas)');
    console.log('  - Admin: admin.sistemas@sitti.com (Sistemas - Gerente)');
    console.log('  - Contraseña: password123');

    // Seed de Tickets
    console.log('📝 Creando tickets...');

    const estadoAbierto = await prisma.estado.findUnique({ where: { nombre: 'ABIERTO' } });
    const estadoAsignado = await prisma.estado.findUnique({ where: { nombre: 'ASIGNADO' } });
    const estadoEnProceso = await prisma.estado.findUnique({ where: { nombre: 'EN_PROCESO' } });
    const estadoResuelto = await prisma.estado.findUnique({ where: { nombre: 'RESUELTO' } });

    const prioridadAlta = await prisma.prioridad.findUnique({ where: { nombre: 'ALTA' } });
    const prioridadMedia = await prisma.prioridad.findUnique({ where: { nombre: 'MEDIA' } });
    const prioridadBaja = await prisma.prioridad.findUnique({ where: { nombre: 'BAJA' } });

    const catHardware = await prisma.categoria.findUnique({ where: { nombre: 'Hardware' } });
    const catSoftware = await prisma.categoria.findUnique({ where: { nombre: 'Software' } });
    const catRedes = await prisma.categoria.findUnique({ where: { nombre: 'Redes / Conectividad' } });

    const usuarioVentas = await prisma.usuario.findUnique({ where: { correo: 'usuario.ventas@sitti.com' } });
    const tecnicoSistemas = await prisma.usuario.findUnique({ where: { correo: 'tecnico.sistemas@sitti.com' } });

    // TKT-001: Abierto - Usuario Ventas - Hardware
    await prisma.ticket.upsert({
      where: { folio: 'TKT-001' },
      update: {},
      create: {
        folio: 'TKT-001',
        titulo: 'Monitor no enciende',
        descripcion: 'El monitor de mi escritorio dejó de funcionar desde esta mañana.',
        id_solicitante: usuarioVentas.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catHardware.id_categoria,
        id_prioridad: prioridadAlta.id_prioridad,
        id_estado: estadoAbierto.id_estado,
      },
    });

    // TKT-002: Asignado - Usuario Ventas - Red
    await prisma.ticket.upsert({
      where: { folio: 'TKT-002' },
      update: {},
      create: {
        folio: 'TKT-002',
        titulo: 'Internet lento en oficina',
        descripcion: 'La conexión de internet es muy lenta. No puedo descargar archivos correctamente.',
        id_solicitante: usuarioVentas.id_usuario,
        id_responsable: tecnicoSistemas.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catRedes.id_categoria,
        id_prioridad: prioridadMedia.id_prioridad,
        id_estado: estadoAsignado.id_estado,
      },
    });

    // TKT-003: En Proceso - Usuario Ventas - Software
    await prisma.ticket.upsert({
      where: { folio: 'TKT-003' },
      update: {},
      create: {
        folio: 'TKT-003',
        titulo: 'Error en aplicación CRM',
        descripcion: 'La aplicación CRM cierra inesperadamente al intentar guardar contactos.',
        id_solicitante: usuarioVentas.id_usuario,
        id_responsable: tecnicoSistemas.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: prioridadAlta.id_prioridad,
        id_estado: estadoEnProceso.id_estado,
      },
    });

    // TKT-004: Resuelto - Usuario Ventas - Hardware
    await prisma.ticket.upsert({
      where: { folio: 'TKT-004' },
      update: {},
      create: {
        folio: 'TKT-004',
        titulo: 'Teclado no responde',
        descripcion: 'El teclado no responde a los comandos.',
        id_solicitante: usuarioVentas.id_usuario,
        id_responsable: tecnicoSistemas.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catHardware.id_categoria,
        id_prioridad: prioridadBaja.id_prioridad,
        id_estado: estadoResuelto.id_estado,
        fecha_cierre: new Date(),
      },
    });

    // TKT-005: Abierto - Refacciones - Hardware
    await prisma.ticket.upsert({
      where: { folio: 'TKT-005' },
      update: {},
      create: {
        folio: 'TKT-005',
        titulo: 'Impresora sin tinta',
        descripcion: 'La impresora está sin tinta y no imprime nada.',
        id_solicitante: usuarioVentas.id_usuario,
        id_area: areaRefacciones.id_area,
        id_categoria: catHardware.id_categoria,
        id_prioridad: prioridadMedia.id_prioridad,
        id_estado: estadoAbierto.id_estado,
      },
    });

    // TKT-006: En Proceso - Taller - Software
    await prisma.ticket.upsert({
      where: { folio: 'TKT-006' },
      update: {},
      create: {
        folio: 'TKT-006',
        titulo: 'Licencia de software expirada',
        descripcion: 'Necesitamos renovar la licencia del software de gestión.',
        id_solicitante: usuarioVentas.id_usuario,
        id_responsable: tecnicoSistemas.id_usuario,
        id_area: areaTaller.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: prioridadAlta.id_prioridad,
        id_estado: estadoEnProceso.id_estado,
      },
    });

    // TKT-007: Asignado - Administración - Red
    await prisma.ticket.upsert({
      where: { folio: 'TKT-007' },
      update: {},
      create: {
        folio: 'TKT-007',
        titulo: 'Configurar VPN para trabajo remoto',
        descripcion: 'Necesitamos configurar VPN para permitir trabajo remoto seguro.',
        id_solicitante: usuarioVentas.id_usuario,
        id_responsable: tecnicoSistemas.id_usuario,
        id_area: areaAdministracion.id_area,
        id_categoria: catRedes.id_categoria,
        id_prioridad: prioridadAlta.id_prioridad,
        id_estado: estadoAsignado.id_estado,
      },
    });

    console.log('✓ Tickets creados (7 tickets)');
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
