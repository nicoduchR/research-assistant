---
stepsCompleted: [1, 2, 3, 4, 5, 6]
workflowComplete: true
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-research-assistant-2026-01-15.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - 'docs/methodology.md'
workflowType: 'architecture'
project_name: 'research-assistant'
user_name: 'Nicolas'
date: '2026-01-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The project centers on a **PDF-to-literature-review pipeline** with citation traceability as the foundational requirement. 32 functional requirements break down into:

- **Document Management (FR1-FR5)**: Multi-file drag-and-drop upload, list management, text extraction from PDFs
- **AI Literature Review (FR6-FR10)**: Processing pipeline that synthesizes multiple PDFs into structured literature review, identifies themes, groups arguments, supports user editing
- **Citation Traceability (FR11-FR15)**: Every generated claim links to source PDF + exact page number, with manual correction capability and uncertainty flagging
- **PDF Viewer & Verification (FR16-FR20)**: Side-panel PDF viewer with page navigation, one-click citation verification opens PDF at exact page
- **Progress & Status (FR21-FR24)**: Real-time processing updates, methodology stage tracking, predefined next-step guidance
- **Error Handling (FR25-FR28)**: Graceful degradation for failed PDFs (scanned documents), clear error messaging, partial results remain usable
- **User Authentication (FR29-FR32)**: Google OAuth, user-scoped document access across devices

**Critical Architectural Insight**: Citation traceability isn't a feature—it's the architectural backbone. Every layer (storage, processing, API, UI) must preserve source+page linking.

**Non-Functional Requirements:**

- **Performance**: < 3s initial load (LCP), < 200ms UI responsiveness, AI processing time not strictly limited (minutes acceptable with progress feedback)
- **Security**: HTTPS only, Google OAuth 2.0, server-side PDF storage with user-scoped access, secure session management
- **Reliability**: Async job persistence (users can leave during processing and return to results), data survives server restarts, graceful degradation when partial failures occur

**UX-Driven Technical Requirements:**

From the UX specification, these patterns have architectural implications:
- **Zero-friction input**: Large drop-zone, entire screen becomes drag target (affects layout architecture)
- **Real-time progress**: 4-minute AI processing requires WebSocket/SSE for live updates (not polling)
- **Click-to-verify trust mechanism**: One-click opens PDF at exact page (requires precise page-coordinate storage + viewer API integration)
- **Calm confidence design**: No aggressive timers, transparent progress, predictable outcomes (affects error handling strategy)
- **Desktop-first**: 1024px+ primary viewport, tablet basic support, mobile minimal (simplifies responsive architecture)

**Scale & Complexity:**

- **Primary domain**: Full-stack web application (Next.js hybrid SPA with App Router)
- **Complexity level**: Low-Medium
  - Well-defined MVP scope with clear boundaries
  - Target scale: 100 users (single-server deployment acceptable)
  - No multi-tenancy complexity (user-scoped data isolation sufficient)
  - No regulatory compliance beyond standard data protection
- **Estimated architectural components**:
  - Frontend: Upload UI, PDF viewer, literature review display, progress tracking
  - Backend: PDF processing pipeline, AI orchestration, citation extraction, job queue
  - Storage: User data, PDFs, processed results, citation metadata
  - Auth: Google OAuth integration
  - Real-time: Progress notification system

### Technical Constraints & Dependencies

**Known Constraints:**

- **Framework**: Next.js (App Router) - existing infrastructure and team familiarity
- **Authentication**: Google OAuth 2.0 - design decision for MVP
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions) - no legacy IE
- **PDF Rendering**: Client-side browser rendering (pdf.js or react-pdf) - no server-side PDF generation
- **Deployment**: Existing infrastructure (specifics TBD in architecture decisions)

**Critical Dependencies:**

- **AI/LLM Service**: External API for literature review synthesis (citation extraction, theme identification)
- **PDF Text Extraction**: Library capable of extracting text + page coordinates from PDFs
- **Real-time Communication**: WebSocket or SSE capability for progress updates
- **File Storage**: Persistent storage for user-uploaded PDFs and generated results

**Risk Areas:**

- **Page Number Accuracy**: OCR/text extraction must preserve page boundaries precisely
- **Scanned PDF Handling**: Image-based PDFs will fail text extraction—architecture must detect and handle gracefully
- **AI Processing Reliability**: Long-running AI jobs need robust error handling and retry logic
- **Citation Verification UX**: PDF viewer must open to exact page on first click (no scrolling)

### Cross-Cutting Concerns Identified

**1. Citation Traceability System**
   - Affects: Storage schema, API contracts, AI processing output format, UI rendering
   - Requirement: Every generated statement preserves source PDF ID + page number throughout all layers

**2. Error Handling & Graceful Degradation**
   - Affects: PDF processing pipeline, API error responses, UI error states, job queue retry logic
   - Requirement: Partial failures (e.g., 1 of 15 PDFs fails) don't block entire workflow

**3. Real-time Progress Updates**
   - Affects: Backend job processing, WebSocket/SSE infrastructure, UI progress components
   - Requirement: Users see live progress during 4-minute AI processing without polling

**4. User Data Isolation**
   - Affects: Database schema, API authorization, file storage organization, session management
   - Requirement: Users only access their own PDFs and generated content

**5. PDF Viewer Integration**
   - Affects: Frontend component architecture, file serving strategy, page navigation API
   - Requirement: Click citation → PDF opens in side panel at exact page (sub-second response)

