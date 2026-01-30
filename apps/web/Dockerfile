# Dockerfile for Next.js Frontend in Turborepo
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Install libc6-compat for Next.js
RUN apk add --no-cache libc6-compat

# Copy workspace config
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files
COPY packages/*/package.json ./packages/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web

# Copy source code
COPY packages ./packages
COPY apps/web ./apps/web
COPY turbo.json ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the web app using Turborepo filter
RUN pnpm run build --filter=web

# Stage 3: Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/apps/web/public ./apps/web/public

# Copy built Next.js files
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Start Next.js server
CMD ["node", "apps/web/server.js"]
