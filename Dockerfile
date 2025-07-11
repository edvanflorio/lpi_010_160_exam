# Multi-stage build for the exam React app
FROM node:22-alpine AS build
WORKDIR /app
# Install dependencies
COPY docs/package*.json ./docs/
WORKDIR /app/docs
RUN npm install
# Copy rest of the app and build
COPY docs .
RUN npm run build -- --base=/

# Serve the built app with nginx
FROM nginx:alpine
COPY --from=build /app/docs/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
