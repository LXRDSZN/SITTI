# 🚀 INICIO RÁPIDO - SISTEMA DE NOTIFICACIONES

## ⚡ En 30 segundos

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
npm run dev

# Ir a:
http://localhost:5173/usuario/notificaciones
```

---

## ✅ Verificación

**Backend compiló correctamente:**
```bash
cd backend && npm run build
# Output: Sin errores
```

**Datos de prueba creados:**
```bash
cd backend && npx tsx seed_notifications.ts
# Output: ✅ 3 notificaciones creadas
```

**Notificaciones visibles:**
- URL: `http://localhost:5173/usuario/notificaciones`
- Deberías ver: 3 notificaciones (de prueba)
- Colores: Verde (resuelto), Azul (asignado), Amarillo (actualizado)

---

## 🧪 Pruebas Rápidas

### Test 1: Eliminar notificación
1. Abre notificaciones
2. Haz clic en × de una notificación
3. ✅ Desaparece inmediatamente
4. Recarga página (F5)
5. ✅ NO reaparece (fue eliminada de BD)

### Test 2: Marcar como leída
1. Haz clic en notificación no leída (con punto azul)
2. ✅ El punto azul desaparece
3. ✅ Se guardó en BD

### Test 3: Auto-refresh
1. Dejar página abierta por 5+ segundos
2. ✅ Las notificaciones se actualizan automáticamente

### Test 4: Limpiar todo
1. Botón "Limpiar todo"
2. Confirmar diálogo
3. ✅ Todas se eliminan
4. ✅ Lista vacía

---

## 📂 Archivos Principales

**Backend**:
- `backend/src/controllers/notifications.controller.ts` - Lógica
- `backend/src/routes/notifications.routes.ts` - Endpoints
- `backend/src/services/tickets.service.ts` - Auto-generación

**Frontend**:
- `app/services/notifications.service.ts` - Cliente API
- `app/routes/usuario/notificaciones.tsx` - Componente UI

**Documentación**:
- `SISTEMA_NOTIFICACIONES.md` - Guía completa
- `CHANGELOG_NOTIFICACIONES.md` - Cambios detallados

---

## 🔗 Endpoints API

```bash
# Obtener notificaciones
GET /api/notificaciones
Authorization: Bearer {token}

# Marcar como leída
PUT /api/notificaciones/1/read
Authorization: Bearer {token}

# Marcar todas como leídas
PUT /api/notificaciones/read-all
Authorization: Bearer {token}

# Eliminar una
DELETE /api/notificaciones/1
Authorization: Bearer {token}

# Eliminar todas
DELETE /api/notificaciones
Authorization: Bearer {token}
```

---

## 🎯 Flujo de Usuario

```
Usuario inicia sesión
  ↓
Técnico resuelve ticket
  ↓
Backend crea notificación automáticamente
  ↓
Usuario abre /usuario/notificaciones
  ↓
Frontend carga: GET /api/notificaciones
  ↓
Notificación aparece en BD (✅ Ticket resuelto)
  ↓
Usuario puede:
  • Eliminar (× desaparece de BD)
  • Marcar como leída (punto azul desaparece)
  • Hacer clic para ir a ticket
```

---

## ⚙️ Configuración

**Auto-refresh**: Cada 5 segundos
- Editar en: `app/routes/usuario/notificaciones.tsx` línea ~24
- Cambiar: `setInterval(loadNotifications, 5000)`

**Tipos de notificaciones**:
- `ticket_resuelto` - Ticket solucionado (verde)
- `ticket_asignado` - Ticket asignado (azul)
- `ticket_actualizado` - Estado cambió (amarillo)
- `comentario` - Agregado comentario (gris)

---

## 🛠️ Troubleshooting

**"No veo notificaciones"**:
```bash
# Verificar datos en BD
cd backend && npm run db:studio
# Buscar tabla "notificaciones"
```

**"Error en compilación"**:
```bash
cd backend && npm run build
# Debería salir sin errores
```

**"API 401 Unauthorized"**:
- Verifica que estés logeado (token en localStorage)
- Headers: `Authorization: Bearer {token}`

**"No se actualizan cada 5s"**:
- Abre console (F12)
- Verifica requests a GET /api/notificaciones
- Si faltan = problema con token

---

## 📊 Datos de Base de Datos

**Tabla**: `notificaciones`
```sql
-- Ver todas
SELECT * FROM notificaciones;

-- Ver para usuario específico
SELECT * FROM notificaciones WHERE id_usuario = 1;

-- Ver no leídas
SELECT * FROM notificaciones WHERE leido = false;

-- Contar por tipo
SELECT tipo, COUNT(*) FROM notificaciones GROUP BY tipo;
```

---

## 🎓 Aprende más

Documentación completa:
- Guía técnica: `SISTEMA_NOTIFICACIONES.md`
- Changelog: `CHANGELOG_NOTIFICACIONES.md`
- Script test: `test_notifications.sh`

---

## ✨ Resumen Rápido

| Aspecto | ✅ |
|--------|-----|
| **Persistencia** | Guardadas en BD (no hardcodeadas) |
| **Auto-generación** | Se crean automáticamente |
| **Eliminación** | No reaparecen al F5 |
| **Leído/No leído** | Se guardan estados |
| **Auto-refresh** | Cada 5 segundos |
| **UI** | Colores, iconos, timestamps |
| **Auth** | Filtrado por usuario |
| **Errores** | Validación completa |

---

**¡Listo! 🚀 El sistema está 100% funcional**
