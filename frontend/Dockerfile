# Usamos imagen de Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Astro
EXPOSE 4321

# Comando para desarrollo (host=0.0.0.0 es necesario para Docker)
CMD ["npm", "run", "dev", "--", "--host"]