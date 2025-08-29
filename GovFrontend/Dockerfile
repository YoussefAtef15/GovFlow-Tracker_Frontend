# -------- Build Stage --------
FROM node:20-alpine AS build  # <--- هنا التعديل من node:18 لـ node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -------- Run Stage --------
FROM nginx:alpine
COPY --from=build /app/dist/gov-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]