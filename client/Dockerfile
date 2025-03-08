# Use Node.js image for building the app
FROM node:20-alpine AS build

WORKDIR /app

# Only copy package-lock.json if it exists
COPY package.json ./
# COPY package-lock.json ./ || true

RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve the build files
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
