import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const nombres = [
  "Alejandro", "Sofía", "Fernando", "Valeria", "Diego", "Camila", "Mateo", "Lucía",
  "Gabriel", "Mariana", "Santiago", "Daniela", "Leonardo", "Paula", "Javier", "Elena",
  "Rodrigo", "Natalia", "Sebastián", "Andrea", "Emilio", "Regina", "Adrián", "Renata",
  "Miguel", "Ximena", "Ángel", "Isabella", "David", "Victoria", "Esteban", "Jimena",
  "Guillermo", "Carolina", "Ricardo", "Fernanda", "Hugo", "Giselle", "Raúl", "Adriana",
  "César", "Monika", "Arturo", "Berenice", "Manuel", "Claudia", "Oscar", "Patricia", "Iván"
];

const apellidos = [
  "Hernández", "García", "Martínez", "López", "González", "Pérez", "Rodríguez", "Sánchez",
  "Ramírez", "Cruz", "Flores", "Gómez", "Morales", "Vázquez", "Reyes", "Jiménez",
  "Torres", "Díaz", "Gutiérrez", "Mendoza", "Ruiz", "Aguilar", "Ortiz", "Moreno",
  "Castillo", "Romero", "Álvarez", "Méndez", "Chávez", "Rivera", "Juárez", "Ramos",
  "Domínguez", "Herrera", "Medina", "Castro", "Vargas", "Guzmán", "Velázquez", "Salazar"
];

