#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🚀 INICIANDO SITTI (Backend + Frontend)           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Cambiar al directorio del proyecto
cd "$(dirname "$0")"

# Iniciar Backend
echo -e "${YELLOW}📡 Iniciando Backend (puerto 3000)...${NC}"
(cd backend && npm run dev) &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"

# Esperar a que el backend esté listo
sleep 4

# Iniciar Frontend
echo ""
echo -e "${YELLOW}⚛️  Iniciando Frontend (puerto 5173)...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ SERVICIOS INICIADOS CORRECTAMENTE          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 URLs disponibles:${NC}"
echo -e "   Backend:  ${YELLOW}http://localhost:3000${NC}"
echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}🔑 Credenciales de prueba:${NC}"
echo -e "   Usuario:   usuario.ventas@sitti.com / password123"
echo -e "   Técnico:   tecnico.taller@sitti.com / password123"
echo -e "   Admin:     admin@sitti.com / password123"
echo ""
echo -e "${BLUE}⏹️  Para detener: Presiona Ctrl+C${NC}"
echo ""

# Mantener activos los procesos
wait
