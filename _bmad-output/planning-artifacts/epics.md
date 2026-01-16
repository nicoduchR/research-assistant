---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
workflowComplete: true
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
currentStep: 'complete'
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

## Epic 2: Document Upload & Management

Users can upload PDF research documents via drag-and-drop, view their collection, and manage their documents with automatic text extraction.

### Story 2.1: Document Data Model and Storage Setup

As a developer,
I want to create the document data model and configure filesystem storage,
So that the application can persist uploaded PDFs with proper user isolation.

**Acceptance Criteria:**

**Given** The database is set up with the User entity
**When** I create the document data model
**Then** A `ResearchDocument` entity is created with fields: id (uuid), user_id (uuid FK), file_name (string), file_size (integer), mime_type (string), storage_path (string), page_count (integer nullable), text_extracted (boolean default false), extraction_error (string nullable), uploaded_at (timestamp), updated_at (timestamp)
**And** A TypeORM migration is generated for the research_documents table
**And** The migration creates the table with snake_case columns (user_id, file_name, page_count, etc.)
**And** A foreign key constraint links research_documents.user_id to users.id with ON DELETE CASCADE
**And** An index is created on user_id for query performance
**And** The filesystem directory structure `/uploads/{userId}/` is created on application startup
**And** The uploads directory is configured as a Docker mounted volume
**And** Environment variable for upload path is documented (.env.example)

### Story 2.2: Single PDF Upload Endpoint

As a working professional pursuing an MBA,
I want to upload a PDF research paper to the application,
So that I can begin processing my literature for the review.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I POST a PDF file to `/api/v1/documents/upload`
**Then** The API accepts multipart/form-data with a file field
**And** The file is validated to be PDF format (mime type: application/pdf)
**And** A unique document ID (UUID) is generated
**And** The file is saved to `/uploads/{userId}/{documentId}.pdf`
**And** A new record is created in research_documents table with file metadata
**And** The API returns 201 status with document object (id, fileName, fileSize, uploadedAt)
**And** The response follows the API naming convention (camelCase fields)

**Given** I upload a non-PDF file
**When** I POST the file to the upload endpoint
**Then** The API returns 400 status with error "Only PDF files are supported"
**And** No file is saved to the filesystem
**And** No database record is created

**Given** I am not authenticated
**When** I attempt to upload a file
**Then** The API returns 401 status with error "Authentication required"
**And** No file is saved

**Given** The file size exceeds 50MB
**When** I upload the file
**Then** The API returns 413 status with error "File size exceeds maximum limit of 50MB"
**And** No file is saved

### Story 2.3: PDF Text Extraction Pipeline

As a working professional,
I want the system to automatically extract text from my uploaded PDFs,
So that the AI can analyze the content for literature review generation.

**Acceptance Criteria:**

**Given** A PDF file has been uploaded successfully
**When** The upload completes
**Then** A background job is queued to extract text from the PDF
**And** The job uses a PDF parsing library (pdf-parse or pdf.js) to extract text content
**And** The page count is extracted and stored in the page_count field
**And** The text_extracted field is set to true upon successful extraction
**And** The extracted text is stored appropriately for later AI processing

**Given** The PDF is text-based (not scanned)
**When** Text extraction runs
**Then** All text content is successfully extracted with page boundaries preserved
**And** The extraction completes within 30 seconds for typical academic papers (20-40 pages)

**Given** The PDF is scanned or image-based
**When** Text extraction runs
**Then** The extraction fails gracefully
**And** The text_extracted field remains false
**And** The extraction_error field is set to "Scanned PDF detected - text extraction not possible"
**And** The document record is still saved and visible to the user
**And** No exception crashes the application

**Given** Text extraction fails for any reason
**When** The error occurs
**Then** The error message is logged with document ID and user ID
**And** The extraction_error field captures the error message
**And** The document remains in the database for user visibility

### Story 2.4: Drag-and-Drop Upload Interface

As a working professional,
I want to drag and drop multiple PDF files onto the page,
So that I can quickly upload all my research papers in one action.

**Acceptance Criteria:**

