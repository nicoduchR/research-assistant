---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
currentStep: 'step-02-design-epics'
---

# research-assistant - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for research-assistant, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Document Management:**
- FR1: User can upload PDF documents via drag-and-drop
- FR2: User can upload multiple PDF documents simultaneously
- FR3: User can view list of uploaded documents
- FR4: User can remove documents from their collection
- FR5: System can extract text content from PDF documents

**AI Literature Review:**
- FR6: User can initiate AI processing on uploaded documents
- FR7: System can generate structured literature review synthesis from multiple PDFs
- FR8: System can identify themes and group related arguments across documents
- FR9: User can view generated literature review output
- FR10: User can edit generated literature review content

**Citation Traceability:**
- FR11: System can link each generated claim to its source PDF
- FR12: System can identify exact page number for each citation
- FR13: User can see citation reference for any generated statement
- FR14: User can manually correct citation information
- FR15: System can flag citations with uncertain page accuracy

**PDF Viewer & Verification:**
- FR16: User can view PDF documents in side panel
- FR17: User can navigate to specific page in PDF viewer
- FR18: User can click citation to open source PDF at referenced page
- FR19: User can scroll and navigate within PDF viewer
- FR20: User can close PDF viewer panel

**Progress & Status:**
- FR21: User can see current processing status during AI generation
- FR22: User can see real-time progress updates during PDF processing
- FR23: User can see current position in research methodology stages
- FR24: User can view predefined next steps for current stage

**Error Handling:**
- FR25: System can detect unprocessable PDFs (scanned/image-based)
- FR26: User can see clear error message when PDF processing fails
- FR27: System can continue processing remaining documents when one fails
- FR28: User can see which documents succeeded and which failed

**User Authentication:**
- FR29: User can sign in using Google account (OAuth)
- FR30: User can sign out of their account
- FR31: User's uploaded documents are associated with their account
- FR32: User can access their documents from any device after signing in

### NonFunctional Requirements

**Performance:**
- NFR1: Initial page load < 3 seconds (LCP)
- NFR2: UI responsiveness < 200ms for user actions
- NFR3: PDF processing has no strict time limit (users expect AI processing to take time; progress bar manages expectations)

**Security:**
- NFR4: Transport encryption via HTTPS only
- NFR5: Authentication via Google OAuth 2.0
- NFR6: PDF storage is server-side with user-scoped access
- NFR7: Session management uses secure cookies with reasonable expiry

**Reliability:**
- NFR8: Processing recovery - user can leave and return to see results
- NFR9: Data persistence - user documents survive server restart
- NFR10: Graceful degradation - partial failures don't block entire workflow

### Additional Requirements

**Architecture & Technical Stack:**
- Turborepo monorepo structure with pnpm workspace
- Frontend: Next.js (App Router), Tailwind CSS, shadcn/ui components, Zustand state management
- Backend: NestJS framework, PostgreSQL database, TypeORM for ORM, BullMQ for job queue, WebSocket for real-time updates
- AI Integration: Anthropic Claude via @anthropic-ai/sdk for literature review synthesis
- Deployment: Self-hosted with Coolify (Docker containers for Next.js, NestJS, PostgreSQL, Redis)
- TypeORM migrations for schema evolution (generate + run workflow)
- Redis caching for job status (TTL 24h) and processed results (TTL 7 days)
- Local filesystem storage for PDFs at /uploads/{userId}/{documentId}.pdf (mounted Docker volume)
- JWT with httpOnly cookies for session management (7-day expiry)
- @nestjs/passport + passport-google-oauth20 for Google OAuth integration
- @nestjs/throttler for rate limiting (10 req/min for upload, 5 req/min for processing, 100 req/min general)
- @nestjs/swagger for automatic API documentation at /api/docs
- Custom NestJS Exception Filter for standardized error responses
- RESTful API with URL-based versioning (/api/v1/)
- WebSocket event naming: Namespaced (processing:progress, processing:complete, processing:error, document:uploaded)
- react-pdf v10.3.0 for PDF viewer with lazy loading and page navigation
- axios API client with base URL, JWT interceptor, and error handling
- NestJS Logger for structured JSON logging (error, warn, log, debug levels)

