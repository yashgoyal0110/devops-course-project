# ---------- Stage 1: Build Dependencies ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY . .

# ---------- Stage 2: Production Image ----------
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget \
 && addgroup -S nodegroup \
 && adduser -S nodeuser -G nodegroup

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

RUN chown -R nodeuser:nodegroup /app

USER nodeuser

ENV PORT=5001
EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O- http://localhost:${PORT}/api/health || exit 1

CMD ["node", "src/index.js"]