**6. Async Job Processing**
   - Affects: Backend architecture, database schema, API design, deployment infrastructure
   - Requirement: Processing continues if user closes browser; results retrievable when they return

## Starter Template Evaluation

### Architecture Decision: Turborepo Monorepo

**Monorepo Structure:**
- **Frontend**: Next.js (App Router) with Tailwind CSS + shadcn/ui
- **Backend**: NestJS API server
- **Shared**: TypeScript types, utilities, configuration packages

This separation provides:
- **Clear boundaries**: Frontend/backend concerns cleanly separated
- **Code sharing**: Shared types between frontend and backend (no duplication)
- **Independent deployment**: Both apps deployed together on Coolify
- **Scalability**: Easy to add new apps (admin panel, mobile API, etc.)

### Technical Preferences Established

**Monorepo Setup:**
- **Build System**: Turborepo (for caching and parallel task execution)
- **Package Manager**: pnpm (recommended for monorepos, faster than npm/yarn)

**Frontend App (apps/web):**
- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand (lightweight, simple API)

**Backend App (apps/api):**
- **Framework**: NestJS (TypeScript-first Node.js framework)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Job Queue**: BullMQ (for async PDF processing)
- **Real-time**: WebSocket (via @nestjs/websockets)

**Shared Packages (packages/):**
- **types**: Shared TypeScript types and interfaces
- **config**: Shared configuration (ESLint, TypeScript, Tailwind)
- **utils**: Shared utility functions

**AI Integration:**
- **Provider**: Anthropic Claude
- **SDK**: @anthropic-ai/sdk (for agentic AI workflows)
- **Location**: Backend API (apps/api)

**Development:**
- **Language**: TypeScript (strict mode across all packages)
- **Testing**: Deferred for MVP (focus on shipping)
- **Code Quality**: ESLint + Prettier (shared config)

**Infrastructure:**
- **Hosting**: Self-hosted with Coolify (all services)
- **Deployment**: Docker containers via Coolify
- **Services on Coolify**:
  - Next.js frontend (apps/web)
  - NestJS backend (apps/api)
  - PostgreSQL database
  - Redis (for BullMQ job queue)

### Primary Technology Domain

**Turborepo monorepo** with:
- Full-stack web application (Next.js frontend)
- RESTful + WebSocket API (NestJS backend)
- Shared type safety across frontend/backend boundary

### Starter Options Considered

**Option 1: Official create-turbo + Manual Setup (Selected)**
- **Pros**: Clean slate, latest Turborepo setup, full control over backend framework choice
- **Cons**: Requires manual NestJS setup and configuration
- **Best for**: Projects with specific backend requirements (NestJS + TypeORM + BullMQ)

**Option 2: ejazahm3d/fullstack-turborepo-starter**
- **Pros**: Pre-configured with Next.js + NestJS, Docker, GitHub Actions
- **Cons**: Uses Prisma (not TypeORM), includes extra tooling to remove
- **Best for**: Standard full-stack apps with Prisma ORM

**Option 3: Build from Scratch**
- **Pros**: Complete control over every aspect
- **Cons**: Significant setup time for Turborepo configuration
- **Best for**: Advanced teams with deep Turborepo expertise

### Selected Starter: create-turbo (Official) + NestJS CLI

**Rationale for Selection:**

Starting with the official Turborepo template and adding NestJS provides:

1. **Latest Turborepo Setup**: Official template with current best practices
2. **Clean Backend Integration**: Add NestJS via official CLI (no baggage)
3. **Flexibility**: Easy to configure TypeORM, BullMQ, WebSocket exactly as needed
4. **No Conflicts**: Avoids removing Prisma or other unwanted dependencies
5. **Official Documentation**: Both Turborepo and NestJS have excellent docs

The ejazahm3d starter is great, but swapping Prisma for TypeORM would require significant rework. Starting clean is faster.

**Initialization Commands:**

```bash
# Step 1: Create Turborepo monorepo with Next.js app
npx create-turbo@latest research-assistant \
  --package-manager pnpm

cd research-assistant

# Step 2: Add NestJS backend
cd apps
npx @nestjs/cli new api --package-manager pnpm --skip-git
cd ..

# Step 3: Initialize shadcn/ui in the Next.js app
cd apps/web
npx shadcn@latest init -y
cd ../..

# Step 4: Create shared packages structure
mkdir -p packages/types packages/config packages/utils

# Step 5: Install workspace dependencies at root
pnpm install
```

**Project Structure:**

```
research-assistant/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   │   └── ui/        # shadcn/ui components
│   │   │   └── lib/           # Frontend utilities
│   │   ├── public/
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   │   ├── auth/
│       │   │   ├── documents/
│       │   │   ├── processing/
│       │   │   └── citations/
│       │   ├── entities/      # TypeORM entities
│       │   ├── jobs/          # BullMQ job processors
│       │   ├── gateways/      # WebSocket gateways
│       │   ├── main.ts        # Application entry
│       │   └── app.module.ts
│       ├── test/
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── api.ts         # API request/response types
│   │   │   ├── entities.ts    # Database entity types
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config/                 # Shared configuration
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   │
│   └── utils/                  # Shared utilities
│       ├── src/
│       └── package.json
│
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml         # pnpm workspace config
├── package.json                # Root package.json
└── tsconfig.json               # Root TypeScript config
```

**Architectural Decisions Provided by Starter:**

**Turborepo Pipeline Configuration:**
- **Build caching**: Task outputs cached, reused when inputs unchanged
- **Parallel execution**: Independent tasks run concurrently
- **Task dependencies**: Build tasks run in correct order (types → api → web)
- **Remote caching**: Optional - can enable for team collaboration