**UX & Design Requirements:**
- Desktop-first design (1024px+ primary viewport)
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions only)
- Tablet: Basic support (768-1023px, not optimized)
- Mobile: Minimal support (<768px, not a priority)
- Native HTML5 drag-and-drop API with large drop-zone (entire screen becomes drag target)
- Split-view layout for PDF side panel and literature review display
- Real-time progress updates via WebSocket (no polling)
- Calm, spacious white background with generous padding
- Clear "you are here" methodology progress tracker
- Toast notifications for API errors
- Inline error messaging under form fields
- One-click citation verification (opens PDF at exact page)
- Semantic HTML with basic ARIA for accessibility
- Progress bars for all long-running operations
- High contrast for primary action buttons

**Naming & Format Patterns:**
- Database: snake_case (tables: users, research_documents, processing_jobs; columns: user_id, created_at, file_name)
- API Endpoints: Plural resources (/api/v1/documents, /api/v1/users, /api/v1/processing-jobs)
- Frontend Components: PascalCase (DocumentCard.tsx, PdfViewer.tsx)
- Backend Files: kebab-case (auth.module.ts, documents.controller.ts)
- JSON Fields: camelCase (userId, createdAt)
- API Responses: ISO 8601 date strings, direct data (no wrapper), standardized error format
- TypeScript: camelCase properties with explicit TypeORM column mapping

**Data & Storage:**
- User-scoped data isolation (users only access their own PDFs and content)
- Citation metadata must preserve sourceDocumentId + pageNumber at all layers
- File serving with authorization middleware (verify user owns document)
- Async job processing with state persistence (processing continues if browser closes)

### FR Coverage Map

**Epic 1 - Secure Research Workspace:**
- FR29: User can sign in using Google account (OAuth)
- FR30: User can sign out of their account
- FR31: User's uploaded documents are associated with their account
- FR32: User can access their documents from any device after signing in

**Epic 2 - Document Upload & Management:**
- FR1: User can upload PDF documents via drag-and-drop
- FR2: User can upload multiple PDF documents simultaneously
- FR3: User can view list of uploaded documents
- FR4: User can remove documents from their collection
- FR5: System can extract text content from PDF documents

**Epic 3 - AI-Powered Literature Review Generation:**
- FR6: User can initiate AI processing on uploaded documents
- FR7: System can generate structured literature review synthesis from multiple PDFs
- FR8: System can identify themes and group related arguments across documents
- FR9: User can view generated literature review output
- FR10: User can edit generated literature review content
- FR11: System can link each generated claim to its source PDF
- FR12: System can identify exact page number for each citation
- FR13: User can see citation reference for any generated statement
- FR14: User can manually correct citation information
- FR15: System can flag citations with uncertain page accuracy
- FR21: User can see current processing status during AI generation
- FR22: User can see real-time progress updates during PDF processing
- FR23: User can see current position in research methodology stages
- FR24: User can view predefined next steps for current stage
- FR25: System can detect unprocessable PDFs (scanned/image-based)
- FR26: User can see clear error message when PDF processing fails
- FR27: System can continue processing remaining documents when one fails
- FR28: User can see which documents succeeded and which failed

**Epic 4 - Citation Verification & PDF Viewer:**
- FR16: User can view PDF documents in side panel
- FR17: User can navigate to specific page in PDF viewer
- FR18: User can click citation to open source PDF at referenced page
- FR19: User can scroll and navigate within PDF viewer
- FR20: User can close PDF viewer panel

## Epic List

### Epic 1: Secure Research Workspace
Users can sign in securely with their Google account and access their personal research workspace from any device.

**FRs covered:** FR29, FR30, FR31, FR32

### Epic 2: Document Upload & Management
Users can upload PDF research documents via drag-and-drop, view their collection, and manage their documents with automatic text extraction.

**FRs covered:** FR1, FR2, FR3, FR4, FR5

### Epic 3: AI-Powered Literature Review Generation
Users can process their PDFs and generate structured literature reviews with full citation traceability, seeing real-time progress and handling errors gracefully.

**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

### Epic 4: Citation Verification & PDF Viewer
Users can verify any AI-generated citation by clicking to open the source PDF at the exact page in a side panel.

**FRs covered:** FR16, FR17, FR18, FR19, FR20

## Epic 1: Secure Research Workspace

