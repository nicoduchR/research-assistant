# Dockerfile for NestJS API in Turborepo
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files
COPY packages/*/package.json ./packages/
COPY apps/api/package.json ./apps/api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/api ./apps/api

# Copy source code
COPY packages ./packages
COPY apps/api ./apps/api
COPY turbo.json ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Build the API using Turborepo filter
RUN pnpm run build --filter=api

# Stage 3: Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json

# Copy node_modules (production dependencies)
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/main.js"]