**Given** I am on the dashboard page
**When** The page loads
**Then** A large drop zone is displayed with clear instructions "Drag PDFs here or click to browse"
**And** The entire dashboard area acts as a drop target when dragging files
**And** Visual feedback appears when dragging files over the drop zone (border highlight or overlay)

**Given** I drag a single PDF file over the drop zone
**When** I release the file
**Then** The file is uploaded via the `/api/v1/documents/upload` endpoint
**And** A progress indicator shows upload percentage
**And** A success message appears when upload completes: "Document uploaded successfully"
**And** The document list refreshes to show the new document

**Given** I drag multiple PDF files (e.g., 5 files) over the drop zone
**When** I release the files
**Then** All files are uploaded simultaneously (in parallel)
**And** Each file shows its own progress indicator
**And** The rate limiter allows up to 10 uploads per minute
**And** Successfully uploaded files appear in the document list immediately
**And** A summary message shows: "5 of 5 documents uploaded successfully"

**Given** I drag a non-PDF file (e.g., .docx, .jpg)
**When** I release the file
**Then** A toast error message appears: "Only PDF files are supported"
**And** The file is not uploaded
**And** Other valid PDFs in the batch still upload successfully

**Given** An upload fails (network error, server error)
**When** The error occurs
**Then** A toast error message appears with the document name: "Failed to upload document.pdf"
**And** The failed file can be retried
**And** Other uploads in progress continue unaffected

### Story 2.5: Document List View

As a working professional,
I want to see all my uploaded documents in a list,
So that I can track what papers I've added and select documents for processing.

**Acceptance Criteria:**

**Given** I am authenticated and on the dashboard
**When** The page loads
**Then** A GET request is made to `/api/v1/documents`
**And** The API returns all documents for the authenticated user only (user-scoped query)
**And** Documents are displayed in a list/grid with cards showing: file name, upload date, page count, file size

**Given** I have uploaded 3 documents
**When** I view the document list
**Then** All 3 documents are visible
**And** Documents are sorted by upload date (newest first)
**And** Each document card displays: file icon, file name (truncated if long), upload timestamp (formatted: "Jan 15, 2026"), page count (e.g., "24 pages"), file size (formatted: "2.4 MB")

**Given** A document's text extraction is in progress
**When** I view the document list
**Then** The document card shows a spinner or "Processing..." indicator
**And** The page count is shown as "—" until extraction completes

**Given** A document's text extraction failed (scanned PDF)
**When** I view the document list
**Then** The document card shows a warning icon
**And** A tooltip or badge displays: "Scanned PDF - text extraction not available"
**And** The document is still visible and selectable

**Given** I have no documents uploaded
**When** I view the document list
**Then** An empty state is displayed with message: "No documents yet. Drag and drop PDFs to get started."
**And** The drag-and-drop zone remains prominent

### Story 2.6: Remove Document Functionality

As a working professional,
I want to remove documents from my collection,
So that I can manage my workspace and delete papers I no longer need.

**Acceptance Criteria:**

**Given** I have documents in my list
**When** I hover over a document card
**Then** A delete button (trash icon) appears on the card

**Given** I click the delete button on a document
**When** The button is clicked
**Then** A confirmation modal appears with message: "Are you sure you want to delete [filename]? This action cannot be undone."
**And** The modal has "Cancel" and "Delete" buttons

**Given** I confirm deletion
**When** I click "Delete" in the confirmation modal
**Then** A DELETE request is sent to `/api/v1/documents/{documentId}`
**And** The API verifies the document belongs to the authenticated user
**And** The document record is deleted from the research_documents table
**And** The PDF file is deleted from the filesystem at `/uploads/{userId}/{documentId}.pdf`
**And** The document is removed from the list view immediately
**And** A success message appears: "Document deleted successfully"

**Given** I click "Cancel" in the confirmation modal
**When** The cancel button is clicked
**Then** The modal closes
**And** The document is not deleted
**And** No API request is made

**Given** I try to delete another user's document
**When** I send a DELETE request with a document ID I don't own
**Then** The API returns 403 status with error "You do not have permission to delete this document"
**And** The document is not deleted

