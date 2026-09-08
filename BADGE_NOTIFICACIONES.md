# 🔴 BADGE DE NOTIFICACIONES - IMPLEMENTACIÓN

**Fecha**: 2026-09-08  
**Feature**: Indicador visual de notificaciones no leídas  
**Estado**: ✅ Completado

---

## 📋 ¿QUÉ SE HIZO?

Se agregó un **badge rojo** junto al link "Notificaciones" en la barra lateral que muestra:
- Número de notificaciones NO LEÍDAS
- Se actualiza automáticamente cada 5 segundos
- Desaparece cuando todas están leídas
- Funciona para Usuario y Técnico

---

## 🎯 FLUJO IMPLEMENTADO

```
Usuario inicia sesión
        ↓
AppShell carga
        ↓
useNotificationBadge() se ejecuta
        ↓
GET /api/notificaciones
        ↓
Cuenta unreadCount (leido: false)
        ↓
Si unreadCount > 0:
  Muestra badge rojo con número
        ↓
Cada 5 segundos: Recarga el contador
        ↓
Usuario marca como leído → contador baja
Usuario elimina → contador actualiza
```

---

## 📁 ARCHIVOS CREADOS/MODIFICADOS

### ✨ NUEVO: `app/hooks/useNotificationBadge.ts`

```typescript
export function useNotificationBadge() {
  // Carga las notificaciones cada 5 segundos
  // Retorna: { unreadCount, loading, reload }
}
```

**Características**:
- Se ejecuta automáticamente al montar
- Refresca cada 5 segundos (igual que la página de notificaciones)
- Maneja errores silenciosamente
- Retorna el contador de no leídas

### 📝 MODIFICADO: `app/components/layout/AppShell.tsx`

**Cambios**:
- Importa `useNotificationBadge` hook
- Llama el hook: `const { unreadCount } = useNotificationBadge();`
- Renderiza badge rojo al lado de "Notificaciones"
- Badge solo aparece si `unreadCount > 0`

**Renderizado**:
```jsx
{item.label === "Notificaciones" && unreadCount > 0 && (
  <span className="inline-flex items-center justify-center w-6 h-6 ml-2 
                   text-xs font-bold text-white bg-red-600 rounded-full">
    {unreadCount > 99 ? "99+" : unreadCount}
  </span>
)}
```

---

## 👁️ RESULTADO VISUAL

### SIN notificaciones no leídas:
```
📋 Notificaciones
```

### CON 2 notificaciones no leídas:
```
📋 Notificaciones  🔴 2
```

### CON 5+ notificaciones no leídas:
```
📋 Notificaciones  🔴 5
```

### CON 100+ notificaciones no leídas:
```
📋 Notificaciones  🔴 99+
```

---

## 🔄 CÓMO FUNCIONA

### 1. **Al abrir la app (login)**
```
useNotificationBadge() → GET /api/notificaciones
                      → unreadCount = 2
                      → Muestra badge rojo "2"
```

### 2. **Cada 5 segundos**
```
setInterval(..., 5000) → GET /api/notificaciones
                       → actualiza unreadCount
                       → actualiza badge automáticamente
```

### 3. **Usuario marca notificación como leída**
```
Usuario abre notificaciones
Usuario click en notificación
Frontend PUT /api/notificaciones/:id/read
BD actualiza: leido = true
Siguiente polling (5s):
  unreadCount baja en 1
  Badge se actualiza: "2" → "1"
```

### 4. **Usuario elimina notificación**
```
Usuario click en ×
Frontend DELETE /api/notificaciones/:id
BD elimina registro
Siguiente polling (5s):
  unreadCount baja en 1
  Badge se actualiza automáticamente
```

### 5. **Técnico resuelve ticket**
```
Técnico resuelve ticket
Backend crea notificación automáticamente
Usuario A (solicitante) + Usuario B (técnico):
  Siguiente polling (5s):
    Ambos ven el badge actualizado
    Si tienen notif no leída → badge aparece/se incrementa
```

---

## 🧪 CÓMO PROBAR

### Test 1: Ver badge al iniciar sesión
1. Login como usuario
2. Mira la barra lateral
3. ✅ Si hay notificaciones no leídas → badge rojo
4. Si todas están leídas → sin badge

### Test 2: Badge desaparece cuando marcan como leídas
1. Abre notificaciones
2. Mira badge: "🔴 2"
3. Click en una notificación
4. Espera 5 segundos
5. ✅ Badge cambia: "🔴 2" → "🔴 1"

### Test 3: Badge se actualiza al eliminar
1. En página de notificaciones
2. Click en × para eliminar una
3. Mira badge
4. Espera 5 segundos
5. ✅ Badge se actualiza automáticamente

