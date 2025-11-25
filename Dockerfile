# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup Backend and Serve
FROM node:22-alpine
WORKDIR /app

# Backend deps
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy backend code
COPY server/ ./

# Copy frontend build
COPY --from=frontend-build /app/dist ./public

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "index.js"]