Users can sign in securely with their Google account and access their personal research workspace from any device.

### Story 1.1: Monorepo Setup and Base Infrastructure

As a developer,
I want to set up the Turborepo monorepo with Next.js and NestJS applications,
So that I have a working development environment ready for feature implementation.

**Acceptance Criteria:**

**Given** I am starting a new project
**When** I set up the monorepo structure
**Then** A Turborepo workspace is created with pnpm configuration
**And** A Next.js app is scaffolded in `apps/web` with App Router and Tailwind CSS
**And** A NestJS API is scaffolded in `apps/api` with TypeScript configuration
**And** Shared TypeScript configs are in `packages/tsconfig`
**And** Running `pnpm dev` starts both applications successfully
**And** Next.js app serves on localhost:3000
**And** NestJS API serves on localhost:3001 with a health check endpoint
**And** Hot reload works for both applications

### Story 1.2: Database Foundation and User Model

As a developer,
I want to configure PostgreSQL with TypeORM and create the User entity,
So that the application can persist user data.

**Acceptance Criteria:**

**Given** The monorepo is set up
**When** I configure the database connection
**Then** PostgreSQL connection is configured in NestJS using TypeORM
**And** A `User` entity is created with fields: id (uuid), google_id (string), email (string), name (string), avatar_url (string), created_at (timestamp), updated_at (timestamp)
**And** TypeORM migrations are configured with generate and run scripts
**And** An initial migration file is generated for the users table
**And** Running the migration creates the users table in PostgreSQL with snake_case columns (user_id, google_id, created_at, etc.)
**And** Database connection environment variables are documented (.env.example)
**And** The API starts successfully with database connected

### Story 1.3: Google OAuth Sign-In Flow

As a working professional pursuing an MBA,
I want to sign in using my Google account,
So that I can securely access my research workspace without creating another password.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I click "Sign in with Google" on the landing page
**Then** I am redirected to Google OAuth consent screen
**And** After granting permission, I am redirected back to the application
**And** The backend receives my Google profile (id, email, name, avatar)
**And** A new user record is created in the users table if this is my first sign-in
**And** An existing user record is updated if I've signed in before
**And** A JWT token is generated containing my user ID
**And** The JWT is set as an httpOnly cookie with 7-day expiry
**And** I am redirected to the dashboard page
**And** The application recognizes me as authenticated

**Given** Google OAuth fails or is cancelled
**When** I am redirected back to the application
**Then** I see an error message "Sign-in failed. Please try again."
**And** I remain on the landing page
**And** No user session is created

### Story 1.4: Protected Frontend Routes and Session Management

As a signed-in user,
I want the application to remember my authentication state and protect my workspace,
So that only I can access my research documents and data.

**Acceptance Criteria:**

**Given** I am authenticated with a valid JWT cookie
**When** I navigate to the dashboard page
**Then** The Next.js middleware validates my JWT
**And** I am granted access to the dashboard
**And** My user info (name, email, avatar) is displayed in the header
**And** Zustand store is populated with my authentication state

**Given** I am not authenticated (no JWT cookie)
**When** I attempt to access the dashboard directly via URL
**Then** I am redirected to the landing page
**And** I see a message "Please sign in to access your workspace"

**Given** I have a valid session
**When** I refresh the page
**Then** My authentication state persists
**And** I remain on the dashboard without being logged out

**Given** My JWT has expired (> 7 days old)
**When** I attempt to access a protected route
**Then** I am redirected to the landing page
**And** The expired cookie is cleared
**And** I see a message "Your session has expired. Please sign in again."

### Story 1.5: Sign-Out Functionality

As a signed-in user,
I want to sign out of my account,
So that I can securely end my session especially on shared devices.

**Acceptance Criteria:**

**Given** I am signed in and viewing the dashboard
**When** I click the "Sign Out" button in the header
**Then** A request is sent to the backend `/api/v1/auth/logout` endpoint
**And** The httpOnly JWT cookie is cleared on the backend
**And** My Zustand auth state is cleared on the frontend
**And** I am redirected to the landing page
**And** I see a message "You have been signed out successfully"

**Given** I have signed out
**When** I attempt to access the dashboard
**Then** I am blocked and redirected to the landing page
**And** I must sign in again to access protected routes
