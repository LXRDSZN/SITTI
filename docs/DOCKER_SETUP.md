# 🐳 SITTI - Configuración Completa con Docker

## 📋 Resumen de lo Implementado

### Base de Datos
- ✅ **Schema Prisma** completamente definido con 11 modelos
- ✅ **Migraciones automáticas** en Docker
- ✅ **Script de seeding** con catálogos (Roles, Áreas, Categorías, Prioridades, Estados)
- ✅ **PostgreSQL 16** en Alpine (optimizado)
- ✅ **Portabilidad garantizada** mediante migraciones

### Backend
- ✅ **Express.js** + TypeScript
- ✅ **Prisma ORM** configurado
- ✅ **Estructura modular** lista para desarrollo
- ✅ **Server robusto** con manejo de errores y shutdown graceful
- ✅ **Hot-reload** en desarrollo (tsx watch)

### Docker & Compose
- ✅ **Multi-stage Dockerfile** (dev, build, prod)
- ✅ **Docker Compose** con 3 servicios (PostgreSQL, Backend, Frontend)
- ✅ **Health checks** para PostgreSQL
- ✅ **Volúmenes optimizados** para desarrollo
- ✅ **Red privada** entre contenedores

## 🚀 Inicio Rápido

### Opción 1: Script automático (Recomendado)
```bash
./start-dev.sh
```

### Opción 2: Docker Compose directo
```bash
docker-compose up --build
```

Esto va a:
1. Crear contenedor PostgreSQL
2. Crear BD `sitti_db`
3. Instalar dependencias del backend
4. Ejecutar migraciones Prisma
5. Ejecutar seed de catálogos
6. Iniciar backend en `http://localhost:3000`
7. Iniciar frontend en `http://localhost:5173`

## 📦 Estructura Implementada

```
sitti/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              ✅ Gestión de variables de entorno
│   │   │   └── database.ts         ✅ Conexión Prisma
│   │   ├── controllers/            📋 Listos para implementación
│   │   ├── middleware/             📋 Listos para implementación
│   │   ├── routes/                 📋 Listos para implementación
│   │   ├── services/               📋 Listos para implementación
│   │   ├── validators/             📋 Listos para implementación
│   │   ├── utils/                  📋 Listos para implementación
│   │   ├── types/                  📋 Listos para implementación
│   │   ├── app.ts                  ✅ Configuración Express
│   │   └── server.ts               ✅ Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma           ✅ 11 modelos de datos
│   │   ├── seed.ts                 ✅ Script de seeding
│   │   └── migrations/             ✅ Se genera automáticamente
│   ├── .env                        ✅ Variables locales
│   ├── .env.example                ✅ Plantilla
│   ├── package.json                ✅ Dependencias
│   ├── tsconfig.json               ✅ Configuración TS
│   ├── Dockerfile                  ✅ Multi-stage
│   ├── .gitignore                  ✅ Configurado
│   └── README.md                   ✅ Documentación
├── docker-compose.yml              ✅ 3 servicios (postgres, backend, frontend)
├── start-dev.sh                    ✅ Script de inicio
├── .dockerignore                   ✅ Optimización
└── .env.example                    ✅ Plantilla raíz
```

## 🗄️ Modelo de Datos (Prisma Schema)

### Catálogos
- **Rol**: id_rol, nombre
- **Area**: id_area, nombre, activo
- **Categoria**: id_categoria, nombre, descripcion, activo
- **Prioridad**: id_prioridad, nombre
- **Estado**: id_estado, nombre

### Entidades Principales
- **Usuario**: id_usuario, id_rol FK, id_area FK, nombre, correo UNIQUE, password_hash, activo, creado_en
- **Ticket**: id_ticket, folio UNIQUE, id_solicitante FK, id_responsable FK (NULL), id_area FK, id_categoria FK, id_prioridad FK, id_estado FK, titulo, descripcion, fecha_creacion, fecha_actualizacion, fecha_cierre (NULL)
- **Comentario**: id_comentario, id_ticket FK, id_usuario FK, comentario, fecha
- **Adjunto**: id_adjunto, id_ticket FK, id_usuario FK, nombre_archivo, ruta_archivo, tipo_mime, fecha
- **HistorialTicket**: id_historial, id_ticket FK, id_usuario FK, accion, valor_anterior, valor_nuevo, fecha