const ticketsPlantillas = [
  { titulo: "Fallo en terminal de cobro (POS)", categoria: "Hardware", prioridad: "ALTA", descripcion: "La terminal de cobro de la caja principal no procesa tarjetas y marca error de comunicación." },
  { titulo: "Error de autenticación en módulo SAP", categoria: "Software", prioridad: "ALTA", descripcion: "Al intentar ingresar al módulo de compras, aparece el mensaje 'Credenciales no autorizadas'." },
  { titulo: "Impresora de etiquetas no responde", categoria: "Impresoras", prioridad: "MEDIA", descripcion: "La impresora térmica de etiquetas en almacén dejó de imprimir recibos de entrada." },
  { titulo: "Restablecimiento de contraseña de correo", categoria: "Accesos / Cuentas", prioridad: "BAJA", descripcion: "El usuario olvidó su contraseña de acceso al correo corporativo tras las vacaciones." },
  { titulo: "Pantalla azul (BSOD) constante", categoria: "Hardware", prioridad: "ALTA", descripcion: "La computadora se reinicia inesperadamente mostrando pantalla azul de error en memoria." },
  { titulo: "Lentitud extrema en cotizador web", categoria: "Software", prioridad: "MEDIA", descripcion: "La plataforma de cotizaciones tarda más de 3 minutos en calcular los costos de envío." },
  { titulo: "Fallo de conexión WiFi corporativa", categoria: "Redes / Conectividad", prioridad: "MEDIA", descripcion: "Los dispositivos en el área de ventas no logran obtener dirección IP por WiFi." },
  { titulo: "Teclado y mouse inalámbrico dañados", categoria: "Hardware", prioridad: "BAJA", descripcion: "El kit de teclado y mouse sufrió un derrame de líquido y dejó de funcionar." },
  { titulo: "Acceso a carpeta compartida de Finanzas", categoria: "Accesos / Cuentas", prioridad: "BAJA", descripcion: "Se solicita permiso de lectura y escritura en el directorio /Finanzas/Presupuestos." },
  { titulo: "Escáner de código de barras desconfigurado", categoria: "Hardware", prioridad: "MEDIA", descripcion: "El lector óptico transmite caracteres extraños al escanear los códigos de partes." },
  { titulo: "Sin audio en sala de juntas principal", categoria: "Otros", prioridad: "BAJA", descripcion: "El sistema de videoconferencia no emite sonido durante las reuniones grupales." },
  { titulo: "Error en servidor de respaldos", categoria: "Redes / Conectividad", prioridad: "ALTA", descripcion: "El respaldo nocturno automático falló debido a tiempo de espera agotado." },
  { titulo: "Reemplazo de tóner en impresora HP", categoria: "Impresoras", prioridad: "BAJA", descripcion: "La impresora del departamento requiere cambio de tóner negro urgente." },
  { titulo: "Instalación de software de diseño", categoria: "Software", prioridad: "BAJA", descripcion: "Requiero la instalación de AutoCAD versión 2024 para nuevos planos." },
  { titulo: "Fallo en cargador de laptop Dell", categoria: "Hardware", prioridad: "MEDIA", descripcion: "El adaptador de corriente de la laptop no carga la batería y parpadea en naranja." },
  { titulo: "Configuración de correo en móvil", categoria: "Accesos / Cuentas", prioridad: "BAJA", descripcion: "Ayuda para sincronizar la cuenta corporativa de Outlook en iPhone institucional." },
  { titulo: "Cable Ethernet dañado en módulo 4", categoria: "Redes / Conectividad", prioridad: "MEDIA", descripcion: "El conector RJ45 de la estación de trabajo se rompió y pierde señal intermitentemente." },
  { titulo: "Error 500 al ingresar al portal RRHH", categoria: "Software", prioridad: "ALTA", descripcion: "Al intentar descargar la última nómina aparece Error Interno de Servidor 500." },
  { titulo: "Solicitud de monitor secundario", categoria: "Hardware", prioridad: "BAJA", descripcion: "Se requiere un segundo monitor HDMI de 24 pulgadas para análisis de datos." },
  { titulo: "Sin señal telefónica IP en oficina", categoria: "Redes / Conectividad", prioridad: "ALTA", descripcion: "El conmutador IP de la mesa de soporte muestra pantalla de registrado fallido." },
  { titulo: "Checador biométrico no registra huella", categoria: "Hardware", prioridad: "ALTA", descripcion: "El lector biométrico de la entrada del personal no reconoce las huellas." },
  { titulo: "Licencia de Microsoft 365 vencida", categoria: "Software", prioridad: "MEDIA", descripcion: "Excel y Word muestran aviso de 'Producto desactivado' al iniciar sesión." },
  { titulo: "Batería de UPS principal descargada", categoria: "Hardware", prioridad: "ALTA", descripcion: "El no-break del rack de comunicaciones emite un pitido continuo por falla de batería." },
  { titulo: "Instalación de antivirus corporativo", categoria: "Software", prioridad: "MEDIA", descripcion: "Equipo formateado requiere instalación del agente de seguridad Endpoint." },
  { titulo: "Fallo en conexión VPN remota", categoria: "Redes / Conectividad", prioridad: "ALTA", descripcion: "No es posible establecer túnel VPN Fortinet desde la conexión doméstica." },
  { titulo: "Ruido anormal en ventilador de PC", categoria: "Hardware", prioridad: "BAJA", descripcion: "El gabinete de la computadora emite un ruido fuerte al encender por la mañana." },
  { titulo: "Restablecimiento de PIN de viáticos", categoria: "Accesos / Cuentas", prioridad: "BAJA", descripcion: "Solicitud de desbloqueo de nip para tarjeta corporativa de viáticos." },
  { titulo: "Papel atascado en impresora matricial", categoria: "Impresoras", prioridad: "MEDIA", descripcion: "La impresora de forma continua atascó las hojas en el rodillo de arrastre." },
  { titulo: "Configuración de firma electrónica", categoria: "Accesos / Cuentas", prioridad: "BAJA", descripcion: "Asistencia para agregar el certificado digital en Adobe Acrobat Reader." },
  { titulo: "Disco duro saturado al 99%", categoria: "Hardware", prioridad: "MEDIA", descripcion: "El disco C: no tiene espacio suficiente y la máquina responde de forma muy lenta." },
  { titulo: "Proyector con imagen desenfocada", categoria: "Otros", prioridad: "BAJA", descripcion: "El proyector de la sala B se observa borroso y requiere ajuste de lente." },
  { titulo: "Error al exportar reporte contable PDF", categoria: "Software", prioridad: "MEDIA", descripcion: "El sistema genera un archivo PDF corrupto de 0 KB al exportar el balance." }
];

