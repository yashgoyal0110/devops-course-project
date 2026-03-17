# ---------- Stage 1: Build Dependencies ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies separately for better caching
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production

# Copy rest of the source code
COPY . .

# ---------- Stage 2: Production Image ----------
FROM node:24-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Set ownership
RUN chown -R nodeuser:nodegroup /app

USER nodeuser

# Start application
CMD ["node", "src/index.js"]