# 🚀 Guía de Inicio Rápido - SITTI

## ⚡ Forma MÁS RÁPIDA (Recomendada)

### Opción 1: Con script automático

```bash
cd /home/lxrdszn/Desktop/Projects/sitti
./start-dev.sh
```

Esto inicia Backend + Frontend automáticamente.

Luego abre en navegador: **http://localhost:5173**

---

## 📋 Forma Manual (Dos Terminales)

### Terminal 1 - Backend

```bash
cd /home/lxrdszn/Desktop/Projects/sitti/backend
npm run dev
```

Esperarás ver:
```
✓ Database connected successfully
✓ Server running on http://localhost:3000
```

### Terminal 2 - Frontend

```bash
cd /home/lxrdszn/Desktop/Projects/sitti
npm run dev
```

Esperarás ver:
```
✓ Local: http://localhost:5173
```

### Navegador

Abre: **http://localhost:5173**

---

## 🔑 Credenciales de Prueba

```
Usuario:   usuario.ventas@sitti.com / password123
Técnico:   tecnico.taller@sitti.com / password123
Admin:     admin@sitti.com / password123
```

---

## ✅ Verificar que funciona

```bash
# Backend health
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173 | grep "<title>"

# API
curl http://localhost:3000/tickets | jq '.tickets | length'
```

---

## 🐛 Problemas?

**Backend no conecta a BD:**
```bash
psql -U postgres -d sitti_db -c "SELECT 1"
```

**Puerto ocupado:**
```bash
# Ver qué proceso está usando el puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>
```

**Limpiar caché:**
```bash
cd /home/lxrdszn/Desktop/Projects/sitti
rm -rf node_modules .react-router
npm install
```

---

## 📚 Documentación

- `README.md` - Información del proyecto
- `docs/` - Toda la documentación técnica
- `docs/RESUMEN_EJECUTIVO.md` - Resumen ejecutivo
- `docs/FASE_2_TICKETS.md` - Documentación de tickets

---

**¡Listo! Ahora puedes desarrollar.** 🚀