**Given** Deletion fails (file system error, database error)
**When** The error occurs
**Then** A toast error message appears: "Failed to delete document. Please try again."
**And** The document remains in the list
**And** The error is logged on the backend

## Epic 3: AI-Powered Literature Review Generation

Users can process their PDFs and generate structured literature reviews with full citation traceability, seeing real-time progress and handling errors gracefully.

### Story 3.1: Processing Jobs Infrastructure

As a developer,
I want to set up BullMQ with Redis for async job processing,
So that long-running AI tasks can be processed in the background without blocking the API.

**Acceptance Criteria:**

**Given** The NestJS API is running
**When** I set up the job queue infrastructure
**Then** Redis is configured and connected to the NestJS application
**And** BullMQ is installed and configured with a queue named "literature-processing"
**And** A `ProcessingJob` entity is created with fields: id (uuid), user_id (uuid FK), status (enum: queued, processing, completed, failed), document_ids (jsonb array), result_id (uuid nullable FK), error_message (text nullable), progress_percentage (integer default 0), progress_message (string nullable), queued_at (timestamp), started_at (timestamp nullable), completed_at (timestamp nullable)
**And** A TypeORM migration is generated for the processing_jobs table
**And** The migration creates the table with snake_case columns and an index on user_id
**And** A job worker is configured to listen to the "literature-processing" queue
**And** The worker logs when it starts processing a job
**And** Job status transitions are tracked: queued → processing → completed/failed
**And** Redis configuration is documented in .env.example (host, port, password)

### Story 3.2: AI Integration Setup

As a developer,
I want to integrate the Anthropic Claude SDK,
So that the application can call Claude API for literature review synthesis.

**Acceptance Criteria:**

**Given** The API infrastructure is set up
**When** I integrate the Anthropic Claude SDK
**Then** The @anthropic-ai/sdk package is installed
**And** An AI service module is created in the NestJS application
**And** The service is configured with the Anthropic API key from environment variables
**And** A test endpoint `/api/v1/ai/health` verifies API connectivity
**And** Rate limiting is configured using @nestjs/throttler (5 req/min for AI processing)
**And** The AI service has a method `generateLiteratureReview(documents, extractedTexts)` that accepts document metadata and text
**And** API key configuration is documented in .env.example
**And** Error handling wraps all AI API calls with try-catch and logging

### Story 3.3: Literature Review Generation Core

As a working professional,
I want the AI to synthesize my uploaded PDFs into a structured literature review,
So that I have a draft that organizes the key themes and arguments from my research papers.

**Acceptance Criteria:**

**Given** I have uploaded and extracted text from multiple PDFs
**When** A processing job is executed by the worker
**Then** The worker fetches all selected documents and their extracted text from the database
**And** The documents' text is sent to Claude API with a prompt to generate a structured literature review
**And** The prompt instructs Claude to identify themes, group related arguments, and synthesize findings
**And** The prompt instructs Claude to include source references for every claim (document ID + page number)
**And** The AI response is received and parsed
**And** A new `LiteratureReview` entity is created with fields: id (uuid), user_id (uuid FK), job_id (uuid FK), title (string), content (text), document_ids (jsonb array), created_at (timestamp), updated_at (timestamp)
**And** The generated review content is saved to the literature_reviews table
**And** The processing job's result_id is set to the literature review ID
**And** The job status is updated to "completed"

**Given** The AI generation takes 4 minutes
**When** The worker is processing
**Then** The job remains in "processing" status throughout
**And** The worker does not timeout (configured for long-running tasks)
**And** Progress updates are emitted periodically (handled in Story 3.5)

**Given** The AI API call fails (timeout, rate limit, service error)
**When** The error occurs
**Then** The error is caught and logged with job ID and error details
**And** The job status is set to "failed"
**And** The error_message field captures the failure reason
**And** No literature review record is created
**And** The user is notified of the failure (handled in Story 3.6)

### Story 3.4: Citation Traceability System

As a working professional,
I want every AI-generated claim to link to its source document and exact page number,
So that I can verify the accuracy and cite sources correctly in my academic paper.

