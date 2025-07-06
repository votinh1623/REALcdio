# backend/Dockerfile
FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm install

# Copy backend source code
COPY backend/ ./backend/

# ✅ Copy the database folder (sibling of backend/)
COPY database/ ./database/

# Copy .env file if needed
COPY .env .env

# Start the backend
CMD ["node", "backend/server.js"]
