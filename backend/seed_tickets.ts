import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTickets() {
  try {
    console.log('🌱 Creando tickets de prueba...\n');

    // Obtener datos necesarios
    const areaVentas = await prisma.area.findUnique({
      where: { nombre: 'Ventas' },
    });

    const tecnico = await prisma.usuario.findUnique({
      where: { correo: 'tecnico.taller@sitti.com' },
    });

    const usuario = await prisma.usuario.findUnique({
      where: { correo: 'usuario.ventas@sitti.com' },
    });

    const catSoftware = await prisma.categoria.findUnique({
      where: { nombre: 'Software' },
    });

    const priorBaja = await prisma.prioridad.findUnique({
      where: { nombre: 'BAJA' },
    });

    const priorMedia = await prisma.prioridad.findUnique({
      where: { nombre: 'MEDIA' },
    });

    const priorAlta = await prisma.prioridad.findUnique({
      where: { nombre: 'ALTA' },
    });

    const estadoAbierto = await prisma.estado.findUnique({
      where: { nombre: 'ABIERTO' },
    });

    const estadoEnProceso = await prisma.estado.findUnique({
      where: { nombre: 'EN_PROCESO' },
    });

    const estadoResuelto = await prisma.estado.findUnique({
      where: { nombre: 'RESUELTO' },
    });

    if (!areaVentas || !tecnico || !usuario || !catSoftware || !priorBaja || !priorMedia || !priorAlta || !estadoAbierto || !estadoEnProceso || !estadoResuelto) {
      throw new Error('Faltan datos necesarios en la BD');
    }

    // Crear tickets
    const tickets = [
      {
        folio: 'TK-001',
        titulo: 'Sistema de cotización lento',
        descripcion: 'El sistema de cotización está tardando mucho tiempo en generar reportes. Necesitamos optimizar el rendimiento.',
        id_solicitante: usuario.id_usuario,
        id_responsable: tecnico.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorAlta.id_prioridad,
        id_estado: estadoEnProceso.id_estado,
      },
      {
        folio: 'TK-002',
        titulo: 'Error al exportar a PDF',
        descripcion: 'Cuando intento exportar cotizaciones a PDF, el sistema lanza un error. Por favor revisar.',
        id_solicitante: usuario.id_usuario,
        id_responsable: tecnico.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorMedia.id_prioridad,
        id_estado: estadoAbierto.id_estado,
      },
      {
        folio: 'TK-003',
        titulo: 'Acceso denegado a módulo de ventas',
        descripcion: 'No puedo acceder al módulo de ventas. Recibo error de permisos.',
        id_solicitante: usuario.id_usuario,
        id_responsable: null,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorAlta.id_prioridad,
        id_estado: estadoAbierto.id_estado,
      },
      {
        folio: 'TK-004',
        titulo: 'Instalación de actualizaciones completada',
        descripcion: 'Se instalaron correctamente todas las actualizaciones de seguridad. Sistema funcionando normalmente.',
        id_solicitante: usuario.id_usuario,
        id_responsable: tecnico.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorBaja.id_prioridad,
        id_estado: estadoResuelto.id_estado,
      },
      {
        folio: 'TK-005',
        titulo: 'Sincronización de datos falla',
        descripcion: 'La sincronización automática de datos no funciona correctamente en el módulo de inventario.',
        id_solicitante: usuario.id_usuario,
        id_responsable: tecnico.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorMedia.id_prioridad,
        id_estado: estadoEnProceso.id_estado,
      },
      {
        folio: 'TK-006',
        titulo: 'Reporte mensual no genera correctamente',
        descripcion: 'El reporte mensual de ventas está mostrando datos incorrectos. Verificar lógica de cálculos.',
        id_solicitante: usuario.id_usuario,
        id_responsable: null,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorAlta.id_prioridad,
        id_estado: estadoAbierto.id_estado,
      },
      {
        folio: 'TK-007',
        titulo: 'Contraseña expirada - cambio exitoso',
        descripcion: 'Cambio de contraseña realizado correctamente. Usuario puede acceder sin problemas.',
        id_solicitante: usuario.id_usuario,
        id_responsable: tecnico.id_usuario,
        id_area: areaVentas.id_area,
        id_categoria: catSoftware.id_categoria,
        id_prioridad: priorBaja.id_prioridad,
        id_estado: estadoResuelto.id_estado,
      },
    ];

    for (const ticket of tickets) {
      await prisma.ticket.create({
        data: ticket,
      });
    }

    console.log(`✅ Se crearon ${tickets.length} tickets de prueba\n`);

    // Contar
    const count = await prisma.ticket.count();
    console.log(`📊 Total de tickets en BD: ${count}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTickets();
