import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nuevosErroresTickets = [
  {
    titulo: "Error 502 Bad Gateway al guardar facturas",
    categoria: "Software",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "Al hacer clic en 'Emitir Factura', el sistema web responde con un error 502 Bad Gateway y la factura no queda registrada en la base de datos."
  },
  {
    titulo: "Falla en servidor de impresión central - Cola atascada",
    categoria: "Impresoras",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "El spooler de impresión en el servidor dejó de responder. Hay más de 45 trabajos de impresión retenidos y ningún equipo puede imprimir."
  },
  {
    titulo: "Error de suma de comprobación en BD de Taller",
    categoria: "Software",
    prioridad: "ALTA",
    estado: "EN_PROCESO",
    descripcion: "La aplicación de taller muestra el error 'Corrupt DB Checksum at block 0x8F4A' al intentar abrir la orden de trabajo #4502."
  },
  {
    titulo: "Computadora emite 3 pitidos continuos al arrancar",
    categoria: "Hardware",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El equipo de escritorio de recepción no da video al encender y la tarjeta madre emite 3 pitidos cortos consecutivos (falla de módulo RAM)."
  },
  {
    titulo: "Fuga de memoria RAM en software de diagnóstico",
    categoria: "Software",
    prioridad: "MEDIA",
    estado: "EN_PROCESO",
    descripcion: "El programa de scanner automotriz consume progresivamente hasta el 98% de la memoria RAM tras 1 hora de uso continuo y congela el sistema."
  },
  {
    titulo: "Pérdida intermitente de paquetes de red en Switch Refacciones",
    categoria: "Redes / Conectividad",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "Monitoreo detecta 35% de pérdida de paquetes ping hacia la puerta de enlace en el switch Cisco del área de refacciones."
  },
  {
    titulo: "Certificado SSL expirado en portal de Administración",
    categoria: "Redes / Conectividad",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "El navegador despliega una pantalla roja de advertencia 'La conexión no es privada (NET::ERR_CERT_DATE_INVALID)' al entrar al portal interno."
  },
  {
    titulo: "Impresora de tickets imprime jeroglíficos y símbolos",
    categoria: "Impresoras",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "La mini impresora de caja emite líneas infinitas de caracteres aleatorios en lugar de los textos de la nota de venta."
  },
  {
    titulo: "Error de DLL faltante MSVCR120.dll en cotizador",
    categoria: "Software",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "Al ejecutar el cotizador ejecutable aparece el mensaje 'La ejecución de código no puede continuar porque no se encontró MSVCR120.dll'."
  },
  {
    titulo: "Disco duro con clics metálicos (Fallo físico inminente)",
    categoria: "Hardware",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "El disco duro secundario del equipo de dibujo mecánico realiza ruidos de clics constantes y el explorador de archivos se traba al intentar leerlo."
  },
  {
    titulo: "Teclado de caja escribe caracteres dobles (Key Chattering)",
    categoria: "Hardware",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "Al presionar la tecla '0' o 'Enter' se digita de 2 a 3 veces consecutivas provocando errores en el ingreso de montos de cobro."
  },
  {
    titulo: "Acceso denegado en unidad de red Z:\\Sistemas\\Respaldos",
    categoria: "Accesos / Cuentas",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El usuario intenta entrar a la carpeta de respaldos y el sistema operativo devuelve el mensaje 'No tiene permisos para acceder a esta carpeta'."
  },
  {
    titulo: "Falla de batería CMOS - BIOS pierde fecha en cada reinicio",
    categoria: "Hardware",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "Cada vez que se apaga la computadora de facturación, la fecha vuelve al 01/01/2009 desconfigurando los certificados digitales SAT."
  },
  {
    titulo: "Error de conexión ODBC con SQL Server",
    categoria: "Software",
    prioridad: "ALTA",
    estado: "EN_PROCESO",
    descripcion: "Se perdió el enlace ODBC 'SQL_SITTI_PROD'. El error indica 'Server is not responding or connection was forcibly closed'."
  },
  {
    titulo: "Lector de código de barras USB se desconecta cada 5 min",
    categoria: "Hardware",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El escáner USB Honeywell emite un sonido de desconexión periódicamente y deja de leer los códigos de barra hasta reinstalar el puerto USB."
  },
  {
    titulo: "Cable HDMI de monitor dañado (Parpadeo verde)",
    categoria: "Hardware",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "La pantalla parpadea con líneas verdes verticales al mover ligeramente el cable de video conectado a la tarjeta gráfica."
  },
  {
    titulo: "Error al adjuntar archivos >25MB en correo Outlook",
    categoria: "Software",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "El servidor SMTP rechaza los correos salientes con archivos comprimidos que exceden el límite de tamaño permitido."
  },
  {
    titulo: "Sobrecalentamiento en servidor de archivos (>85°C)",
    categoria: "Hardware",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "Alerta del sensor iDRAC: La temperatura de la CPU en el nodo 2 superó los 85 grados Celsius por fallo en el extractor de aire del gabinete."
  },
  {
    titulo: "Falla de autenticación Radius en VPN corporativa",
    categoria: "Redes / Conectividad",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "El servidor Radius rechaza las solicitudes de conexión remota devolviendo el código de error 'Radius Challenge Rejected'."
  },
  {
    titulo: "Pantalla táctil de terminal de Taller descalibrada",
    categoria: "Hardware",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El toque en la pantalla táctil de la consola de diagnóstico se registra a 5 cm de distancia de donde el usuario toca con el dedo."
  },
  {
    titulo: "Multifuncional arroja código E-02 (Atasco de escáner)",
    categoria: "Impresoras",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El cristal de escaneo de la multifuncional Kyocera se quedó trabado a la mitad e impide realizar copias fotostáticas."
  },
  {
    titulo: "Licencia de Windows desactivada tras actualización",
    categoria: "Software",
    prioridad: "BAJA",
    estado: "ABIERTO",
    descripcion: "Aparece la marca de agua 'Activar Windows - Ve a Configuración' tras la última actualización de Windows 11 KB5034441."
  },
  {
    titulo: "Desincronización en réplica de base de datos secundaria",
    categoria: "Redes / Conectividad",
    prioridad: "ALTA",
    estado: "EN_PROCESO",
    descripcion: "La réplica de lectura muestra un retraso de más de 4,000 transacciones con respecto al nodo primario de base de datos."
  },
  {
    titulo: "Puerto RJ45 integrado en tarjeta madre dañado",
    categoria: "Hardware",
    prioridad: "MEDIA",
    estado: "ABIERTO",
    descripcion: "El puerto de red integrado no enciende los LEDs indicador verde/naranja y no reconoce el cable de red insertado."
  },
  {
    titulo: "Time Out al consultar catálogo de partes en línea",
    categoria: "Software",
    prioridad: "ALTA",
    estado: "ABIERTO",
    descripcion: "La consulta de números de parte al servidor central de Nissan expira después de 30 segundos sin entregar resultados."
  }
];