async function seed() {
  console.log('🚀 Iniciando creación masiva de 50 usuarios y 32 tickets...');

  // Obtener catálogos
  const roles = await prisma.rol.findMany();
  const areas = await prisma.area.findMany();
  const categorias = await prisma.categoria.findMany();
  const prioridades = await prisma.prioridad.findMany();
  const estados = await prisma.estado.findMany();

  const rolUsuario = roles.find(r => r.nombre.toLowerCase() === 'usuario') || roles[0];
  const rolTecnico = roles.find(r => r.nombre.toLowerCase().includes('tecnic')) || roles[0];
  const rolAdmin = roles.find(r => r.nombre.toLowerCase().includes('admin')) || roles[0];

  const passwordHash = await bcrypt.hash('password123', 10);

  // Crear 45 usuarios nuevos (para llegar a ~50 usuarios en total)
  const usuariosCreados: any[] = [];

  for (let i = 1; i <= 45; i++) {
    const nombreRam = nombres[Math.floor(Math.random() * nombres.length)];
    const apellidoRam1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const apellidoRam2 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const nombreCompleto = `${nombreRam} ${apellidoRam1} ${apellidoRam2}`;
    
    // Normalizar correo electrónico
    const correoSinAcentos = `${nombreRam}.${apellidoRam1}${i}@sitti.com`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.@]/g, "");

    // Área aleatoria
    const areaAleatoria = areas[Math.floor(Math.random() * areas.length)];

    // Asignar rol: 85% usuario, 10% técnico, 5% admin
    let rolAsignado = rolUsuario;
    const randRol = Math.random();
    if (randRol > 0.85 && randRol <= 0.95) {
      rolAsignado = rolTecnico;
    } else if (randRol > 0.95) {
      rolAsignado = rolAdmin;
    }

    try {
      const u = await prisma.usuario.upsert({
        where: { correo: correoSinAcentos },
        update: {},
        create: {
          nombre: nombreCompleto,
          correo: correoSinAcentos,
          password_hash: passwordHash,
          id_rol: rolAsignado.id_rol,
          id_area: areaAleatoria.id_area,
          activo: true,
        },
      });
      usuariosCreados.push(u);
    } catch (err) {
      // Si el correo ya existe, continuar
    }
  }

  // Obtener la lista completa de todos los usuarios
  const todosLosUsuarios = await prisma.usuario.findMany({ include: { rol: true } });
  const todosLosTecnicos = todosLosUsuarios.filter(u => u.rol.nombre.toLowerCase().includes('tecnic'));
  const solicitantesPosibles = todosLosUsuarios.filter(u => !u.rol.nombre.toLowerCase().includes('tecnic'));

  console.log(`✅ Usuarios en la BD: ${todosLosUsuarios.length} usuarios totales.`);

  // Generar exactamente 32 tickets (menos de 35)
  console.log('📝 Generando 32 tickets en diferentes áreas y estados...');
  
  let ticketCount = 0;

  for (let i = 0; i < ticketsPlantillas.length; i++) {
    const tData = ticketsPlantillas[i];
    const folioNum = i + 30; // folios como TKT-030, TKT-031, etc.
    const folio = `TKT-${String(folioNum).padStart(3, '0')}`;

    // Elegir área, categoría, prioridad y estado aleatoriamente
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    // Buscar categoría correspondiente o usar aleatoria
    const catObj = categorias.find(c => c.nombre.toLowerCase().includes(tData.categoria.toLowerCase())) 
      || categorias[Math.floor(Math.random() * categorias.length)];

    const prioObj = prioridades.find(p => p.nombre.toUpperCase() === tData.prioridad.toUpperCase()) 
      || prioridades[Math.floor(Math.random() * prioridades.length)];

    const estadoObj = estados[Math.floor(Math.random() * estados.length)];

    // Solicitante aleatorio
    const solicitante = solicitantesPosibles[Math.floor(Math.random() * solicitantesPosibles.length)] || todosLosUsuarios[0];

    // Responsable (técnico) si el ticket no está solo "ABIERTO"
    let responsableId: number | null = null;
    if (estadoObj.nombre !== 'ABIERTO' && todosLosTecnicos.length > 0) {
      const tec = todosLosTecnicos[Math.floor(Math.random() * todosLosTecnicos.length)];
      responsableId = tec.id_usuario;
    }

    try {
      await prisma.ticket.upsert({
        where: { folio },
        update: {},
        create: {
          folio,
          titulo: tData.titulo,
          descripcion: tData.descripcion,
          id_solicitante: solicitante.id_usuario,
          id_responsable: responsableId,
          id_area: area.id_area,
          id_categoria: catObj.id_categoria,
          id_prioridad: prioObj.id_prioridad,
          id_estado: estadoObj.id_estado,
          fecha_cierre: estadoObj.nombre === 'RESUELTO' || estadoObj.nombre === 'CERRADO' ? new Date() : null,
        },
      });
      ticketCount++;
    } catch (err) {
      console.error(`Error creando ticket ${folio}:`, err);
    }
  }

  console.log(`✅ ${ticketCount} tickets creados exitosamente.`);

  // Generar notificaciones para todos los técnicos
  console.log('🔔 Generando notificaciones para todos los técnicos...');
  const todosLosTickets = await prisma.ticket.findMany({ include: { solicitante: true, area: true } });
  for (const t of todosLosTickets) {
    for (const tec of todosLosTecnicos) {
      const exists = await prisma.notificacion.findFirst({
        where: { id_usuario: tec.id_usuario, id_ticket: t.id_ticket },
      });
      if (!exists) {
        await prisma.notificacion.create({
          data: {
            id_usuario: tec.id_usuario,
            id_ticket: t.id_ticket,
            titulo: `📌 Nuevo ticket en ${t.area.nombre}`,
            mensaje: `El usuario ${t.solicitante.nombre} ha creado el ticket ${t.folio}: "${t.titulo}"`,
            tipo: 'ticket_creado',
            leido: false,
          },
        });
      }
    }
  }
}

seed()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
