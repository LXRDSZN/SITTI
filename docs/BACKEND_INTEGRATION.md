# 🚀 Integración Backend-Frontend - SITTI

## ✅ Completado

### Base de Datos
- ✅ Configuración PostgreSQL en `backend/.env`
- ✅ Migraciones Prisma ejecutadas
- ✅ Seed database ejecutado con:
  - **3 Roles**: Usuario, Técnico, Administrador
  - **4 Áreas**: Ventas, Refacciones, Taller, Administración
  - **6 Categorías**: Hardware, Software, Redes, Impresoras, Accesos, Otros
  - **3 Estados**: Abierto, Asignado, En Proceso, Pendiente, Resuelto, Cerrado
  - **3 Prioridades**: Baja, Media, Alta

### Usuarios Demo
| Email | Contraseña | Rol | Área |
|-------|-----------|-----|------|
| `usuario.ventas@sitti.com` | `password123` | Usuario | Ventas |
| `tecnico.taller@sitti.com` | `password123` | Técnico | Taller |
| `admin@sitti.com` | `password123` | Administrador | Administración |

### Backend API
- ✅ Servidor Express en puerto 3000
- ✅ CORS configurado para frontend (puerto 5173)
- ✅ Endpoints:
  - `POST /auth/login` - Autenticación con email/password
  - `GET /auth/me` - Obtener datos del usuario autenticado
  - `GET /health` - Health check

### Frontend
- ✅ Variables de entorno: `VITE_API_URL=http://localhost:3000`
- ✅ ApiClient singleton con gestión de tokens
- ✅ AuthService para login/logout/me
- ✅ AuthContext actualizado para integración real
- ✅ Login page con formulario de credenciales + botones de demo

### Autenticación
- ✅ JWT tokens generados por backend
- ✅ Tokens almacenados en localStorage
- ✅ Bearer token en headers Authorization
- ✅ Persistencia de sesión al recargar página

## 🔄 Flujo de Autenticación

1. Usuario ingresa credenciales o hace click en demo
2. Frontend llama `POST /auth/login`
3. Backend valida contraseña con bcrypt
4. Backend genera JWT token y devuelve datos usuario + rol + área
5. Frontend almacena token en localStorage
6. Frontend redirige a `/usuario/dashboard` (o según rol)
7. Al recargar, `AuthContext.checkAuth()` verifica token con `GET /auth/me`
8. Si token válido, mantiene sesión; si no, redirige a login

## 🎯 Rol-Based Access Control

Cada usuario ve solo lo que le corresponde:
- **Usuario (Ventas)**: Ve solo tickets que creó
- **Técnico (Taller)**: Ve tickets asignados del Taller
- **Administrador**: Ve todo el sistema

## 🚀 Iniciar Aplicación

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Puerto: 3000
```

### Terminal 2 - Frontend
```bash
npm run dev
# Puerto: 5173
# URL: http://localhost:5173
```

## 🧪 Pruebas

### Test Login Backend
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario.ventas@sitti.com","password":"password123"}'
```

### Test Autenticado
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/auth/me
```

## 📝 Próximos Pasos

1. **Crear endpoints de Tickets**
   - GET /tickets - Listar con filtros por área/rol
   - POST /tickets - Crear nuevo
   - GET /tickets/:id - Detalle
   - PUT /tickets/:id - Actualizar
   - DELETE /tickets/:id - Eliminar

2. **Crear endpoints de Usuarios** (Admin only)
   - GET /usuarios
   - POST /usuarios
   - PUT /usuarios/:id
   - DELETE /usuarios/:id

3. **Conectar Dashboards**
   - Mostrar datos reales en lugar de mock data
   - Implementar filtros y búsqueda

4. **Agregar más rutas protegidas**
   - Middleware para verificar rol antes de acceder
   - Rutas específicas por rol

## 🔒 Seguridad

- ✅ Contraseñas hashadas con bcrypt
- ✅ JWT con expiración (7 días)
- ✅ CORS restrictivo solo para localhost
- ✅ Bearer token en Authorization header
- ✅ Variables sensibles en .env

## 📊 Estructura de Respuesta Login

```json
{
  "token": "eyJhbGc...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "usuario.ventas@sitti.com",
    "rol": "Usuario",
    "area": "Ventas"
  }
}
```

---

**Estado**: ✅ **Listo para desarrollo**  
**Última actualización**: 2026-09-06