**Acceptance Criteria:**

**Given** The AI generates literature review content
**When** The content is processed and saved
**Then** The AI prompt explicitly requests citation metadata in a structured format
**And** Each synthesized claim includes: {text: "claim text", sourceDocumentId: "uuid", pageNumber: 12}
**And** A `Citation` entity is created with fields: id (uuid), literature_review_id (uuid FK), document_id (uuid FK), page_number (integer), claim_text (text), position_in_review (integer), is_verified (boolean default false), user_notes (text nullable), created_at (timestamp)
**And** A TypeORM migration is generated for the citations table
**And** The migration creates foreign key constraints to literature_reviews and research_documents
**And** An index is created on literature_review_id for query performance
**And** All citations are extracted from the AI response and saved to the citations table
**And** The citation data links the claim text to the source document ID and page number
**And** The literature review content is rendered with inline citation references (e.g., superscript numbers or markers)

**Given** The AI cannot determine a page number for a specific claim
**When** The citation is processed
**Then** The page_number field is set to null
**And** A flag indicates uncertain page accuracy (can use user_notes or a separate field)
**And** The citation is still saved and linked to the document

**Given** A citation references a document that doesn't exist in the database
**When** The citation is validated
**Then** The citation is flagged with an error in the logs
**And** The citation is still saved with the provided document_id for manual review
**And** The job does not fail due to this issue

### Story 3.5: Real-Time Progress Updates via WebSocket

As a working professional,
I want to see live progress updates while my documents are being processed,
So that I know the system is working and can estimate how much longer I need to wait.

**Acceptance Criteria:**

**Given** The NestJS API is running
**When** I set up WebSocket support
**Then** @nestjs/websockets and socket.io are installed and configured
**And** A WebSocket gateway is created with authentication middleware (validates JWT from cookie/handshake)
**And** The gateway handles connection events and maintains user-specific rooms
**And** Clients can connect to the WebSocket server at the same domain as the API

**Given** A processing job is running
**When** The worker processes the job
**Then** The worker emits progress events at key milestones:
  - "processing:progress" with {jobId, userId, progressPercentage, progressMessage}
  - Events include: "Extracting text...", "Analyzing documents...", "Generating synthesis...", "Finalizing review..."
**And** The WebSocket gateway receives these events and broadcasts to the user's room
**And** Only the job owner receives their job's progress updates (user-scoped)

**Given** I am connected via WebSocket
**When** Progress events are emitted
**Then** My frontend receives the events in real-time
**And** The events include jobId, progressPercentage (0-100), and progressMessage
**And** The frontend can update the UI immediately without polling

**Given** The WebSocket connection drops
**When** I reconnect
**Then** The connection is re-established automatically
**And** The current job status is fetched via REST API to sync state
**And** Progress updates resume via WebSocket

### Story 3.6: Initiate Processing and Progress Display

As a working professional,
I want to start the AI processing with one click and see live progress,
So that I can generate my literature review draft without confusion.

**Acceptance Criteria:**

**Given** I have uploaded at least one document with successful text extraction
**When** I view the dashboard
**Then** A "Generate Literature Review" button is prominently displayed
**And** The button is disabled if no documents are ready (no text extracted)
**And** A tooltip explains why the button is disabled if applicable

**Given** I click "Generate Literature Review"
**When** The button is clicked
**Then** A POST request is sent to `/api/v1/processing/start` with selected document IDs
**And** The API creates a new processing job record with status "queued"
**And** The job is added to the BullMQ queue
**And** The API returns 201 status with job object (id, status, queuedAt)
**And** The frontend opens a progress modal or screen

**Given** The job is queued
**When** The progress screen is displayed
**Then** A progress bar is shown at 0%
**And** The status message displays "Queued - waiting to start..."
**And** The WebSocket connection is established
**And** The frontend subscribes to progress events for this job

**Given** The worker starts processing my job
**When** Progress events are received via WebSocket
**Then** The progress bar updates to the current percentage (e.g., 25%, 50%, 75%)
**And** The status message updates with the current activity (e.g., "Analyzing documents...")
**And** The UI feels responsive and shows I'm making progress

