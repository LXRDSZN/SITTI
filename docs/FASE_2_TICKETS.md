# 📝 Fase 2 - Endpoints de Tickets Funcionales

## ✅ Completado

### Backend
- ✅ Servicio de tickets (`tickets.service.ts`)
- ✅ Controlador de tickets (`tickets.controller.ts`)
- ✅ Rutas de tickets (`tickets.routes.ts`)
- ✅ Integración en `app.ts`
- ✅ 7 tickets de seed en base de datos

### Frontend
- ✅ Servicio de tickets (`app/services/tickets.service.ts`)
- ✅ Tipos TypeScript para tickets

### Base de Datos
- ✅ 7 tickets funcionales cargados
- ✅ Tickets con diferentes estados (Abierto, Asignado, En Proceso, Resuelto)
- ✅ Tickets con diferentes prioridades (Alta, Media, Baja)
- ✅ Tickets con diferentes categorías (Hardware, Software, Red)

---

## 📡 API Endpoints

### GET /tickets
Obtiene todos los tickets (sin autenticación requerida)

```bash
curl http://localhost:3000/tickets
```

**Respuesta:**
```json
{
  "tickets": [
    {
      "id_ticket": 1,
      "folio": "TKT-001",
      "titulo": "Monitor no enciende",
      "descripcion": "...",
      "estado": { "nombre": "ABIERTO", ... },
      "prioridad": { "nombre": "ALTA", ... },
      ...
    }
  ]
}
```

### GET /tickets/my-tickets
Obtiene los tickets del usuario autenticado (requiere JWT)

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/tickets/my-tickets
```

**Respuesta:** Array de tickets del usuario

### GET /tickets/:id
Obtiene un ticket específico por ID

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/tickets/1
```

### POST /tickets
Crea un nuevo ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi nuevo ticket",
    "descripcion": "Descripción del problema",
    "id_area": 1,
    "id_categoria": 1,
    "id_prioridad": 2
  }'
```

### PUT /tickets/:id
Actualiza un ticket

```bash
curl -X PUT http://localhost:3000/tickets/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Título actualizado",
    "id_estado": 3
  }'
```

### DELETE /tickets/:id
Elimina un ticket

```bash
curl -X DELETE http://localhost:3000/tickets/1 \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📊 Tickets Pre-cargados

| Folio | Título | Estado | Prioridad | Área |
|-------|--------|--------|-----------|------|
| TKT-001 | Monitor no enciende | Abierto | Alta | Ventas |
| TKT-002 | Internet lento | Asignado | Media | Ventas |
| TKT-003 | Error en CRM | En Proceso | Alta | Ventas |
| TKT-004 | Teclado no responde | Resuelto | Baja | Ventas |
| TKT-005 | Impresora sin tinta | Abierto | Media | Refacciones |
| TKT-006 | Licencia expirada | En Proceso | Alta | Taller |
| TKT-007 | Configurar VPN | Asignado | Alta | Administración |

---

## 🧪 Pruebas Manuales

### Test 1: Obtener todos los tickets
```bash
curl -s http://localhost:3000/tickets | jq '.tickets | length'
# Resultado: 7
```

### Test 2: Login y obtener tickets del usuario
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario.ventas@sitti.com","password":"password123"}' | jq -r '.token')

curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/tickets/my-tickets | jq '.tickets | length'
# Resultado: 7 (todos creados por usuario.ventas@sitti.com)
```

### Test 3: Obtener ticket específico
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/tickets/1 | jq '.ticket.titulo'
# Resultado: "Monitor no enciende"
```

---

## 🔐 Seguridad y Control de Acceso

- ✅ `GET /tickets` - Público (todos pueden ver)
- ✅ `GET /tickets/my-tickets` - Requiere JWT (ve solo sus tickets)
- ✅ `GET /tickets/:id` - Requiere JWT
- ✅ `POST /tickets` - Requiere JWT (solicitante = usuario autenticado)
- ✅ `PUT /tickets/:id` - Requiere JWT
- ✅ `DELETE /tickets/:id` - Requiere JWT (solo admin)

---

## 🎯 Próximo Paso

Conectar los dashboards con estos endpoints reales.

---

**Fecha**: 2026-09-06  
**Estado**: ✅ COMPLETADO
