# Despliegue de SITTI en Arch Linux

Este despliegue usa Docker Compose con PostgreSQL, backend, frontend SSR y
Nginx. Solo Nginx publica el puerto `80`; PostgreSQL y los servicios internos
no quedan expuestos a la red.

## Requisitos

En la máquina Arch:

```bash
sudo pacman -Syu --needed docker docker-compose git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Cierra y vuelve a abrir la sesión después de agregar el usuario al grupo
`docker`.

## Instalar el proyecto

```bash
git clone git@github.com:LXRDSZN/SITTI.git
cd SITTI
cp .env.production.example .env.production
```

Edita `.env.production` y reemplaza todos los valores de ejemplo. Usa secretos
largos y aleatorios:

```bash
openssl rand -base64 32
```

`CORS_ORIGINS` debe contener la URL desde la que accederán los usuarios, por
ejemplo:

```text
CORS_ORIGINS=http://192.168.1.50
```

No se debe versionar `.env.production`.

## Iniciar SITTI

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

La migración de Prisma se ejecuta antes de iniciar el backend. El primer
arranque puede tardar mientras se descargan las imágenes y se construyen los
contenedores.

Verifica el estado:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl http://localhost/health
```

El sistema queda disponible en:

```text
http://IP_DE_LA_MAQUINA
```

## Operación

```bash
# Ver logs
docker compose --env-file .env.production -f docker-compose.production.yml logs -f backend

# Actualizar después de traer cambios
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build

# Detener sin eliminar datos
docker compose --env-file .env.production -f docker-compose.production.yml down
```

No uses `docker compose down -v` en producción: eliminaría el volumen de
PostgreSQL y todos los datos.

## Acceso desde la red local

Si Arch usa `ufw`, `firewalld` o reglas nftables, permite únicamente el puerto
HTTP que corresponda. Para una red local con firewall activo:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

La configuración no publica el puerto de PostgreSQL. No se debe abrir `5432`
para los usuarios.

## Respaldo de PostgreSQL

Antes de actualizaciones importantes, genera un respaldo:

```bash
docker exec sitti-postgres pg_dump \
  -U "$POSTGRES_USER" "$POSTGRES_DB" > "backup-$(date +%F).sql"
```

Si se usa el Compose de producción, el contenedor de PostgreSQL no tiene nombre
fijo; consulta el nombre con `docker compose ps -q postgres` o ejecuta:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup.sql
```