**Given** The processing completes successfully
**When** The "processing:complete" event is received
**Then** The progress bar reaches 100%
**And** The status message displays "Complete! Loading your literature review..."
**And** The frontend fetches the literature review via GET `/api/v1/literature-reviews/{reviewId}`
**And** The user is redirected to the literature review display page

**Given** The processing fails
**When** The "processing:error" event is received
**Then** The progress modal shows an error state
**And** The error message is displayed: "Processing failed: [error message]"
**And** A "Try Again" button allows restarting the process
**And** A "Close" button dismisses the modal

### Story 3.7: Literature Review Display and Editing

As a working professional,
I want to view the generated literature review with inline citations and edit the content,
So that I can refine the draft and customize it for my academic paper.

**Acceptance Criteria:**

**Given** A literature review has been generated
**When** I navigate to `/literature-review/{reviewId}`
**Then** A GET request is made to `/api/v1/literature-reviews/{reviewId}`
**And** The API verifies the review belongs to the authenticated user
**And** The review content is displayed in a clean, readable format
**And** The title is displayed at the top (e.g., "Literature Review - [Date]")

**Given** The content has inline citations
**When** The review is rendered
**Then** Each citation appears as a superscript number or clickable marker (e.g., [1], [2])
**And** Hovering over a citation shows a tooltip with: document name, page number
**And** The citation is visually distinct (e.g., colored, underlined)

**Given** I want to edit the generated text
**When** I click an "Edit" button
**Then** The content becomes editable in a rich text editor or textarea
**And** I can modify any part of the text
**And** Citations remain linked even if I edit surrounding text
**And** A "Save" button saves my changes

**Given** I save my edits
**When** I click "Save"
**Then** A PUT request is sent to `/api/v1/literature-reviews/{reviewId}` with updated content
**And** The updated_at timestamp is refreshed
**And** The changes are persisted to the database
**And** A success message appears: "Changes saved"
**And** The editor exits edit mode and displays the updated content

**Given** Another user tries to access my review
**When** They navigate to my review URL
**Then** The API returns 403 status with error "You do not have permission to view this review"
**And** No content is displayed

### Story 3.8: Methodology Progress Tracker

As a working professional,
I want to see where I am in the research methodology stages and what comes next,
So that I know I'm following the right process and don't miss critical steps.

**Acceptance Criteria:**

**Given** I am viewing my literature review
**When** The page loads
**Then** A "Methodology Progress" section is displayed prominently
**And** The progress tracker shows predefined research stages:
  1. Literature Search (gathering papers)
  2. Literature Review (synthesis and analysis) ← Current stage
  3. Research Design
  4. Data Collection
  5. Data Analysis
  6. Writing & Reporting
**And** The current stage is visually highlighted (bold, colored, "You are here" indicator)

**Given** I am on the "Literature Review" stage
**When** The progress tracker is displayed
**Then** The "Next Steps" section shows predefined guidance:
  - "Review and refine your synthesis"
  - "Verify citations by clicking to open source PDFs"
  - "Identify gaps and research questions for your study"
  - "Move to Research Design when literature review is complete"
**And** The next steps are static text (no dynamic AI suggestions for MVP)

**Given** I complete the literature review
**When** I mark the stage as complete (future feature - for now just display)
**Then** The tracker remains visible showing my progress
**And** The user understands where they are in the overall process

### Story 3.9: Error Handling and Partial Results

As a working professional,
I want the system to handle errors gracefully and show me partial results when possible,
So that one problematic PDF doesn't prevent me from processing the rest of my documents.

**Acceptance Criteria:**

**Given** I select 5 documents for processing, and 1 is a scanned PDF
**When** The processing job runs
**Then** The worker detects the scanned PDF (text_extracted = false) before AI processing
**And** A warning is logged: "Skipping document [name] - no text extracted (scanned PDF)"
**And** The other 4 documents proceed to AI processing
**And** The literature review is generated from the 4 successful documents
**And** The processing job completes with status "completed"