async function addErrorTickets() {
  console.log('🚀 Agregando 25 nuevos tickets de errores técnicos...');

  const usuarios = await prisma.usuario.findMany({
    include: { rol: true }
  });

  const solicitantes = usuarios.filter(u => !u.rol.nombre.toLowerCase().includes('tecnic'));
  const tecnicos = usuarios.filter(u => u.rol.nombre.toLowerCase().includes('tecnic'));
  const areas = await prisma.area.findMany();
  const categorias = await prisma.categoria.findMany();
  const prioridades = await prisma.prioridad.findMany();
  const estados = await prisma.estado.findMany();

  // Obtener el número de folio más alto actual
  const ticketsExistentes = await prisma.ticket.findMany({
    select: { folio: true }
  });

  let maxFolio = 100;
  for (const t of ticketsExistentes) {
    const numStr = t.folio.replace(/\D/g, '');
    const num = parseInt(numStr, 10);
    if (!isNaN(num) && num > maxFolio) {
      maxFolio = num;
    }
  }

  let creados = 0;

  for (const tData of nuevosErroresTickets) {
    maxFolio++;
    const folio = `TKT-${String(maxFolio).padStart(3, '0')}`;

    const areaObj = areas[Math.floor(Math.random() * areas.length)];
    const catObj = categorias.find(c => c.nombre.toLowerCase().includes(tData.categoria.toLowerCase())) || categorias[0];
    const prioObj = prioridades.find(p => p.nombre.toUpperCase() === tData.prioridad.toUpperCase()) || prioridades[0];
    const estadoObj = estados.find(e => e.nombre.toUpperCase() === tData.estado.toUpperCase()) || estados[0];

    const solicitante = solicitantes[Math.floor(Math.random() * solicitantes.length)] || usuarios[0];

    let responsableId: number | null = null;
    if (estadoObj.nombre !== 'ABIERTO' && tecnicos.length > 0) {
      responsableId = tecnicos[Math.floor(Math.random() * tecnicos.length)].id_usuario;
    }

    try {
      const ticketNuevo = await prisma.ticket.create({
        data: {
          folio,
          titulo: tData.titulo,
          descripcion: tData.descripcion,
          id_solicitante: solicitante.id_usuario,
          id_responsable: responsableId,
          id_area: areaObj.id_area,
          id_categoria: catObj.id_categoria,
          id_prioridad: prioObj.id_prioridad,
          id_estado: estadoObj.id_estado,
        },
      });

      creados++;

      // Crear notificaciones para TODOS los técnicos en la base de datos
      for (const tec of tecnicos) {
        await prisma.notificacion.create({
          data: {
            id_usuario: tec.id_usuario,
            id_ticket: ticketNuevo.id_ticket,
            titulo: `📌 Nuevo ticket en ${areaObj.nombre}`,
            mensaje: `El usuario ${solicitante.nombre} ha reportado: "${ticketNuevo.titulo}" (${ticketNuevo.folio})`,
            tipo: 'ticket_creado',
            leido: false,
          },
        });
      }
    } catch (err) {
      console.error(`Error creando ticket ${folio}:`, err);
    }
  }

  console.log(`✅ ¡${creados} nuevos tickets de errores técnicos creados con éxito!`);
  console.log(`🔔 Notificaciones generadas y enviadas a todos los técnicos.`);
}

addErrorTickets()
  .catch(e => {
    console.error('❌ Error al agregar tickets:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
