# Etapa 1: Build de la aplicación Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servidor de producción
FROM node:20-alpine

WORKDIR /app

# Copiar solo los archivos necesarios desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production --legacy-peer-deps

# Exponer el puerto
EXPOSE 4000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Comando para iniciar el servidor SSR
CMD ["node", "dist/AS241S5_AEJ_29-fe/server/server.mjs"]