**Given** Processing completed with warnings
**When** I view the result
**Then** A notice is displayed: "Literature review generated from 4 of 5 documents"
**And** The skipped document is listed with reason: "[filename] - Scanned PDF, text extraction not available"
**And** A suggestion is provided: "Consider re-scanning with OCR or finding a text-based version"
**And** The partial literature review is fully usable

**Given** All selected documents are scanned PDFs
**When** The processing job runs
**Then** The worker detects no valid documents for processing
**And** The job fails with status "failed"
**And** The error message explains: "No documents with extracted text available. Please upload text-based PDFs."
**And** No literature review is created

**Given** 1 of 5 documents causes an AI processing error
**When** The error occurs during synthesis
**Then** The error is caught and logged with document ID
**And** The other 4 documents continue processing
**And** The literature review is generated from the successful documents
**And** The error is noted in the job's error_message field
**And** The user sees: "Literature review generated from 4 of 5 documents. 1 document could not be processed."

**Given** The entire AI service is down
**When** The processing attempts to call Claude API
**Then** The error is caught after retries (BullMQ retry logic with exponential backoff)
**And** The job status is set to "failed"
**And** The error message is clear: "AI service unavailable. Please try again later."
**And** The user is notified via the progress modal
**And** The job can be manually retried from the UI

## Epic 4: Citation Verification & PDF Viewer

Users can verify any AI-generated citation by clicking to open the source PDF at the exact page in a side panel.

### Story 4.1: PDF File Serving with Authorization

As a developer,
I want to create a secure endpoint for serving PDF files,
So that users can view their documents while ensuring proper access control.

**Acceptance Criteria:**

**Given** A PDF document exists in the filesystem
**When** I create the file serving endpoint
**Then** A GET endpoint is created at `/api/v1/documents/{documentId}/file`
**And** The endpoint requires authentication (JWT validation)
**And** The endpoint verifies the document belongs to the authenticated user
**And** If authorized, the PDF file is read from `/uploads/{userId}/{documentId}.pdf`
**And** The response sets Content-Type header to `application/pdf`
**And** The response sets Content-Disposition header to `inline; filename="[original-filename].pdf"`
**And** CORS headers are configured to allow the frontend domain

**Given** I am authenticated and own the document
**When** I request `/api/v1/documents/{documentId}/file`
**Then** The API returns 200 status with the PDF binary data
**And** The browser can render the PDF inline

**Given** I try to access another user's document
**When** I request a document I don't own
**Then** The API returns 403 status with error "You do not have permission to view this document"
**And** No file is served

**Given** I am not authenticated
**When** I request a document file
**Then** The API returns 401 status with error "Authentication required"
**And** No file is served

**Given** The document ID doesn't exist in the database
**When** I request the file
**Then** The API returns 404 status with error "Document not found"

**Given** The file exists in database but not on filesystem
**When** I request the file
**Then** The API returns 500 status with error "File not found on server"
**And** The error is logged for investigation

### Story 4.2: PDF Viewer Component

As a working professional,
I want to view my PDF documents in a side panel,
So that I can read the source material while reviewing my literature synthesis.

**Acceptance Criteria:**

**Given** I am viewing my literature review
**When** The page loads
**Then** A collapsible side panel is available (initially hidden or collapsed)
**And** The main content area adjusts when the panel opens (split-view layout)
**And** On desktop (1024px+), the split is approximately 60/40 (content/viewer)

**Given** I open the PDF viewer panel
**When** A PDF document is selected
**Then** The react-pdf library is used to render the PDF
**And** The PDF loads in the side panel
**And** A loading spinner is displayed while the PDF loads
**And** The first page is displayed by default

**Given** The PDF has multiple pages
**When** The PDF is rendered
**Then** The current page number is displayed (e.g., "Page 3 of 24")
**And** The total page count is shown
**And** The page renders clearly and is readable

**Given** The PDF fails to load
**When** The loading error occurs
**Then** An error message is displayed: "Unable to load PDF. Please try again."
**And** A retry button is available
**And** The error is logged with document ID

