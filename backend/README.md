# 🐳 SITTI Backend - Docker Setup

## Descripción

Backend API para **SITTI**: Sistema de Gestión de Tickets del Departamento de TI de Nissan Cuautla.

**Stack:**
- Node.js 24
- Express.js
- TypeScript
- PostgreSQL 16
- Prisma ORM
- JWT & bcrypt

## 📋 Requisitos Previos

- **Docker** 20.10+
- **Docker Compose** 2.0+

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd sitti
```

### 2. Levantar los servicios

```bash
docker-compose up --build
```

Esto va a:
- ✅ Crear contenedor PostgreSQL con BD `sitti_db`
- ✅ Construir imagen del backend
- ✅ Instalar dependencias
- ✅ Ejecutar migraciones Prisma
- ✅ Seedear catálogos (Roles, Áreas, Categorías, etc.)
- ✅ Iniciar servidor en puerto `3000`
- ✅ Levantar frontend en puerto `5173`

### 3. Verificar que funciona

```bash
# En otra terminal
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-12-05T23:40:29.138Z"
}
```

## 📦 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuración (env, database)
│   ├── controllers/    # Controladores (próximamente)
│   ├── middleware/     # Middlewares (próximamente)
│   ├── routes/         # Rutas (próximamente)
│   ├── services/       # Servicios (próximamente)
│   ├── validators/     # Validadores Zod (próximamente)
│   ├── utils/          # Utilidades (próximamente)
│   ├── types/          # TypeScript types (próximamente)
│   ├── app.ts          # Aplicación Express
│   └── server.ts       # Punto de entrada
├── prisma/
│   ├── schema.prisma   # Esquema de base de datos
│   ├── seed.ts         # Script de seeding
│   └── migrations/     # Migraciones (generadas automáticamente)
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env                # Variables de entorno (local)
```

## 🗄️ Base de Datos

### Credenciales (Desarrollo)

```
Usuario: sitti_user
Contraseña: sitti_password
Base de datos: sitti_db
Host: postgres (en Docker) | localhost (local)
Puerto: 5432
```

### Catálogos incluidos en Seed

**Roles:**
- Administrador
- Técnico
- Usuario

**Áreas:**
- Departamento de TI
- Recursos Humanos
- Contabilidad
- Ventas
- Operaciones

**Categorías:**
- Hardware
- Software
- Redes / Conectividad
- Impresoras
- Accesos / Cuentas
- Otros

**Prioridades:**
- BAJA
- MEDIA
- ALTA

**Estados:**
- ABIERTO
- ASIGNADO
- EN_PROCESO
- PENDIENTE
- RESUELTO
- CERRADO

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Ver logs del backend
docker-compose logs backend -f

# Ver logs de la base de datos
docker-compose logs postgres -f

# Ver logs de todo
docker-compose logs -f
```

### Base de Datos

```bash
# Abrir Prisma Studio (gestor gráfico)
docker-compose exec backend npm run db:studio

# Ver migraciones pendientes
docker-compose exec backend npx prisma migrate status

# Crear nueva migración
docker-compose exec backend npx prisma migrate dev --name <nombre>

# Resetear BD (⚠️ eliminará toda la data)
docker-compose exec backend npm run db:reset
```

### Build & Deploy

```bash
# Construir para producción
docker-compose build --no-cache

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v
```

## 📡 Endpoints Base

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Info de la API |
| GET | `/health` | Estado del servidor |

## 🔄 Trasladar a Otra Máquina

### Opción 1: Clonar y ejecutar (Recomendado)

```bash
git clone <repo-url>
cd sitti
docker-compose up --build
```

Las migraciones se ejecutan automáticamente. ✅

### Opción 2: Exportar base de datos completa

```bash
# En la máquina original
docker-compose exec postgres pg_dump -U sitti_user sitti_db > backup.sql

# En la máquina destino
docker-compose up -d postgres
docker-compose exec postgres psql -U sitti_user sitti_db < backup.sql
```

## ⚠️ Notas Importantes

- Las **contraseñas en `.env`** son solo para desarrollo. En producción usar variables seguras (AWS Secrets Manager, HashiCorp Vault, etc.)
- El schema Prisma incluye todas las **relaciones necesarias**
- Las migraciones son **reversibles** si es necesario
- No toques los archivos en `prisma/migrations/` manualmente

## 📚 Documentación Relacionada

- [Prisma ORM](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## ❓ Preguntas Frecuentes

**P: ¿Cómo cambio las credenciales de BD?**
R: Edita `docker-compose.yml` en la sección `postgres` (environment) y `.env`

**P: ¿Qué pasa si borro un contenedor?**
R: Los datos en `postgres_data` se conservan. Solo reconstruye con `docker-compose up`

**P: ¿Cómo conecto desde aplicación externa?**
R: Usa `postgresql://sitti_user:sitti_password@localhost:5432/sitti_db`

---

Desenvolvido con ❤️ para SITTI - Nissan Cuautla
