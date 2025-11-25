# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Setup Backend and Serve
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --production

# Copy backend code
COPY server/ ./

# Copy built frontend from Stage 1
# Assuming vite builds to /app/dist in the first stage
COPY --from=frontend-build /app/dist ./public

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "index.js"]
