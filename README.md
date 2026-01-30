# Research Assistant

AI-powered web application that transforms MBA literature review from a 40-hour manual process into a 2-hour guided experience.

## Project Structure

This is a Turborepo monorepo with the following structure:

```
research-assistant/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Shared configuration
│   └── utils/        # Shared utilities
└── uploads/          # PDF file storage
```

## Tech Stack

### Frontend (apps/web)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **API Client**: axios
- **PDF Viewer**: react-pdf
- **Real-time**: Socket.io client

### Backend (apps/api)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Job Queue**: BullMQ (Redis-based)
- **Authentication**: Passport.js + Google OAuth 2.0
- **Real-time**: WebSocket (@nestjs/websockets)
- **API Docs**: Swagger
- **AI Provider**: Anthropic Claude (@anthropic-ai/sdk)

### Infrastructure
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Container**: Docker
- **Deployment**: Coolify (self-hosted)
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker and Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd research-assistant
```

2. Install dependencies:
```bash
pnpm install
```

3. Start infrastructure services (PostgreSQL + Redis):
```bash
docker-compose up -d
```

4. Configure environment variables:
```bash
# Copy example files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Edit the files with your actual values
```

5. Run database migrations:
```bash
pnpm --filter api migration:run
```

6. Start development servers:
```bash
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Development

### Available Scripts

**Root commands** (run from project root):
```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm test         # Run tests (when implemented)
```

**Frontend commands** (run from apps/web or use `pnpm --filter web <command>`):
```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript compiler check
```

**Backend commands** (run from apps/api or use `pnpm --filter api <command>`):
```bash
pnpm dev                  # Start NestJS dev server with watch mode
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint
pnpm typecheck            # Run TypeScript compiler check
pnpm migration:generate   # Generate TypeORM migration (to be implemented)
pnpm migration:run        # Run pending migrations (to be implemented)
```

### Project Structure Details

#### Frontend Structure (apps/web)
```
apps/web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Main application
│   └── auth/              # Authentication pages
├── components/
│   ├── ui/                # shadcn/ui components
│   └── features/          # Domain-specific components
│       ├── documents/     # PDF upload, document list
│       ├── processing/    # Progress tracking
│       ├── citations/     # Citation management
│       └── pdf-viewer/    # PDF viewing
├── lib/                   # Utilities and configurations
│   ├── api-client.ts     # Axios instance
│   └── websocket-client.ts # WebSocket connection
└── stores/                # Zustand state management
    ├── auth-store.ts
    ├── document-store.ts
    ├── processing-store.ts
    └── ui-store.ts
```

#### Backend Structure (apps/api)
```
apps/api/
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── anthropic.config.ts
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   ├── documents/     # Document handling
│   │   ├── processing/    # AI processing
│   │   └── citations/     # Citation management
│   ├── entities/          # TypeORM entities
│   │   ├── user.entity.ts
│   │   ├── document.entity.ts
│   │   ├── processing-job.entity.ts
│   │   └── citation.entity.ts
│   ├── jobs/              # BullMQ job processors
│   ├── gateways/          # WebSocket gateways
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Request/response interceptors
│   ├── migrations/        # Database migrations
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
```

## Architecture

See [architecture.md](_bmad-output/planning-artifacts/architecture.md) for detailed architectural decisions.

### Key Architectural Decisions

1. **Turborepo Monorepo**: Clean separation between frontend and backend with shared type safety
2. **TypeORM with Migrations**: Version-controlled database schema evolution
3. **BullMQ + Redis**: Async job processing for PDF analysis
4. **JWT + httpOnly Cookies**: Secure authentication
5. **WebSocket**: Real-time progress updates
6. **Local Filesystem Storage**: MVP uses local storage, easy migration to S3 later

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - Logout

### Documents
- `GET /api/v1/documents` - List user documents
- `GET /api/v1/documents/:id` - Get document details
- `POST /api/v1/documents` - Upload document
- `DELETE /api/v1/documents/:id` - Delete document
- `GET /api/v1/documents/:id/file` - Serve PDF file

### Processing
- `POST /api/v1/processing-jobs` - Create processing job
- `GET /api/v1/processing-jobs/:id` - Get job status
- `GET /api/v1/processing-jobs/:id/results` - Get results

### Citations
- `GET /api/v1/citations?documentId=:id` - List citations for document

### WebSocket Events
- `processing:progress` - Job progress updates
- `processing:complete` - Job finished
- `processing:error` - Job failed
- `document:uploaded` - Document upload confirmed

## Deployment

### Local Development with Docker

```bash
# Start infrastructure only
docker-compose up -d

# Start applications
pnpm dev
```

### Production Deployment (Coolify)

1. Build Docker images for both apps
2. Deploy to Coolify with managed PostgreSQL and Redis
3. Configure environment variables in Coolify UI
4. Coolify handles SSL, networking, and health checks

See Dockerfiles in `apps/web/Dockerfile` and `apps/api/Dockerfile`.

## Environment Variables

See `.env.example` files in the root and each app directory for required environment variables.

### Critical Variables

**Backend (apps/api/.env)**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for signing JWTs
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend (apps/web/.env.local)**:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL

## License

Private - All Rights Reserved

## Contributing

This is a private project. Contact the maintainer for contribution guidelines.
