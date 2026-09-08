#!/bin/bash

# Test del Sistema de Notificaciones
# Uso: ./test_notifications.sh <token>

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "❌ Error: Token requerido"
  echo "Uso: ./test_notifications.sh <token>"
  exit 1
fi

API="http://localhost:3000/api/notificaciones"
HEADER="Authorization: Bearer $TOKEN"

echo "🧪 PRUEBAS DEL SISTEMA DE NOTIFICACIONES"
echo "========================================="
echo ""

# Test 1: GET notificaciones
echo "1️⃣ GET /api/notificaciones (obtener todas)"
curl -s -X GET "$API" \
  -H "$HEADER" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Test 2: Marcar como leída
echo "2️⃣ PUT /api/notificaciones/1/read (marcar como leída)"
curl -s -X PUT "$API/1/read" \
  -H "$HEADER" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
echo ""

# Test 3: Obtener nuevamente para verificar
echo "3️⃣ GET /api/notificaciones (verificar cambio)"
curl -s -X GET "$API" \
  -H "$HEADER" \
  -H "Content-Type: application/json" | jq '.data[] | {id: .id_notificacion, leido, titulo}'
echo ""

# Test 4: Eliminar notificación
echo "4️⃣ DELETE /api/notificaciones/2 (eliminar una)"
curl -s -X DELETE "$API/2" \
  -H "$HEADER" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Test 5: Obtener nuevamente para verificar eliminación
echo "5️⃣ GET /api/notificaciones (verificar eliminación)"
curl -s -X GET "$API" \
  -H "$HEADER" \
  -H "Content-Type: application/json" | jq '.data | length'
echo "notificaciones restantes"
echo ""

echo "✅ Pruebas completadas"
