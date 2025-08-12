# --- Étape 1: Build de l'application React ---
# Utilise une image Node.js officielle comme base
FROM node:18-alpine AS build

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json ./


# Installe les dépendances du projet
RUN npm install

# Copie tous les autres fichiers du projet
COPY . .

# Construit l'application pour la production
RUN npm run build

# --- Étape 2: Service de l'application avec Nginx ---
# Utilise une image Nginx légère pour servir les fichiers statiques
FROM nginx:stable-alpine

# Copie les fichiers construits de l'étape précédente vers le répertoire web de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copie une configuration Nginx personnalisée pour bien gérer le routing React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80 pour autoriser le trafic entrant
EXPOSE 80

# Commande pour démarrer le serveur Nginx lorsque le conteneur se lance
CMD ["nginx", "-g", "daemon off;"]

