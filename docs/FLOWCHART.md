# 🔄 Flujo de Autenticación y Rol-Based Access Control

## 1️⃣ FLUJO DE LOGIN

```
Usuario ingresa credenciales
         ↓
Frontend: POST /auth/login
         ↓
Backend: valida email + password
         ↓
Genera JWT token (7 días)
         ↓
Retorna: {token, usuario con rol + área}
         ↓
Frontend: localStorage.setItem('auth_token')
         ↓
AuthContext actualiza state
         ↓
Redirige según rol:
- Usuario → /usuario/dashboard
- Técnico → /tecnico/dashboard
- Admin → /admin/dashboard
```

## 2️⃣ USUARIOS DEMO

```
usuario.ventas@sitti.com       → Usuario (Ventas)
tecnico.taller@sitti.com       → Técnico (Taller)
admin@sitti.com                → Administrador (Administración)

Todos con contraseña: password123
```

## 3️⃣ ENDPOINTS

```
POST /auth/login              → Autenticar usuario
GET /auth/me                  → Obtener usuario actual
GET /health                   → Health check
```

## 4️⃣ JWT TOKEN

```
Almacenado en: localStorage['auth_token']
Enviado en: Authorization: Bearer <token>
Expira en: 7 días
Validado por: authMiddleware en backend
```

## 5️⃣ PERSISTENCIA

```
Al recargar página:
  1. AuthContext.checkAuth() ejecuta
  2. Lee token de localStorage
  3. Llama GET /auth/me
  4. Si válido: restaura sesión
  5. Si expirado: redirige a login
```

---

**Estado**: ✅ Autenticación completada
**Última actualización**: 2026-09-06