### Relaciones Principales
✅ USUARIOS conectados dos veces a TICKETS:
  - `solicitante` (Usuario → Ticket)
  - `responsable` (Usuario → Ticket, nullable)

✅ Cascade delete para Comentarios, Adjuntos, Historial
✅ Restrict delete para Usuarios, Catálogos
✅ SetNull para responsable si usuario se elimina

## 🛠️ Comandos Útiles

### Ver logs
```bash
# Backend
docker-compose logs backend -f

# Base de datos
docker-compose logs postgres -f

# Todo
docker-compose logs -f
```

### Ejecutar comandos en contenedores
```bash
# Abrir Prisma Studio (gestor gráfico de BD)
docker-compose exec backend npm run db:studio

# Ver migraciones
docker-compose exec backend npx prisma migrate status

# Crear nueva migración
docker-compose exec backend npx prisma migrate dev --name <nombre>

# Resetear BD (⚠️ pierde todos los datos)
docker-compose exec backend npm run db:reset

# Ver semillas ejecutadas
docker-compose exec backend npm run db:seed
```

### Control de servicios
```bash
# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir sin caché
docker-compose build --no-cache

# Reiniciar un servicio
docker-compose restart backend
```

## 📡 Endpoints Base Disponibles

| Método | URL | Estado |
|--------|-----|--------|
| GET | `http://localhost:3000/` | ✅ Info API |
| GET | `http://localhost:3000/health` | ✅ Health check |

## 🔄 Portabilidad: Trasladar a Otra Máquina

### Escenario 1: Máquina con Docker
```bash
git clone <repo-url>
cd sitti
docker-compose up --build
# ✅ Automático: migraciones + seed
```

### Escenario 2: Servidor de Producción
```bash
# En el servidor
git clone <repo-url>
cd sitti

# Cambiar credenciales en docker-compose.yml:
# - POSTGRES_USER
# - POSTGRES_PASSWORD
# - DATABASE_URL

# Actualizar variables de entorno
# - NODE_ENV: production
# - JWT_SECRET: <secure-key>
# - Etc.

docker-compose -f docker-compose.prod.yml up -d
# (Necesitamos crear docker-compose.prod.yml después)
```

### Escenario 3: Backup y Restauración
```bash
# Backup de BD
docker-compose exec postgres pg_dump -U sitti_user sitti_db > backup.sql

# En otra máquina
docker-compose up -d postgres
docker-compose exec postgres psql -U sitti_user sitti_db < backup.sql
```

## ✅ Verificación de Configuración

```bash
# 1. Ver si los contenedores están corriendo
docker-compose ps

# 2. Verificar conexión a BD
docker-compose exec backend npm run db:migrate status

# 3. Probar API
curl http://localhost:3000/health

# 4. Ver logs de inicialización
docker-compose logs backend
```

## 📊 Credenciales por Defecto (Desarrollo)

| Variable | Valor |
|----------|-------|
| DB User | `sitti_user` |
| DB Password | `sitti_password` |
| DB Name | `sitti_db` |
| DB Host (Docker) | `postgres` |
| DB Host (Local) | `localhost` |
| DB Port | `5432` |
| Backend Port | `3000` |
| Frontend Port | `5173` |

⚠️ **En producción**: usar variables seguras (AWS Secrets, HashiCorp Vault, etc.)

## 🐳 ¿Por qué Docker para esto?

1. **Portabilidad**: Funciona igual en tu laptop, servidor de otro, en la nube
2. **Consistencia**: Los desarrolladores trabajan con exactamente lo mismo
3. **Aislamiento**: PostgreSQL no afecta tu sistema
4. **Escalabilidad**: Fácil pasar a Kubernetes después
5. **Reproducibilidad**: Nadie dice "en mi máquina sí funciona" 😄

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## 🎯 Próximos Pasos (Fases)

Después de verificar que la BD y Docker funcionan:

1. **Autenticación** (JWT, bcrypt)
2. **Controladores y Rutas** (CRUD básico)
3. **Validadores** (Zod)
4. **Servicios** (Lógica de negocio)
5. **Middleware** (Auth, Error handling)
6. **Tests** (Unitarios, integración)
7. **API Documentation** (Swagger/OpenAPI)

---

✅ **Status**: Base de datos y Docker configurados correctamente  
📅 **Última actualización**: Septiembre 2024  
👤 **Proyecto**: SITTI - Nissan Cuautla  
