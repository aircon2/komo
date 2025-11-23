# Use Node.js 20 LTS
FROM node:20-slim

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for ts-node)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]

