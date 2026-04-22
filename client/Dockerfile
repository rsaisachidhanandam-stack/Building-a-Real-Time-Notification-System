# Stage 1: Build Stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for efficient layer caching
COPY package*.json ./

# Install dependencies with npm ci (faster, more reliable for CI/builds)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the app – this generates the "dist" folder with static assets
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine

# Copy built static files from the build stage to Nginx default folder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace the default Nginx configuration with our custom SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for traffic
EXPOSE 80

# The default CMD for nginx starts it automatically, no need to override
