# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy web source
COPY apps/web ./apps/web

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm --filter web build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/web/next.config.ts ./apps/web/
COPY packages ./packages

# Install pnpm and production dependencies
RUN npm install -g pnpm@9.0.0
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

# Expose port
EXPOSE 3000

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Start the application
CMD ["pnpm", "--filter", "web", "start"]
