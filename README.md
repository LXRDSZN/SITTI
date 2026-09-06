# 🎫 SITTI - Sistema Integral de Gestión de Tickets

Plataforma de gestión de tickets de soporte técnico con roles basados en área y autenticación con JWT.

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Instalación (Backend)
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Instalación (Frontend)
```bash
npm install
npm run dev
```

### Acceder
```
http://localhost:5173
```

### Usuarios Demo
```
usuario.ventas@sitti.com       / password123  (Usuario)
tecnico.taller@sitti.com       / password123  (Técnico)
admin@sitti.com                / password123  (Admin)
```

---

## 📋 Características

✅ **Autenticación** - JWT + bcrypt  
✅ **Roles** - Usuario, Técnico, Administrador  
✅ **Áreas** - Ventas, Refacciones, Taller, Administración  
✅ **Tickets** - Crear, asignar, resolver  
✅ **Dashboards** - 23 rutas pre-construidas  
✅ **Responsive** - Funciona en mobile y desktop  
✅ **Dark Mode** - Tema oscuro completo  

---

## 🏗️ Stack

**Frontend**: React 19 + React Router 8 + Tailwind CSS + Vite  
**Backend**: Node.js + Express + TypeScript + Prisma  
**Database**: PostgreSQL  
**Auth**: JWT + bcrypt  

---

## 📁 Estructura

```
sitti/
├── app/                    # Frontend React
│   ├── routes/            # 23 rutas (usuario, tecnico, admin)
│   ├── components/        # UI reutilizable
│   ├── services/          # API client
│   ├── context/           # AuthContext
│   └── types/             # TypeScript definitions
│
├── backend/               # Backend Node.js
│   ├── src/              # Código fuente
│   ├── prisma/           # Schema y migraciones
│   └── package.json
│
├── docs/                 # Documentación
│   ├── RESUMEN_EJECUTIVO.md
│   ├── SETUP_FINAL.md
│   ├── FLOWCHART.md
│   ├── BACKEND_INTEGRATION.md
│   └── ... más archivos
│
└── README.md            # Este archivo
```

---

## 📚 Documentación

Ver `/docs` para documentación completa:

- **RESUMEN_EJECUTIVO.md** - Resumen del proyecto (START HERE 👈)
- **SETUP_FINAL.md** - Instrucciones detalladas
- **FLOWCHART.md** - Diagramas y flujos
- **BACKEND_INTEGRATION.md** - Endpoints API
- **CAMBIOS_REALIZADOS.md** - Qué se modificó
- **CHECKLIST.md** - Estado de tareas

---

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con expiración (7 días)
- CORS restrictivo (localhost)
- Bearer token authentication
- Variables de entorno

---

## 🛠️ Desarrollo

### Backend
```bash
cd backend
npm run dev          # Dev server
npm run db:seed      # Recargar datos
npm run db:studio    # Abrir Prisma Studio
npm run typecheck    # Validar TypeScript
```

### Frontend
```bash
npm run dev          # Dev server
npm run build        # Build producción
npm run typecheck    # Validar TypeScript
```

---

## 🧪 Pruebas

```bash
# Test backend
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario.ventas@sitti.com","password":"password123"}'
```

---

## 🎯 Próximos Pasos (Fase 2)

- [ ] Endpoints de tickets
- [ ] Middleware de autorización
- [ ] Conectar dashboards con datos reales
- [ ] Filtros y búsqueda
- [ ] Notificaciones

---

## 📊 Estado

**Fase 1**: ✅ COMPLETADA (Autenticación)  
**Fase 2**: 🟡 PENDIENTE (Tickets)  
**Fase 3**: 🟠 FUTURO (Testing)  
**Fase 4**: 🔴 FUTURO (Avanzado)

---

## 📞 Soporte

Ver `docs/SETUP_FINAL.md` sección "Troubleshooting"

---

**Última actualización**: 2026-09-06  
**Versión**: 1.0.0  
**Estado**: ✅ LISTO

Documentación completa en `/docs` 👉
