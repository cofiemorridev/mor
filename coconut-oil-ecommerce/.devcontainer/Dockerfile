FROM mcr.microsoft.com/devcontainers/javascript-node:1-18-bullseye

# Install MongoDB tools for development
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && \
    apt-get install -y mongodb-mongosh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace/coconut-oil-ecommerce

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install root dependencies
RUN npm install

# Expose ports
EXPOSE 5173 5000

CMD ["sleep", "infinity"]