### Test 4: Auto-refresh cada 5 segundos
1. Abre notificaciones
2. Verifica badge
3. Espera 5 segundos
4. ✅ Badge se refresca (mismo valor pero se ejecutó GET)
5. Abre DB y agrega notificación
6. Espera 5 segundos
7. ✅ Badge incrementa automáticamente

### Test 5: Funciona para Usuario y Técnico
1. Login como Usuario → badge aparece
2. Logout
3. Login como Técnico → badge aparece
4. ✅ Ambos roles ven el indicador

---

## ⚙️ CONFIGURACIÓN

### Cambiar frecuencia de actualización (polling)

**Archivo**: `app/hooks/useNotificationBadge.ts` línea 19

```typescript
// Cambiar de 5000ms (5 segundos) a otro valor:
const interval = setInterval(loadUnreadCount, 5000); // ← Aquí

// Ejemplos:
// 3000  = 3 segundos (más frecuente)
// 10000 = 10 segundos (menos frecuente)
// 1000  = 1 segundo (muy frecuente)
```

### Cambiar estilo del badge

**Archivo**: `app/components/layout/AppShell.tsx` línea ~99

```jsx
<span className="inline-flex items-center justify-center 
                 w-6 h-6 ml-2 text-xs font-bold 
                 text-white bg-red-600 rounded-full">
  {/* Cambiar bg-red-600 por otro color */}
  {/* bg-red-600, bg-orange-600, bg-yellow-600, etc. */}
</span>
```

### Cambiar rango del badge (99+ limit)

```jsx
{unreadCount > 99 ? "99+" : unreadCount}
// Cambiar 99 por otro número:
{unreadCount > 50 ? "50+" : unreadCount}  // Máximo 50
{unreadCount > 9 ? "9+" : unreadCount}    // Máximo 9
```

---

## 🔐 SEGURIDAD

✅ **Filtrado por usuario**
- GET `/api/notificaciones` solo retorna notificaciones del usuario autenticado
- Token JWT requerido
- No puede ver notificaciones de otros usuarios

✅ **Auto-actualización segura**
- Cada GET refresca el auth
- Si token expira → sin badge (error silencioso)
- Si logout → componente no se renderiza

---

## 🚀 PRÓXIMAS MEJORAS

### Fase 3 - Opcionales:

- [ ] **WebSocket** - En tiempo real (sin esperar 5 segundos)
- [ ] **Animación** - Badge parpadea o anima cuando llega notificación
- [ ] **Sonido** - Notificación de sonido cuando llega
- [ ] **Tooltip** - Hover muestra "2 sin leer"
- [ ] **Dropdown** - Click en badge abre últimas 5 notificaciones
- [ ] **Desktop Push** - Notificaciones del navegador

---

## 📊 EJEMPLO DE FLUJO COMPLETO

```
ESCENARIO: Usuario A está logeado, Técnico resuelve su ticket

1. Usuario A hace login
   ↓ useNotificationBadge
   ↓ GET /api/notificaciones
   → unreadCount = 1 (del ticket anterior)
   → Muestra badge: 🔴 1

2. Técnico resuelve ticket de Usuario A
   → Backend crea Notificacion(...)
   → Inserta en BD

3. Usuario A espera 5 segundos (siguiente polling)
   ↓ setInterval ejecuta
   ↓ GET /api/notificaciones
   ↓ unreadCount = 2 (incluye la nueva)
   → Badge se actualiza: 🔴 2

4. Usuario A abre notificaciones (página)
   → Ve 2 notificaciones
   → Hace click en una
   → PUT /api/notificaciones/:id/read
   → Se marca como leída

5. Usuario A espera 5 segundos
   ↓ Badge polling ejecuta
   ↓ GET /api/notificaciones
   ↓ unreadCount = 1 (una ya está leída)
   → Badge se actualiza: 🔴 1

6. Usuario A marca la otra como leída
   → Espera 5 segundos
   → Badge desaparece (unreadCount = 0)
```

---

## 📞 RESUMEN

| Aspecto | ✅ |
|--------|-----|
| **Badge visible** | ✅ Sí |
| **Solo no leídas** | ✅ Sí |
| **Actualización automática** | ✅ Cada 5s |
| **Funciona para Usuario** | ✅ Sí |
| **Funciona para Técnico** | ✅ Sí |
| **Desaparece cuando = 0** | ✅ Sí |
| **Seguridad JWT** | ✅ Sí |
| **Estilos responsive** | ✅ Sí |
| **Dark mode** | ✅ Sí |

---

**Estado**: ✅ FEATURE COMPLETADO Y FUNCIONAL

Ahora ambos usuarios (Usuario y Técnico) verán inmediatamente si tienen notificaciones pendientes sin visualizar cuando abren la app. 🎉