**Frontend (Next.js):**
- TypeScript 5.x with strict mode
- React 19 with Server Components
- Tailwind CSS 4.x with JIT compilation
- shadcn/ui components with CSS variables
- App Router architecture (server-first by default)
- Turbopack for dev server

**Backend (NestJS):**
- TypeScript-first Node.js framework
- Modular architecture (feature-based modules)
- Dependency injection (built-in IoC container)
- Decorator-based routing and validation
- Built-in WebSocket support (@nestjs/websockets)
- Express or Fastify adapter (Express default)

**Shared Type Safety:**
- Frontend imports types from `@repo/types`
- Backend exports entity types to `@repo/types`
- API contracts defined once, used everywhere
- No type duplication or drift between layers

**Code Organization Patterns:**
- **Frontend**: Server Components by default, opt-in client components
- **Backend**: Feature modules (auth, documents, processing, citations)
- **Shared**: Workspace packages with clean exports
- **Types**: Centralized in shared package, versioned

**Development Experience:**
- **Parallel dev servers**: `pnpm dev` runs both frontend and backend
- **Hot reloading**: Both apps reload on changes
- **Shared config**: ESLint, Prettier, TypeScript configs shared
- **Type checking**: `turbo typecheck` validates all packages
- **Linting**: `turbo lint` lints all packages

**What's NOT Included (We'll Add):**

These architectural decisions will be made in subsequent steps:
- **TypeORM Configuration**: Database connection, entities, migrations
- **BullMQ Setup**: Redis connection, queue configuration, job processors
- **WebSocket Gateway**: Real-time progress updates during PDF processing
- **Anthropic SDK Integration**: @anthropic-ai/sdk for Claude API, agentic workflows
- **Authentication**: Google OAuth 2.0 (likely using Passport.js in NestJS)
- **File Storage**: Multipart upload handling, PDF storage strategy
- **PDF Processing**: Text extraction library, page coordinate parsing
- **Docker Configuration**: Multi-stage builds, docker-compose.yml for local dev, Coolify deployment

**Monorepo Benefits for This Project:**

1. **Shared Types**: Citation, Document, User types shared between frontend/backend
2. **Type-Safe APIs**: Frontend knows exact shape of API responses (no guessing)
3. **Atomic Changes**: Update API + frontend in single commit/PR
4. **Code Reuse**: Shared validation logic, constants, utilities
5. **Unified Deployment**: Both frontend and backend deployed together on Coolify
6. **Clear Boundaries**: Frontend never directly accesses database, all via API

**Deployment Strategy (Coolify):**

All services will be deployed on Coolify:
- **apps/web**: Next.js frontend (Docker container)
- **apps/api**: NestJS backend (Docker container)
- **PostgreSQL**: Managed PostgreSQL service on Coolify
- **Redis**: Managed Redis service on Coolify (for BullMQ)

Coolify will handle:
- Docker container orchestration
- Service networking (frontend ↔ backend ↔ database ↔ Redis)
- Environment variable management
- SSL/TLS certificates
- Health checks and restarts

**Note:** Project initialization using these commands should be the first implementation task. The monorepo structure provides the foundation; architectural decisions will layer on the specialized functionality (TypeORM, BullMQ, WebSocket, AI).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- TypeORM Migrations for schema evolution
- JWT with httpOnly cookies for authentication
- Redis caching for job status and processed results
- Local filesystem storage for PDFs
- @nestjs/passport with Google OAuth integration
- react-pdf v10.3.0 for PDF viewer
- axios for API client

**Important Decisions (Shape Architecture):**
- Feature-based Zustand stores
- @nestjs/swagger for API documentation
- Custom NestJS Exception Filter for error handling
- Namespaced WebSocket events
- @nestjs/throttler for rate limiting
- NestJS Logger for structured logging

**Deferred Decisions (Post-MVP):**
- Testing infrastructure (Vitest, Playwright)
- Advanced monitoring (Sentry, external logging)
- S3-compatible storage migration (if scaling beyond 100 users)
- Remote caching for Turborepo (team collaboration)

### Data Architecture

**Database: PostgreSQL with TypeORM**
- **ORM**: TypeORM (already decided in step 3)
- **Migration Strategy**: TypeORM Migrations (generate + run workflow)
  - Version-controlled schema changes
  - Safe production deployments
  - Rollback capability
  - Command: `npm run migration:generate` → `npm run migration:run`

**Caching: Redis**
- **Purpose**: Job status, processed results, session data
- **Implementation**: ioredis client in NestJS
- **Cache Strategy**:
  - Job status: TTL 24 hours (fast progress lookups)
  - Processed literature reviews: TTL 7 days (avoid re-querying large text)
  - Session data: TTL per JWT expiry
- **Rationale**: Leverage existing Redis instance (used for BullMQ)

**File Storage: Local Filesystem (MVP)**
- **Location**: `/uploads/{userId}/{documentId}.pdf`
- **Persistence**: Mounted Docker volume on Coolify
- **Database Reference**: Store file path in PostgreSQL `documents` table
- **Serving**: NestJS static file serving with authorization middleware
- **Migration Path**: Easy to switch to S3-compatible storage (MinIO, S3) post-MVP

**Data Validation**:
- **Backend**: class-validator + class-transformer (NestJS decorators)
- **Frontend**: Shared types from `@repo/types` package
- **API Contract**: Enforced via shared TypeScript interfaces

