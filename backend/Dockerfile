# Backend Dockerfile para SITTI
# Stack: Node.js + Express + TypeScript

# ============================================
# Development stage
# ============================================
FROM node:24-alpine AS development

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app/backend

# Instalar dependencias
COPY ./backend/package*.json ./
RUN npm install

# Copiar schema de Prisma
COPY ./backend/prisma ./prisma

# Copiar código fuente
COPY ./backend/src ./src
COPY ./backend/tsconfig.json ./

# Exposar puerto
EXPOSE 3000

# Dev server con hot-reload
CMD ["npm", "run", "dev"]

# ============================================
# Build stage
# ============================================
FROM node:24-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app/backend

COPY ./backend/package*.json ./
RUN npm ci --omit=dev

COPY ./backend/src ./src
COPY ./backend/tsconfig.json ./
COPY ./backend/prisma ./prisma

RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:24-alpine AS production

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app/backend

COPY ./backend/package*.json ./
RUN npm ci --omit=dev

COPY ./backend/prisma ./prisma
COPY --from=builder /app/backend/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
