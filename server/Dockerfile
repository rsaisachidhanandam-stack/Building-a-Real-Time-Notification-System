# Base image with pinned node version
FROM node:18-slim

# Set environment
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy package files for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code (using .dockerignore to skip node_modules)
COPY . .

# Create a non-root user for security
RUN useradd -m beathubuser
USER beathubuser

# Expose the application port
EXPOSE 5000

# Start command
CMD ["node", "src/index.js"]