### Authentication & Security

**Authentication: Google OAuth 2.0**
- **Implementation**: @nestjs/passport + passport-google-oauth20
- **Flow**:
  1. User clicks "Sign in with Google" → Frontend redirects to `/api/auth/google`
  2. NestJS redirects to Google OAuth consent screen
  3. Google redirects back to `/api/auth/google/callback`
  4. NestJS creates user record (if new), generates JWT
  5. JWT returned to frontend via httpOnly cookie
- **User Model**: Store Google ID, email, name in PostgreSQL

**Session Management: JWT with httpOnly Cookies**
- **Token Type**: JWT (JSON Web Tokens)
- **Storage**: httpOnly cookies (secure, not accessible to JavaScript)
- **Expiry**: 7 days (configurable via environment variable)
- **Refresh Strategy**: MVP uses single token; refresh tokens deferred post-MVP
- **Library**: @nestjs/jwt (official NestJS JWT module)
- **Secret**: Stored in environment variables, rotated per environment

**API Security:**

**CORS (Cross-Origin Resource Sharing):**
- **Implementation**: NestJS built-in CORS middleware
- **Allowed Origins**: Frontend domain (e.g., `https://research-assistant.yourdomain.com`)
- **Credentials**: Enabled (for httpOnly cookies)
- **Configuration**:
  ```typescript
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  ```

**Rate Limiting:**
- **Implementation**: @nestjs/throttler
- **Limits**:
  - PDF upload: 10 requests/minute per user
  - Processing job creation: 5 requests/minute per user
  - General API: 100 requests/minute per user
- **Rationale**: Protect Anthropic Claude API costs, prevent abuse

**Data Encryption:**
- **Transport**: HTTPS only (enforced by Coolify)
- **At Rest**: PostgreSQL encryption handled by Coolify/host
- **Passwords**: N/A (OAuth only, no password storage)

### API & Communication Patterns

**API Design: RESTful + WebSocket**
- **REST API**: CRUD operations, resource-based endpoints
- **WebSocket**: Real-time progress updates during PDF processing
- **Base URL**: `/api/v1/` (versioned for future compatibility)

**API Documentation:**
- **Tool**: @nestjs/swagger (auto-generated OpenAPI spec)
- **UI**: Swagger UI at `/api/docs`
- **Generation**: Automatic from NestJS decorators (@ApiProperty, @ApiResponse)
- **Benefit**: Frontend developers (you) can explore API interactively

**Error Handling: Custom Exception Filter**
- **Format**:
  ```typescript
  {
    statusCode: 400,
    message: "PDF extraction failed",
    error: "BadRequest",
    details: { fileName: "paper.pdf", reason: "Scanned document" },
    timestamp: "2026-01-15T10:30:00Z",
    path: "/api/v1/documents/process"
  }
  ```
- **Implementation**: Global NestJS Exception Filter
- **Benefits**: Consistent error format, actionable details for frontend graceful degradation

**WebSocket Event Naming:**
- **Convention**: Namespaced with module prefix
- **Events**:
  - `processing:progress` - Job progress updates (%)
  - `processing:complete` - Job finished successfully
  - `processing:error` - Job failed with error details
  - `document:uploaded` - Document upload confirmed
- **Room Strategy**: User-scoped rooms (`user:{userId}`) for private updates

**API Versioning:**
- **Strategy**: URL-based versioning (`/api/v1/`)
- **Rationale**: Simple, clear, supports breaking changes post-MVP

### Frontend Architecture

**State Management: Zustand (Feature-Based Stores)**

**Store Organization:**
- `useAuthStore` - User session, authentication state, login/logout actions
- `useDocumentStore` - Uploaded documents list, selected document, CRUD operations
- `useProcessingStore` - Job status, progress percentage, results, error state
- `useUIStore` - PDF viewer state (open/closed, current page), modals, notifications

**Benefits:**
- Clean separation of concerns
- Tree-shakeable (unused stores not bundled)
- Easy to test independently
- No prop drilling

**PDF Viewer: react-pdf v10.3.0**
- **Library**: react-pdf by wojtekmaj (latest ESM-only version)
- **PDF.js Version**: 5.3.93 (bundled with react-pdf)
- **Features Used**:
  - Page navigation API (for click-to-verify citations)
  - Side panel rendering (split-view layout)
  - Lazy loading (only render visible pages)
- **Installation**: `pnpm add react-pdf`
- **Worker**: Separate worker bundle for PDF rendering (performance)

**API Client: axios**
- **Configuration**: Axios instance with base URL and interceptors
- **Features**:
  - Automatic JWT token injection (request interceptor)
  - Base URL: `process.env.NEXT_PUBLIC_API_URL`
  - Standardized error handling (response interceptor)
  - Automatic JSON parsing
- **Type Safety**: Integrated with `@repo/types` shared package
- **Example**:
  ```typescript
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Send httpOnly cookies
  });
  ```

**Component Architecture:**
- **Server Components**: Default for pages, layouts (data fetching)
- **Client Components**: Interactive UI (`'use client'` directive)
- **shadcn/ui Components**: Reusable UI primitives in `src/components/ui/`
- **Feature Components**: Domain-specific components in `src/components/features/`

**Routing:**
- **Next.js App Router**: File-based routing in `src/app/`
- **Key Routes**:
  - `/` - Landing page (marketing)
  - `/dashboard` - Main app (upload, processing, results)
  - `/auth/callback` - OAuth callback handler

### Infrastructure & Deployment

