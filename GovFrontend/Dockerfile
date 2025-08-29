# Stage 1: Build the application
# Use the specific Node.js version required by Angular
FROM node:22.12.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:stable-alpine

# Copy the built files from the build stage to the Nginx server directory
# Make sure the path "dist/gov-frontend" matches your angular.json "outputPath"
COPY --from=build /app/dist/gov-frontend /usr/share/nginx/html

# Copy the Nginx configuration to ensure all routes work correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
