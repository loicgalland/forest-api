# Étape 1 : Construire l'application
FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Créer l'image finale
FROM node:18-slim AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN npm install --production
EXPOSE 8000
CMD ["node", "dist/app.js"]