**Hosting: Coolify (Self-Hosted)**

**Services Deployed on Coolify:**
1. **Next.js Frontend** (apps/web)
   - Docker container
   - Port: 3000
   - Build: `pnpm build` (static + server bundles)

2. **NestJS Backend** (apps/api)
   - Docker container
   - Port: 3001
   - Build: `pnpm build` (TypeScript → JavaScript)

3. **PostgreSQL**
   - Managed service on Coolify
   - Version: PostgreSQL 16 (latest stable)
   - Persistent volume for data

4. **Redis**
   - Managed service on Coolify
   - Version: Redis 7
   - Used by: BullMQ (job queue) + caching

**Service Networking:**
- Frontend → Backend: Internal Coolify network
- Backend → PostgreSQL: Internal network
- Backend → Redis: Internal network
- External: HTTPS via Coolify reverse proxy

**Environment Variables:**

**Local Development:**
- `.env.local` (git-ignored)
- Committed: `.env.example` as template

**Production (Coolify):**
- Coolify UI environment variable management
- Variables:
  - `DATABASE_URL` - PostgreSQL connection string
  - `REDIS_URL` - Redis connection string
  - `JWT_SECRET` - JWT signing secret
  - `GOOGLE_CLIENT_ID` - OAuth client ID
  - `GOOGLE_CLIENT_SECRET` - OAuth client secret
  - `ANTHROPIC_API_KEY` - Claude API key
  - `FRONTEND_URL` - Frontend domain (for CORS)

**Logging: NestJS Logger**
- **Implementation**: Built-in NestJS Logger
- **Log Levels**:
  - `error` - Failed jobs, API errors, exceptions (always logged)
  - `warn` - PDF processing issues, rate limit hits
  - `log` - Job started/completed, user actions
  - `debug` - Detailed processing steps (dev only)
- **Format**: Structured JSON logs (timestamp, level, message, context)
- **Output**: stdout (captured by Coolify, can forward to external service later)

**Docker Configuration:**
- **Multi-stage builds**: Optimize image size
- **Base image**: Node.js 20 Alpine (lightweight)
- **Volumes**:
  - `/uploads` - PDF file storage (persistent)
  - `/logs` - Application logs (optional)

**CI/CD:**
- **MVP**: Manual deploy via Coolify Git integration (push to main → auto-deploy)
- **Post-MVP**: GitHub Actions for:
  - Lint + type check
  - Build validation
  - Automated deployment

**Monitoring:**
- **MVP**: Coolify built-in health checks (HTTP ping)
- **Logs**: Coolify log aggregation
- **Post-MVP**: Consider Sentry for error tracking, Grafana for metrics

### Decision Impact Analysis

**Implementation Sequence:**

1. **Foundation** (Week 1):
   - Initialize Turborepo monorepo
   - Set up PostgreSQL + Redis on Coolify
   - Configure TypeORM with initial entities
   - Set up Google OAuth with @nestjs/passport

2. **Core Backend** (Week 2-3):
   - Implement BullMQ job queue
   - PDF upload endpoint + local filesystem storage
   - Anthropic Claude SDK integration
   - WebSocket gateway for progress updates

3. **Core Frontend** (Week 2-3):
   - Next.js authentication flow
   - PDF drag-and-drop upload UI
   - react-pdf viewer integration
   - Zustand stores setup

4. **Integration** (Week 4):
   - Connect frontend to backend APIs
   - Test citation click-to-verify flow
   - Error handling + graceful degradation
   - Deploy to Coolify

**Cross-Component Dependencies:**

**Citation Traceability System** (affects everything):
- Database: TypeORM entities must store `sourceDocumentId` + `pageNumber` for every citation
- API: All endpoints returning citations include source metadata
- Frontend: react-pdf viewer navigates to exact page on citation click
- Processing: Anthropic SDK prompt must instruct Claude to return page numbers

**Authentication Flow**:
- Backend: @nestjs/passport handles OAuth, generates JWT
- Frontend: axios interceptor injects JWT into API requests
- WebSocket: JWT validated on connection handshake

**Real-time Progress**:
- Backend: BullMQ job emits progress events → WebSocket gateway broadcasts
- Frontend: WebSocket client listens → updates Zustand `useProcessingStore`
- UI: Progress bar reacts to store changes

**Error Handling**:
- Backend: Custom Exception Filter returns standardized error format
- Frontend: axios interceptor catches errors → displays user-friendly messages
- UI: Graceful degradation (partial results still usable)

**File Storage**:
- Backend: Stores PDF at `/uploads/{userId}/{documentId}.pdf` → saves path in PostgreSQL
- Frontend: Requests PDF via `/api/v1/documents/{documentId}/file` → Backend serves with authorization check
- react-pdf: Renders PDF from authenticated backend URL

**Shared Types**:
- `@repo/types` package exports interfaces (User, Document, Citation, ProcessingJob)
- Backend imports for TypeORM entities + API DTOs
- Frontend imports for API client + Zustand stores
- Zero drift: Single source of truth for data contracts

## Implementation Patterns & Consistency Rules

### Overview

These patterns ensure multiple AI agents write compatible, consistent code across the Turborepo monorepo. **15 critical conflict points** have been identified and standardized to prevent implementation conflicts.

### Naming Patterns

#### Database (TypeORM): snake_case
- **Tables**: `users`, `research_documents`, `processing_jobs`
- **Columns**: `user_id`, `created_at`, `file_name`
- **Foreign Keys**: `user_id`, `document_id`
- **Indexes**: `idx_users_google_id`, `idx_documents_user_id`
- **TypeScript Properties**: camelCase with explicit column mapping

