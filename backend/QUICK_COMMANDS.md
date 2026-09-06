# 🔧 COMANDOS RÁPIDOS - SITTI Backend

## ⚡ Inicio Rápido

```bash
# Iniciar todo (recomendado)
./start-dev.sh

# O manualmente
docker-compose up --build
```

---

## 📊 Base de Datos

### Ver datos en interfaz gráfica
```bash
docker-compose exec backend npm run db:studio
```
Abre http://localhost:5555 automáticamente

### Ver estado de migraciones
```bash
docker-compose exec backend npx prisma migrate status
```

### Crear nueva migración
```bash
# Después de cambiar schema.prisma
docker-compose exec backend npx prisma migrate dev --name <nombre_descriptivo>
```

Ejemplo:
```bash
docker-compose exec backend npx prisma migrate dev --name add_tickets_table
```

### Resetear BD completamente (⚠️ elimina todos los datos)
```bash
docker-compose exec backend npm run db:reset
```

### Ejecutar seed manualmente
```bash
docker-compose exec backend npm run db:seed
```

---

## 🚀 Server & Desarrollo

### Ver logs del backend en vivo
```bash
docker-compose logs backend -f
```

### Ver logs de PostgreSQL
```bash
docker-compose logs postgres -f
```

### Ver todos los logs
```bash
docker-compose logs -f
```

### Reiniciar solo el backend
```bash
docker-compose restart backend
```

### Reiniciar solo PostgreSQL
```bash
docker-compose restart postgres
```

### Ejecutar comando en el contenedor del backend
```bash
docker-compose exec backend <comando>
```

Ejemplos:
```bash
# Ver versión de Node
docker-compose exec backend node --version

# Listar archivos
docker-compose exec backend ls -la

# Instalar un paquete (si falta)
docker-compose exec backend npm install <package>
```

---

## 🐳 Docker & Compose

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver imagen construida
```bash
docker images | grep sitti
```

### Reconstruir sin caché (soluciona problemas raros)
```bash
docker-compose build --no-cache
```

### Detener servicios (sin eliminar datos)
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina BD)
```bash
docker-compose down -v
```

### Ver espacio usado
```bash
docker system df
```

### Limpiar imágenes no usadas
```bash
docker image prune -a
```

---

## 🔍 Troubleshooting

### Error: "Port 5432 already in use"
```bash
# Opción 1: Detener contenedores
docker-compose down -v

# Opción 2: Cambiar puerto en docker-compose.yml
# postgres:
#   ports:
#     - "5433:5432"  # Cambia de 5432 a 5433
```

### Error: "Cannot find module @prisma/client"
```bash
docker-compose exec backend npm install
docker-compose restart backend
```

### Error: "Database connection refused"
```bash
# Esperar a que PostgreSQL inicie
docker-compose logs postgres

# O ver healthcheck
docker-compose exec postgres pg_isready -U sitti_user -d sitti_db
```

### Error: "Migraciones pendientes"
```bash
docker-compose exec backend npx prisma migrate deploy
```

### Backend no recarga cambios (hot-reload no funciona)
```bash
docker-compose down
docker-compose up --build
```

### BD corrupta o en estado inconsistente
```bash
docker-compose down -v
docker-compose up --build
# Borra todo y reconstruye limpio
```

---

## 📡 Testing API

### Health check
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-09-05T23:40:29.138Z"
}
```

### API root
```bash
curl http://localhost:3000/
```

Respuesta esperada:
```json
{
  "name": "SITTI API",
  "description": "Sistema de Gestión de Tickets del Departamento de TI",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 💾 Backup y Restauración

### Hacer backup de BD
```bash
docker-compose exec postgres pg_dump -U sitti_user sitti_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar desde backup
```bash
# Primero asegúrate de que PostgreSQL está corriendo
docker-compose up -d postgres

# Espera a que esté listo
sleep 5

# Restaura el backup
docker-compose exec -T postgres psql -U sitti_user sitti_db < backup_YYYYMMDD_HHMMSS.sql
```

### Exportar esquema sin datos
```bash
docker-compose exec postgres pg_dump -U sitti_user --schema-only sitti_db > schema.sql
```

---

## 🔐 Manejo de Credenciales

### Ver credenciales actuales (desarrollo)
```bash
cat backend/.env
```

### Cambiar credenciales para producción
```bash
# Editar docker-compose.yml
nano docker-compose.yml

# Cambiar en la sección postgres:
# environment:
#   POSTGRES_USER: new_user
#   POSTGRES_PASSWORD: strong_password_here
#   POSTGRES_DB: sitti_db

# También actualizar .env
nano backend/.env
# DATABASE_URL="postgresql://new_user:strong_password_here@postgres:5432/sitti_db"
```

---

## 📦 Gestión de Dependencias

### Instalar nueva dependencia
```bash
docker-compose exec backend npm install <package>
```

### Instalar como dev dependency
```bash
docker-compose exec backend npm install --save-dev <package>
```

### Actualizar dependencias
```bash
docker-compose exec backend npm update
```

### Ver árbol de dependencias
```bash
docker-compose exec backend npm list
```

---

## 🧹 Limpiar Espacio

### Eliminar node_modules y reinstalar
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Ver tamaño de BD
```bash
docker-compose exec postgres du -sh /var/lib/postgresql/data
```

---

## 📖 Recursos Útiles

- Prisma Docs: https://www.prisma.io/docs/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Docker Docs: https://docs.docker.com/
- Express Docs: https://expressjs.com/

---

## 📞 Soporte Rápido

Si algo no funciona:

1. Ver logs: `docker-compose logs -f`
2. Resetear todo: `docker-compose down -v && docker-compose up --build`
3. Revisar `.env` si hay credenciales

¡Si el problema persiste, revisar `backend/README.md` o `DOCKER_SETUP.md`!