**Given** The side panel is open
**When** The viewport is resized
**Then** The PDF viewer adjusts responsively
**And** The layout remains usable on tablet (768-1023px) with basic support
**And** On mobile (<768px), the panel may overlap or stack (minimal support)

### Story 4.3: Click-to-Verify Citation Navigation

As a working professional,
I want to click a citation in my literature review and immediately see the source PDF at the exact page,
So that I can verify the AI's claims and ensure academic accuracy.

**Acceptance Criteria:**

**Given** My literature review contains citations
**When** A citation is rendered
**Then** The citation appears as a clickable element (superscript number or inline marker)
**And** The citation has visual affordance indicating it's clickable (color, underline, cursor pointer)

**Given** I click on a citation
**When** The citation is clicked
**Then** The citation data is retrieved (sourceDocumentId, pageNumber)
**And** The PDF viewer side panel opens (if not already open)
**And** A request is made to `/api/v1/documents/{sourceDocumentId}/file`
**And** The PDF loads in the viewer
**And** The viewer automatically navigates to the specified page number
**And** The page is displayed immediately without requiring manual navigation

**Given** The citation has a specific page number (e.g., page 12)
**When** The PDF loads
**Then** The viewer jumps directly to page 12
**And** Page 12 is rendered and visible
**And** The page indicator shows "Page 12 of 24"
**And** I can immediately read the content on that page

**Given** The citation has no page number (null)
**When** I click the citation
**Then** The PDF loads at page 1
**And** A message is displayed: "Page number not available - showing from beginning"
**And** I can manually navigate to find the content

**Given** I click multiple different citations
**When** Each citation is clicked
**Then** The viewer switches to the correct document and page for each citation
**And** The transition is smooth and fast
**And** Previous document is replaced by the new document

**Given** The PDF document is not available
**When** I click a citation referencing a missing document
**Then** An error message appears: "Source document not found"
**And** The viewer shows an error state
**And** Other citations remain functional

### Story 4.4: PDF Viewer Controls and Navigation

As a working professional,
I want to navigate through pages, scroll, and close the PDF viewer,
So that I can explore the source document and verify multiple claims efficiently.

**Acceptance Criteria:**

**Given** A PDF is loaded in the viewer
**When** The viewer is displayed
**Then** Navigation controls are visible: "Previous Page" button, page number input, "Next Page" button
**And** A "Close" button (X icon) is visible in the panel header
**And** The controls are positioned clearly (top of panel or overlay on PDF)

**Given** I click the "Next Page" button
**When** I am on page 5 of 24
**Then** The viewer navigates to page 6
**And** The page indicator updates to "Page 6 of 24"
**And** The next page renders smoothly

**Given** I click the "Previous Page" button
**When** I am on page 6
**Then** The viewer navigates to page 5
**And** The page indicator updates accordingly

**Given** I am on the first page
**When** I click "Previous Page"
**Then** The button is disabled or the action does nothing
**And** I remain on page 1

**Given** I am on the last page
**When** I click "Next Page"
**Then** The button is disabled or the action does nothing
**And** I remain on the last page

**Given** I type a page number in the input field
**When** I enter "15" and press Enter
**Then** The viewer navigates to page 15
**And** Page 15 is rendered
**And** The page indicator updates to "Page 15 of 24"

**Given** I enter an invalid page number (e.g., 0, 99, "abc")
**When** I attempt to navigate
**Then** An error message appears: "Invalid page number"
**And** The viewer remains on the current page
**And** The input field is cleared or reset

**Given** I want to scroll through the PDF
**When** I use the mouse scroll wheel or trackpad
**Then** The PDF content scrolls vertically within the panel
**And** Long pages can be fully read by scrolling
**And** The scroll behavior is smooth and natural

**Given** I want to close the PDF viewer
**When** I click the "Close" button (X icon)
**Then** The side panel closes or collapses
**And** The main content area expands to full width
**And** The literature review remains visible and usable
**And** The PDF state is cleared (ready for next citation click)

**Given** I want to adjust the PDF view (optional for MVP)
**When** Zoom controls are available
**Then** I can zoom in/out to adjust text size
**And** The zoom level persists while navigating pages
**And** A reset button returns to default zoom