#### API Endpoints: Plural Resources
- **Format**: `/api/v1/{resources}` (plural)
- **Examples**: `/api/v1/documents`, `/api/v1/users`, `/api/v1/processing-jobs`
- **Route Params**: `:id` format (Express/NestJS)
- **Query Params**: camelCase (`?sortBy=createdAt&order=desc`)

#### File Naming: Framework-Specific
- **Frontend Components**: PascalCase (`DocumentCard.tsx`, `PdfViewer.tsx`)
- **Backend Files**: kebab-case (`auth.module.ts`, `documents.controller.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)

#### JSON Fields: camelCase
- **All API responses**: `{ userId: 1, createdAt: "2026-01-15T10:30:00Z" }`
- **WebSocket payloads**: `{ jobId: 5, documentId: 123 }`

### Structure Patterns

#### Test Files: Co-located
- `DocumentCard.tsx` + `DocumentCard.test.tsx` (same folder)
- `auth.service.ts` + `auth.service.spec.ts` (same folder)

#### Components: Hybrid Organization
```
src/components/
├── ui/           # shadcn/ui primitives
└── features/     # Domain components
    ├── documents/
    ├── processing/
    ├── citations/
    └── pdf-viewer/
```

#### Shared Types: Domain-Based
```
packages/types/src/
├── index.ts      # Re-exports all
├── auth.ts
├── documents.ts
├── citations.ts
├── processing.ts
└── common.ts
```

### Format Patterns

#### API Responses
- **Success**: Direct data (no wrapper)
- **Errors**: Standardized format with `statusCode`, `message`, `error`, `details`, `timestamp`, `path`
- **Dates**: ISO 8601 strings (`"2026-01-15T10:30:00.000Z"`)
- **Pagination**: `{ items: [], total, page, limit, totalPages }`

#### WebSocket Events
- **Naming**: Namespaced (`processing:progress`, `document:uploaded`)
- **Structure**: `{ event, payload, timestamp, userId }`

### Communication Patterns

#### Zustand State Management
- **Updates**: Immer middleware (direct mutations in `set()`)
- **Loading States**: Status enum (`'idle' | 'loading' | 'success' | 'error'`)
- **Organization**: Feature-based stores (`useAuthStore`, `useDocumentStore`, etc.)

#### Error Handling
- **API Errors**: Toast notifications
- **Validation**: Inline under fields
- **Critical**: Error boundaries
- **Processing**: Inline + graceful degradation

### Enforcement

**All AI agents MUST follow these patterns exactly.** Violations cause integration failures between frontend/backend or between different agents' code.

**Pattern violations** should be caught in code review and corrected before merging.

## Project Structure & Boundaries

### Complete Turborepo Monorepo Structure

```
research-assistant/
├── README.md
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspace definition
├── turbo.json                  # Turborepo pipeline config
├── tsconfig.json               # Base TypeScript config
├── .gitignore
├── .env.example                # Template for environment variables
├── docker-compose.yml          # Local development (PostgreSQL, Redis)
│
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── .env.local
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx              # Root layout
│   │   │   │   ├── page.tsx                # Landing page
│   │   │   │   ├── globals.css
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx            # Main app dashboard
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── auth/
│   │   │   │       └── callback/
│   │   │   │           └── page.tsx        # OAuth callback
│   │   │   ├── components/
│   │   │   │   ├── ui/                     # shadcn/ui components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   └── toast.tsx
│   │   │   │   └── features/               # Domain components
│   │   │   │       ├── documents/
│   │   │   │       │   ├── DocumentCard.tsx
│   │   │   │       │   ├── DocumentList.tsx
│   │   │   │       │   ├── UploadZone.tsx
│   │   │   │       │   └── DocumentCard.test.tsx
│   │   │   │       ├── processing/
│   │   │   │       │   ├── ProgressBar.tsx
│   │   │   │       │   ├── JobStatus.tsx
│   │   │   │       │   └── ProcessingView.tsx
│   │   │   │       ├── citations/
│   │   │   │       │   ├── CitationCard.tsx
│   │   │   │       │   ├── CitationList.tsx
│   │   │   │       │   └── VerifyButton.tsx
│   │   │   │       └── pdf-viewer/
│   │   │   │           ├── PdfViewer.tsx
│   │   │   │           ├── PageNavigation.tsx
│   │   │   │           └── PdfPanel.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts           # axios instance
│   │   │   │   ├── websocket-client.ts     # WebSocket connection
│   │   │   │   └── utils.ts
│   │   │   └── stores/                     # Zustand stores
│   │   │       ├── auth-store.ts
│   │   │       ├── document-store.ts
│   │   │       ├── processing-store.ts
│   │   │       └── ui-store.ts
│   │   └── public/
│   │       ├── favicon.ico
│   │       └── assets/
│   │
│   └── api/                    # NestJS Backend
│       ├── package.json
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── .env
│       ├── .env.example
│       ├── Dockerfile
│       ├── src/
│       │   ├── main.ts                     # Application entry
│       │   ├── app.module.ts               # Root module
│       │   ├── config/
│       │   │   ├── database.config.ts      # TypeORM config
│       │   │   ├── redis.config.ts         # Redis config
│       │   │   └── anthropic.config.ts     # Anthropic SDK config
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.service.spec.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   └── google.strategy.ts
│       │   │   │   └── guards/
│       │   │   │       └── jwt-auth.guard.ts
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── users.repository.ts
│       │   │   ├── documents/
│       │   │   │   ├── documents.module.ts
│       │   │   │   ├── documents.controller.ts
│       │   │   │   ├── documents.service.ts
│       │   │   │   ├── documents.repository.ts
│       │   │   │   └── pdf-extractor.service.ts
│       │   │   ├── processing/
│       │   │   │   ├── processing.module.ts
│       │   │   │   ├── processing.controller.ts
│       │   │   │   ├── processing.service.ts
│       │   │   │   └── processing.gateway.ts    # WebSocket
│       │   │   └── citations/
│       │   │       ├── citations.module.ts
│       │   │       ├── citations.controller.ts
│       │   │       ├── citations.service.ts
│       │   │       └── citations.repository.ts
│       │   ├── entities/                   # TypeORM entities
│       │   │   ├── user.entity.ts
│       │   │   ├── document.entity.ts
│       │   │   ├── processing-job.entity.ts
│       │   │   └── citation.entity.ts
│       │   ├── jobs/                       # BullMQ processors
│       │   │   ├── pdf-processing.processor.ts
│       │   │   └── ai-synthesis.processor.ts
│       │   ├── gateways/                   # WebSocket gateways
│       │   │   └── processing.gateway.ts
│       │   ├── filters/
│       │   │   └── http-exception.filter.ts  # Custom error filter
│       │   ├── interceptors/
│       │   │   └── logging.interceptor.ts
│       │   └── migrations/                 # TypeORM migrations
│       │       └── 1736937000000-InitialSchema.ts
│       └── test/
│           ├── app.e2e-spec.ts
│           └── jest-e2e.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                    # Re-exports all types
│   │       ├── auth.ts                     # User, AuthToken, LoginDto
│   │       ├── documents.ts                # Document, UploadDto, DocumentMetadata
│   │       ├── citations.ts                # Citation, CitationDto, CitationMetadata
│   │       ├── processing.ts               # ProcessingJob, JobStatus, ProgressEvent
│   │       └── common.ts                   # PaginatedResponse, ErrorResponse
│   │
│   ├── config/                 # Shared configuration
│   │   ├── package.json
│   │   ├── eslint/
│   │   │   └── index.js
│   │   ├── typescript/
│   │   │   └── tsconfig.json
│   │   └── tailwind/
│   │       └── tailwind.config.js
│   │
│   └── utils/                  # Shared utilities
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── formatDate.ts
│           └── validateEmail.ts
│
└── .coolify/                   # Coolify deployment config
    ├── docker-compose.prod.yml
    └── README.md
```

### Architectural Boundaries

#### API Boundaries

**Public API (Frontend ← Backend):**
- Base URL: `/api/v1/`
- Authentication: JWT in httpOnly cookies
- Rate limiting: @nestjs/throttler per endpoint

**Key Endpoints:**

```
Authentication:
  GET  /api/auth/google              # Initiate Google OAuth
  GET  /api/auth/google/callback     # OAuth callback
  POST /api/auth/logout              # Clear session

Documents:
  GET    /api/v1/documents           # List user documents
  GET    /api/v1/documents/:id       # Get document details
  POST   /api/v1/documents           # Upload document
  DELETE /api/v1/documents/:id       # Delete document
  GET    /api/v1/documents/:id/file  # Serve PDF file

Processing:
  POST /api/v1/processing-jobs              # Create processing job
  GET  /api/v1/processing-jobs/:id          # Get job status
  GET  /api/v1/processing-jobs/:id/results  # Get results

Citations:
  GET /api/v1/citations?documentId=:id  # List citations for document
```

**WebSocket (Real-time Updates):**
- Endpoint: `/ws` (via @nestjs/websockets)
- Authentication: JWT validation on connection
- Events: `processing:progress`, `processing:complete`, `processing:error`, `document:uploaded`

**Internal Boundaries:**
- Backend services communicate via TypeORM entities and shared interfaces
- No direct database access from controllers (goes through repositories)

#### Component Boundaries

**Frontend Component Communication:**

```
User Interaction → Components → Zustand Stores → API Client → Backend

Example Flow:
1. User drags PDF into UploadZone component
2. UploadZone calls useDocumentStore.uploadDocument()
3. Store calls apiClient.post('/api/v1/documents', formData)
4. Backend processes, returns Document
5. Store updates state, component re-renders
```

**State Management Boundaries:**
- Each Zustand store manages one domain (auth, documents, processing, ui)
- Stores don't directly call each other (use React hooks/effects)
- WebSocket client updates stores directly on events

**Backend Module Boundaries:**
- Each NestJS module is self-contained (controller → service → repository)
- Modules communicate via dependency injection
- Shared logic in separate modules (e.g., auth guards, exception filters)

#### Data Boundaries

**Database Access:**
- All database queries through TypeORM repositories
- Entities define schema (snake_case columns, camelCase properties)
- Migrations manage schema evolution

**Caching Strategy:**
- Redis for job status (TTL 24h)
- Redis for processed results (TTL 7 days)
- No frontend caching (always fetch fresh from API)

**File Storage:**
- PDFs stored at `/uploads/{userId}/{documentId}.pdf`
- Path stored in `documents` table
- Backend serves files with authorization check

### Requirements to Structure Mapping

#### FR1-FR5: Document Management
```
Frontend:
  - components/features/documents/UploadZone.tsx
  - components/features/documents/DocumentList.tsx
  - stores/document-store.ts

Backend:
  - modules/documents/documents.controller.ts
  - modules/documents/documents.service.ts
  - modules/documents/pdf-extractor.service.ts
  - entities/document.entity.ts

Storage:
  - /uploads/{userId}/{documentId}.pdf
```

#### FR6-FR10: AI Literature Review
```
Backend:
  - modules/processing/processing.service.ts
  - jobs/pdf-processing.processor.ts
  - jobs/ai-synthesis.processor.ts
  - config/anthropic.config.ts

Queue:
  - BullMQ queue: 'pdf-processing'
  - Redis for job status
```

#### FR11-FR15: Citation Traceability
```
Frontend:
  - components/features/citations/CitationCard.tsx
  - components/features/citations/VerifyButton.tsx

Backend:
  - modules/citations/citations.service.ts
  - entities/citation.entity.ts

Shared Types:
  - packages/types/src/citations.ts
```

#### FR16-FR20: PDF Viewer
```
Frontend:
  - components/features/pdf-viewer/PdfViewer.tsx
  - components/features/pdf-viewer/PageNavigation.tsx
  - lib/api-client.ts (fetch PDF from backend)

Backend:
  - modules/documents/documents.controller.ts (serve file endpoint)
```

#### FR21-FR24: Progress & Status
```
Frontend:
  - components/features/processing/ProgressBar.tsx
  - components/features/processing/JobStatus.tsx
  - stores/processing-store.ts
  - lib/websocket-client.ts

Backend:
  - gateways/processing.gateway.ts (WebSocket)
  - modules/processing/processing.service.ts
```

#### FR25-FR28: Error Handling
```
Frontend:
  - lib/api-client.ts (axios interceptors)
  - components/ui/toast.tsx

Backend:
  - filters/http-exception.filter.ts (standardized errors)
```

#### FR29-FR32: Authentication
```
Frontend:
  - app/auth/callback/page.tsx
  - stores/auth-store.ts

Backend:
  - modules/auth/auth.controller.ts
  - modules/auth/strategies/google.strategy.ts
  - modules/auth/guards/jwt-auth.guard.ts
```

### Integration Points

**Internal Communication:**

1. **Frontend → Backend API**
   - axios client with JWT interceptor
   - Base URL from environment variable
   - Standardized error handling

2. **Frontend ← Backend WebSocket**
   - Socket.io client connects on dashboard mount
   - Listens for `processing:*` events
   - Updates Zustand processing store

3. **Backend → PostgreSQL**
   - TypeORM connection via config
   - Repositories for data access
   - Migrations for schema changes

4. **Backend → Redis**
   - ioredis client for caching
   - BullMQ for job queue
   - Shared Redis instance

5. **Backend → Anthropic Claude**
   - @anthropic-ai/sdk
   - API key from environment
   - Called from ai-synthesis.processor.ts

**External Integrations:**

1. **Google OAuth**
   - passport-google-oauth20 strategy
   - Callback: /api/auth/google/callback
   - Stores user in PostgreSQL

2. **Anthropic Claude API**
   - Literature review synthesis
   - Citation extraction with page numbers
   - Retry logic for failures

**Data Flow:**

```
1. PDF Upload Flow:
   User → UploadZone → documentStore.uploadDocument()
   → POST /api/v1/documents
   → documents.service.ts → Save PDF to /uploads/
   → document.entity created in PostgreSQL
   → Response → documentStore updates → UI re-renders

2. Processing Flow:
   User → "Process" button → processingStore.createJob()
   → POST /api/v1/processing-jobs
   → BullMQ adds job to queue
   → pdf-processing.processor extracts text
   → ai-synthesis.processor calls Anthropic API
   → Results saved to PostgreSQL + Redis cache
   → WebSocket emits processing:complete
   → processingStore receives event → UI updates

3. Citation Verification Flow:
   User clicks citation → CitationCard calls document API
   → GET /api/v1/documents/:id/file
   → Backend serves PDF with authorization
   → PdfViewer renders at specific page
```

### Development Workflow Integration

**Development Commands:**

```bash
# Root (all workspaces)
pnpm install        # Install all dependencies
pnpm dev            # Start both frontend & backend
pnpm build          # Build all apps
pnpm lint           # Lint all packages
pnpm typecheck      # Type check all packages

# Frontend only
cd apps/web
pnpm dev            # Next.js dev server (port 3000)
pnpm build          # Production build

# Backend only
cd apps/api
pnpm dev            # NestJS dev server (port 3001)
pnpm migration:generate  # Generate TypeORM migration
pnpm migration:run       # Run pending migrations
```

**Local Development Setup:**

1. Start PostgreSQL + Redis: `docker-compose up -d`
2. Configure environment variables (`.env.local`)
3. Run migrations: `cd apps/api && pnpm migration:run`
4. Start dev servers: `pnpm dev` (from root)

**Deployment (Coolify):**

1. Push to Git repository
2. Coolify builds Docker containers for apps/web and apps/api
3. Coolify manages PostgreSQL + Redis services
4. Environment variables configured in Coolify UI
5. Services networked internally, HTTPS via reverse proxy

---

## Architecture Document Complete

This architecture document defines the complete technical foundation for the research-assistant project. All decisions have been made collaboratively, all patterns standardized, and the complete project structure mapped.

**Next Steps:**
1. Initialize the Turborepo monorepo using the commands in "Starter Template Evaluation"
2. Implement the project structure as defined
3. Follow all naming and format patterns exactly as specified
4. Reference this document when architectural questions arise during implementation
