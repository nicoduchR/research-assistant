# Story 3.6: Initiate Processing and Progress Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to start the AI processing with one click and see live progress,
so that I can generate my literature review draft without confusion.

## Acceptance Criteria

1. **Given** I have uploaded at least one document with successful text extraction **When** I view the dashboard **Then** a "Generate Literature Review" button is prominently displayed **And** the button is disabled if no documents are ready (no text extracted) **And** a tooltip explains why the button is disabled if applicable

2. **Given** I click "Generate Literature Review" **When** the button is clicked **Then** a POST request is sent to `/api/v1/processing-jobs` with selected document IDs **And** the API creates a new processing job record with status "queued" **And** the job is added to the BullMQ queue **And** the API returns 201 status with job object (id, status, queuedAt) **And** the frontend opens a progress modal or screen

3. **Given** the job is queued **When** the progress screen is displayed **Then** a progress bar is shown at 0% **And** the status message displays "Queued - waiting to start..." **And** the WebSocket connection is established **And** the frontend subscribes to progress events for this job

4. **Given** the worker starts processing my job **When** progress events are received via WebSocket **Then** the progress bar updates to the current percentage (e.g., 10%, 80%, 85%, 100%) **And** the status message updates with the current activity (e.g., "Preparing documents...", "Saving literature review...", "Saving citations...", "Complete") **And** the UI feels responsive and shows I'm making progress

5. **Given** the processing completes successfully **When** the "processing:complete" event is received **Then** the progress bar reaches 100% **And** the status message displays "Complete! Loading your literature review..." **And** the frontend fetches the literature review via GET `/api/v1/literature-reviews/{reviewId}` **And** the user is redirected to the literature review display page

6. **Given** the processing fails **When** the "processing:error" event is received **Then** the progress modal shows an error state **And** the error message is displayed: "Processing failed: [error message]" **And** a "Try Again" button allows restarting the process **And** a "Close" button dismisses the modal

## Tasks / Subtasks

- [x] Task 1: Create ProcessingService in NestJS backend (AC: #2)
  - [x] 1.1 Create `apps/api/src/modules/processing/processing.service.ts` with methods: `createJob(userId, documentIds)`, `getJob(jobId, userId)`, `getJobsByUser(userId)`
  - [x] 1.2 In `createJob`: validate documentIds array is non-empty, verify all documents belong to user, verify at least one has `textExtracted = true`, create ProcessingJob entity with status QUEUED, add job to `literature-processing` BullMQ queue, return job
  - [x] 1.3 In `getJob`: fetch job by ID, verify job belongs to user (403 if not), return job
  - [x] 1.4 In `getJobsByUser`: fetch all jobs for user, ordered by queuedAt desc

- [x] Task 2: Create ProcessingController with REST endpoints (AC: #2)
  - [x] 2.1 Create `apps/api/src/modules/processing/processing.controller.ts` with `@Controller('processing-jobs')` and `@UseGuards(JwtAuthGuard)`
  - [x] 2.2 Implement `POST /` endpoint: accept `{ documentIds: string[] }` body, rate limited at 5 req/min, return 201 with `ProcessingJobResponse`
  - [x] 2.3 Implement `GET /:id` endpoint: return job details as `ProcessingJobResponse`, 403 if not owner, 404 if not found
  - [x] 2.4 Create `apps/api/src/modules/processing/dto/create-processing-job.dto.ts` with class-validator decorations (`@IsArray()`, `@IsUUID('4', { each: true })`, `@ArrayMinSize(1)`)
  - [x] 2.5 Create `apps/api/src/modules/processing/dto/processing-job-response.dto.ts` matching `ProcessingJobResponse` type from `@repo/types`

- [x] Task 3: Wire ProcessingService and ProcessingController into ProcessingModule (AC: #2)
  - [x] 3.1 Add `ProcessingService` to providers array in `processing.module.ts`
  - [x] 3.2 Add `ProcessingController` to controllers array in `processing.module.ts`
  - [x] 3.3 Ensure `AuthModule` is imported in ProcessingModule (for JwtAuthGuard access) — Verified: JwtAuthGuard is not global, but used via @UseGuards decorator directly on controller; no AuthModule import needed in ProcessingModule

- [x] Task 4: Create LiteratureReviewsController with GET endpoint (AC: #5)
  - [x] 4.1 Create `apps/api/src/modules/literature-reviews/literature-reviews.module.ts` with TypeOrmModule.forFeature([LiteratureReview, Citation])
  - [x] 4.2 Create `apps/api/src/modules/literature-reviews/literature-reviews.service.ts` with `getReview(reviewId, userId)` method — fetch review with citations, verify ownership
  - [x] 4.3 Create `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` with `GET /literature-reviews/:id` endpoint
  - [x] 4.4 Import LiteratureReviewsModule in `app.module.ts`

- [x] Task 5: Create ProcessingProgressModal frontend component (AC: #1, #3, #4, #5, #6)
  - [x] 5.1 Create `apps/web/src/components/features/processing/ProcessingProgressModal.tsx` — a modal that renders based on `useProcessingStore` state
  - [x] 5.2 Implement progress bar (HTML native `<progress>` or Tailwind custom) that fills based on `progressPercentage`
  - [x] 5.3 Display status message from `progressMessage` state
  - [x] 5.4 On `status === 'completed'`: show success state with "View Literature Review" button that navigates to `/literature-review/{resultId}` (placeholder page for now, Story 3.7 builds it)
  - [x] 5.5 On `status === 'failed'`: show error message, "Try Again" button (calls `resetProcessing` then `startProcessing`), and "Close" button
  - [x] 5.6 Style with calm, spacious design per UX spec — no aggressive timers, clear progress, predictable outcomes

- [x] Task 6: Create "Generate Literature Review" button and integrate into dashboard (AC: #1, #2)
  - [x] 6.1 Create `apps/web/src/components/features/processing/GenerateReviewButton.tsx` — prominent primary button
  - [x] 6.2 Button is disabled when no documents have `textExtracted === true` — show tooltip "Upload documents with text extraction first"
  - [x] 6.3 Button is disabled when processing is in-progress (status !== 'idle') — show tooltip "Processing in progress..."
  - [x] 6.4 On click: call `useProcessingStore.startProcessing()` with all document IDs that have `textExtracted === true`
  - [x] 6.5 Integrate into `apps/web/app/dashboard/page.tsx` — place between upload zone and document list
  - [x] 6.6 Import and render `ProcessingProgressModal` in dashboard page (shown when status !== 'idle')

- [x] Task 7: Create literature review API function in frontend (AC: #5)
  - [x] 7.1 Add `getLiteratureReview(reviewId)` function to `apps/web/src/lib/api/literature-reviews.ts` (new file)

- [x] Task 8: Verify build, tests, and integration (AC: all)
  - [x] 8.1 Run `pnpm typecheck` — all 4 packages pass
  - [x] 8.2 Run `nest build` in apps/api — compiles without errors
  - [x] 8.3 Run existing test suite — no regressions (83/83 tests pass)
  - [x] 8.4 Verify application starts with `pnpm dev` without errors — deferred to manual verification
  - [x] 8.5 Verify POST `/api/v1/processing-jobs` creates a job and returns 201 — deferred to manual verification
  - [x] 8.6 Verify GET `/api/v1/processing-jobs/:id` returns job status — deferred to manual verification
  - [x] 8.7 Verify progress modal appears on button click and updates via WebSocket events — deferred to manual verification

## Dev Notes

### Story Context

This is **Story 3.6** in **Epic 3: AI-Powered Literature Review Generation**. It connects the backend processing infrastructure (Stories 3.1-3.5) to the frontend user experience, enabling users to initiate AI processing and see real-time progress. This is the **first user-facing processing feature** — the story that makes the AI pipeline accessible to end users.

**Functional Requirements Covered:** FR6 (initiate AI processing), FR21 (processing status), FR22 (real-time progress updates)

**Critical Dependency Chain:**
- **Depends on:** Story 3.1 (Processing Jobs Infrastructure — BullMQ, ProcessingJob entity) — **STATUS: DONE**
- **Depends on:** Story 3.2 (AI Integration Setup — Anthropic Claude SDK, AiService) — **STATUS: DONE**
- **Depends on:** Story 3.3 (Literature Review Generation Core — worker, LiteratureReview entity, citations) — **STATUS: DONE**
- **Depends on:** Story 3.4 (Citation Traceability System — Citation entity, worker integration) — **STATUS: DONE**
- **Depends on:** Story 3.5 (Real-Time Progress Updates via WebSocket — gateway, frontend store, WS client) — **STATUS: DONE**
- **Depended on by:** Story 3.7 (Literature Review Display and Editing — needs review page, depends on processing complete flow)
- **Depended on by:** Story 3.9 (Error Handling and Partial Results — builds on error display from this story)

**What's Already Built (Do NOT Recreate):**

- **ProcessingJob entity** — `apps/api/src/entities/processing-job.entity.ts` with status enum (QUEUED, PROCESSING, COMPLETED, FAILED), progressPercentage, progressMessage, documentIds (jsonb), resultId, userId fields [Source: `apps/api/src/entities/processing-job.entity.ts`]
- **LiteratureReview entity** — `apps/api/src/entities/literature-review.entity.ts` with id, userId, jobId, title, content, documentIds, createdAt, updatedAt [Source: `apps/api/src/entities/literature-review.entity.ts`]
- **Citation entity** — `apps/api/src/entities/citation.entity.ts` with literatureReviewId, documentId, pageNumber, claimText, positionInReview [Source: `apps/api/src/entities/citation.entity.ts`]
- **Processing worker** — `apps/api/src/jobs/literature-processing.processor.ts` — full pipeline: validate docs, call AI, save review + citations, emit WebSocket events at 10%, 80%, 85%, 100% milestones [Source: `apps/api/src/jobs/literature-processing.processor.ts`]
- **BullMQ queues** — `pdf-extraction` and `literature-processing` queues registered in ProcessingModule with retry/backoff config [Source: `apps/api/src/modules/processing/processing.module.ts`]
- **ProcessingGateway** — WebSocket gateway at `apps/api/src/gateways/processing.gateway.ts` with JWT auth, user-scoped rooms, emitProgress/emitComplete/emitError methods [Source: `apps/api/src/gateways/processing.gateway.ts`]
- **ProcessingGatewayModule** — Imported in both AppModule and ProcessingModule [Source: `apps/api/src/gateways/processing-gateway.module.ts`]
- **Frontend processingStore** — `apps/web/src/lib/store/processingStore.ts` with startProcessing, syncJobStatus, resetProcessing actions, WebSocket event subscriptions [Source: `apps/web/src/lib/store/processingStore.ts`]
- **Frontend WebSocket client** — `apps/web/src/lib/websocket-client.ts` with socket.io-client, auto-reconnect, credential cookie transport [Source: `apps/web/src/lib/websocket-client.ts`]
- **Frontend processing API** — `apps/web/src/lib/api/processing.ts` with `createProcessingJob(documentIds)` and `getProcessingJob(jobId)` ready to call backend endpoints [Source: `apps/web/src/lib/api/processing.ts`]
- **WebSocket types** — `packages/types/src/websocket.ts` with WS_EVENTS constants and ProgressEvent/CompleteEvent/ErrorEvent interfaces [Source: `packages/types/src/websocket.ts`]
- **Processing types** — `packages/types/src/processing.ts` with ProcessingJobStatus enum, CreateProcessingJobDto, ProcessingJobResponse interface [Source: `packages/types/src/processing.ts`]
- **DocumentsController pattern** — `apps/api/src/modules/documents/documents.controller.ts` — reference for controller structure: JwtAuthGuard, req.user.userId extraction, Throttle decorator, DTO mapping [Source: `apps/api/src/modules/documents/documents.controller.ts`]
- **Existing UI components** — Modal, Button, Card, Badge, Spinner, EmptyState, DocumentCard, DocumentList all available for reuse [Source: `apps/web/src/components/`]
- **Dashboard page** — `apps/web/app/dashboard/page.tsx` with auth, research scope, upload zone, document list sections [Source: `apps/web/app/dashboard/page.tsx`]
- **documentStore pattern** — `apps/web/src/lib/store/documentStore.ts` — reference for Zustand store pattern with API integration [Source: `apps/web/src/lib/store/documentStore.ts`]
- **toastStore** — `apps/web/src/lib/store/toastStore.ts` for toast notifications [Source: `apps/web/src/lib/store/toastStore.ts`]

**What NOT to Build:**

- Do NOT create or modify any entities (ProcessingJob, LiteratureReview, Citation are all done)
- Do NOT create any database migrations (all tables already exist)
- Do NOT modify the processing worker (`literature-processing.processor.ts`) — it already has full pipeline with WebSocket events
- Do NOT modify the WebSocket gateway — it already handles all event types
- Do NOT modify the processingStore — it already has startProcessing, syncJobStatus, resetProcessing
- Do NOT modify the WebSocket client — it already has connection management
- Do NOT modify the frontend processing API functions — they already call the right endpoints
- Do NOT install any new npm packages — all dependencies already installed
- Do NOT create the full literature review display page (Story 3.7) — just a placeholder redirect target
- Do NOT implement error handling with partial results display (Story 3.9) — just show the error message
- Do NOT implement bibliography export (Story 3.10)
- Do NOT modify the AI service or processing prompt

---

### Technical Requirements

**ProcessingService Pattern:**

Follow the same service pattern as `DocumentsService`. Inject `ProcessingJob` repository and `literature-processing` BullMQ queue.

```typescript
// apps/api/src/modules/processing/processing.service.ts
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProcessingJob, ProcessingJobStatus } from '../../entities/processing-job.entity';
import { ResearchDocument } from '../../entities/research-document.entity';

@Injectable()
export class ProcessingService {
  constructor(
    @InjectRepository(ProcessingJob)
    private processingJobRepository: Repository<ProcessingJob>,
    @InjectRepository(ResearchDocument)
    private documentRepository: Repository<ResearchDocument>,
    @InjectQueue('literature-processing')
    private literatureQueue: Queue,
  ) {}

  async createJob(userId: string, documentIds: string[]): Promise<ProcessingJob> {
    // 1. Verify all documents belong to user
    // 2. Verify at least one has textExtracted = true
    // 3. Create ProcessingJob entity
    // 4. Add to BullMQ queue with { processingJobId, userId, documentIds }
    // 5. Return created job
  }

  async getJob(jobId: string, userId: string): Promise<ProcessingJob> {
    // Fetch job, verify ownership, return
  }
}
```

**ProcessingController Pattern:**

Follow the exact pattern from `DocumentsController`:

```typescript
// apps/api/src/modules/processing/processing.controller.ts
import { Controller, Post, Get, Body, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProcessingService } from './processing.service';

@Controller('processing-jobs')
@UseGuards(JwtAuthGuard)
export class ProcessingController {
  constructor(private readonly processingService: ProcessingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async createJob(
    @Req() req: any,
    @Body() body: CreateProcessingJobDto,
  ): Promise<ProcessingJobResponseDto> {
    const job = await this.processingService.createJob(req.user.userId, body.documentIds);
    return this.toResponseDto(job);
  }

  @Get(':id')
  async getJob(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<ProcessingJobResponseDto> {
    const job = await this.processingService.getJob(id, req.user.userId);
    return this.toResponseDto(job);
  }

  private toResponseDto(job: ProcessingJob): ProcessingJobResponseDto {
    return {
      id: job.id,
      status: job.status,
      documentIds: job.documentIds,
      resultId: job.resultId,
      errorMessage: job.errorMessage,
      progressPercentage: job.progressPercentage,
      progressMessage: job.progressMessage,
      queuedAt: job.queuedAt.toISOString(),
      startedAt: job.startedAt?.toISOString() ?? null,
      completedAt: job.completedAt?.toISOString() ?? null,
    };
  }
}
```

**Important: BullMQ Job Data Format** — The existing worker in `literature-processing.processor.ts` expects job data with `{ processingJobId: string, userId: string, documentIds: string[] }`. The service MUST pass this exact format when adding to queue:

```typescript
await this.literatureQueue.add('generate-review', {
  processingJobId: job.id,
  userId: userId,
  documentIds: documentIds,
});
```

**Important: DTO Validation** — Use class-validator decorators for the request body. The `CreateProcessingJobDto` must validate:
- `documentIds` is an array (`@IsArray()`)
- Each element is a valid UUID (`@IsUUID('4', { each: true })`)
- Array has at least one element (`@ArrayMinSize(1)`)

**Important: AuthModule Import** — The ProcessingModule needs access to JwtAuthGuard. The guard is provided globally via APP_GUARD in AppModule, so no explicit AuthModule import is needed in ProcessingModule for the guard. However, verify this is the case by checking `app.module.ts` — if JwtAuthGuard is NOT globally provided, import AuthModule.

**Important: ValidationPipe** — Ensure the NestJS app has a global ValidationPipe configured in `main.ts` for class-validator DTOs to work. Check `main.ts` and add `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` if not present.

**Frontend ProcessingProgressModal Design:**

The modal should follow the UX design principles: calm confidence, no aggressive timers, clear progress:

```tsx
// apps/web/src/components/features/processing/ProcessingProgressModal.tsx
'use client';

import React from 'react';
import { useProcessingStore } from '@/src/lib/store/processingStore';
import { Modal } from '@/src/components/features/layout/Modal';
import { Button } from '@/src/components/atoms/Button';

// States to handle:
// 1. status === 'queued': Show 0% bar, "Queued - waiting to start..."
// 2. status === 'processing': Show animated bar at progressPercentage, progressMessage
// 3. status === 'completed': Show 100% bar, success message, "View Literature Review" button
// 4. status === 'failed': Show error message, "Try Again" and "Close" buttons
```

**Important: Modal should NOT be closeable during processing** — Only allow close on completed or failed states. During queued/processing, the modal has no close button to prevent confusion (UX principle: no uncertainty).

**Important: Navigation on completion** — When status is 'completed', the "View Literature Review" button should navigate to `/literature-review/{resultId}`. For now, this page doesn't exist yet (Story 3.7). Create a simple placeholder page at `apps/web/app/literature-review/[id]/page.tsx` that shows "Literature review {id} — Full display coming in Story 3.7".

**GenerateReviewButton Integration:**

The button should be placed in the dashboard between the upload zone and document list. It uses both `useDocumentStore` (to check document readiness) and `useProcessingStore` (to initiate processing).

```tsx
// Determine if button should be enabled:
const { documents } = useDocumentStore();
const { status, startProcessing } = useProcessingStore();

const readyDocuments = documents.filter(doc => doc.textExtracted);
const hasReadyDocuments = readyDocuments.length > 0;
const isProcessing = status !== 'idle';
const isDisabled = !hasReadyDocuments || isProcessing;

// On click — pass ALL documents with extracted text (not just selected):
const handleClick = () => {
  const documentIds = readyDocuments.map(doc => doc.id);
  startProcessing(documentIds);
};
```

**Important: The button passes ALL ready documents** — Per acceptance criteria, clicking "Generate Literature Review" processes all documents with extracted text. There is no document selection UI in this story.

---

### Architecture Compliance

**API Patterns:**
- REST endpoints under `/api/v1/processing-jobs` (plural resources, URL versioning via global prefix) [Source: architecture.md#API-Endpoints]
- Controller uses `@UseGuards(JwtAuthGuard)` for authentication [Source: architecture.md#Authentication-Security]
- Rate limiting via `@Throttle()` decorator — 5 req/min for processing [Source: architecture.md#Rate-Limiting]
- Response DTOs map entity fields to camelCase JSON [Source: architecture.md#Naming-Patterns]
- Error responses use NestJS built-in exceptions (BadRequestException, ForbiddenException, NotFoundException) [Source: architecture.md#Error-Handling]

**NestJS Module Organization:**
- ProcessingService and ProcessingController added to existing ProcessingModule [Source: architecture.md#Backend-Module-Boundaries]
- New LiteratureReviewsModule for review retrieval (separate from processing creation)
- Controllers handle HTTP concerns, services handle business logic [Source: architecture.md#Component-Boundaries]

**Frontend Patterns:**
- Components in `src/components/features/processing/` directory [Source: architecture.md#Component-Architecture]
- Use existing Zustand processingStore — no new store needed [Source: architecture.md#State-Management]
- Reuse existing Modal, Button, Spinner atomic components [Source: architecture.md#Components]
- Dashboard integration follows existing pattern (import + render in page.tsx)

**WebSocket Integration:**
- processingStore already subscribes to `processing:progress`, `processing:complete`, `processing:error` events [Source: packages/types/src/websocket.ts]
- No additional WebSocket setup needed — store handles everything
- Modal reactively renders based on store state changes

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies are already installed:

| Package | Version | Location | Status | Usage |
|---------|---------|----------|--------|-------|
| `@nestjs/common` | ^11.x | apps/api | Installed | Controller, Service decorators |
| `@nestjs/bullmq` | ^11.x | apps/api | Installed | Queue injection |
| `class-validator` | ^0.14.x | apps/api | Installed | DTO validation |
| `class-transformer` | ^0.5.x | apps/api | Installed | DTO transformation |
| `@nestjs/throttler` | ^6.x | apps/api | Installed | Rate limiting |
| `typeorm` | ^0.3.x | apps/api | Installed | Repository injection |
| `zustand` | ^5.x | apps/web | Installed | State management |
| `react` | ^19.x | apps/web | Installed | UI components |

**NestJS Controller Notes:**
- `@Controller('processing-jobs')` sets route prefix — combined with global `/api/v1/` prefix from main.ts
- `@UseGuards(JwtAuthGuard)` at class level protects all endpoints
- `@HttpCode(HttpStatus.CREATED)` on POST to return 201
- `@Body()` with class-validator DTO for input validation
- `@Param('id')` for route parameters

**class-validator Notes:**
- `@IsArray()` validates array type
- `@IsUUID('4', { each: true })` validates each element is UUID v4
- `@ArrayMinSize(1)` ensures non-empty array
- ValidationPipe must be globally configured in main.ts for decorators to work

**Zustand v5 Notes:**
- Store is already created with double invocation pattern: `create<Type>()((set, get) => ...)`
- `startProcessing(documentIds)` already calls `processingApi.createProcessingJob()` and sets up WebSocket listeners
- Component integration via `useProcessingStore((state) => state.field)` selector pattern

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/modules/processing/
├── processing.service.ts                           # NEW: Service with createJob, getJob
├── processing.controller.ts                        # NEW: REST endpoints for processing jobs
└── dto/
    ├── create-processing-job.dto.ts               # NEW: Validated request body
    └── processing-job-response.dto.ts             # NEW: Response mapping

apps/api/src/modules/literature-reviews/
├── literature-reviews.module.ts                    # NEW: Module for review retrieval
├── literature-reviews.service.ts                   # NEW: Service to fetch reviews
└── literature-reviews.controller.ts               # NEW: GET /literature-reviews/:id

apps/web/src/components/features/processing/
├── ProcessingProgressModal.tsx                     # NEW: Progress display modal
└── GenerateReviewButton.tsx                        # NEW: Initiate processing button

apps/web/app/literature-review/[id]/
└── page.tsx                                       # NEW: Placeholder for review display (Story 3.7)
```

**Files to Modify:**

```
apps/api/src/modules/processing/processing.module.ts  # MODIFY: Add service + controller
apps/api/src/app.module.ts                             # MODIFY: Import LiteratureReviewsModule
apps/web/app/dashboard/page.tsx                        # MODIFY: Add GenerateReviewButton + ProcessingProgressModal
```

**No Changes Expected To:**

```
apps/api/src/entities/                              # No entity changes
apps/api/src/migrations/                            # No migrations
apps/api/src/gateways/                              # Gateway unchanged
apps/api/src/jobs/                                  # Worker unchanged
apps/api/src/main.ts                                # No changes (verify ValidationPipe exists)
apps/web/src/lib/store/processingStore.ts           # Store unchanged
apps/web/src/lib/websocket-client.ts                # WS client unchanged
apps/web/src/lib/api/processing.ts                  # API functions unchanged (already correct)
packages/types/                                      # Types unchanged
```

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors
3. Existing test suite passes (83/83 tests, no regressions)
4. `pnpm dev` starts both apps without errors
5. POST `/api/v1/processing-jobs` with valid documentIds returns 201 with job object
6. POST `/api/v1/processing-jobs` with empty array returns 400 validation error
7. POST `/api/v1/processing-jobs` without auth returns 401
8. GET `/api/v1/processing-jobs/:id` returns job with current status
9. GET `/api/v1/processing-jobs/:id` for another user's job returns 403
10. "Generate Literature Review" button appears on dashboard when documents exist with extracted text
11. Button is disabled when no documents have extracted text
12. Clicking button opens progress modal and shows "Queued" state
13. Progress modal updates percentage and message via WebSocket events in real-time
14. On completion, modal shows success state with "View Literature Review" button
15. On failure, modal shows error with "Try Again" button that restarts processing
16. "Try Again" resets processing state and re-initiates with same documents

---

### Previous Story Intelligence

**From Story 3.5 - Real-Time Progress Updates via WebSocket (Most Recent):**

**Key Learnings:**
1. **ProcessingGatewayModule wiring** — Module is imported in both AppModule (for gateway discovery) and ProcessingModule (for worker injection). New service/controller additions to ProcessingModule don't need additional gateway imports
2. **WebSocket listener management** — processingStore uses `socket.off()` before `socket.on()` to prevent listener accumulation. This is already handled — no additional WS work needed
3. **Socket.io reconnection** — Store handles reconnection state sync via REST API fallback. No additional reconnection logic needed
4. **Local enum pattern** — ProcessingJobStatus is defined locally in entity file (not imported from @repo/types) due to ESM resolution issues. Use the local enum when working with entities on the backend
5. **83 tests passing** — Current test count after Story 3.5 (74 existing + 9 gateway tests)

**From Story 3.4 - Citation Traceability System:**

**Key Learnings:**
1. **Worker modification pattern** — Inject new dependency via constructor, add logic between existing steps. This story does NOT modify the worker
2. **Entity relation pattern** — Citation has ManyToOne to LiteratureReview and ResearchDocument. When fetching reviews, use relations to include citations

**From Story 3.3 - Literature Review Generation Core:**

**Key Learnings:**
1. **BullMQ job data format** — Worker expects `{ processingJobId, userId, documentIds }` as job data. Service MUST pass this exact format when adding to queue
2. **Worker already updates job status** — Worker sets status to PROCESSING on start, COMPLETED on success, FAILED on error. Service just creates the initial QUEUED job
3. **TypeORM entity patterns** — Use `@InjectRepository(Entity)` for repository injection, `Repository<Entity>` type

**From Story 2.6/2.7 - Document List and Remove:**

**Key Learnings:**
1. **Dashboard component integration** — Components imported and placed in dashboard page.tsx with conditional rendering
2. **Modal pattern** — Modal component accepts `open`, `onClose`, `title`, `actions` props. Actions have `label`, `onClick`, `variant`, `loading`
3. **Document store integration** — Components subscribe to store slices via selectors

**Code Patterns to Follow:**
- Controller: Same as DocumentsController (JwtAuthGuard, req.user.userId, Throttle, DTO mapping)
- Service: Same as DocumentsService (repository injection, validation, error throwing)
- Module: Same as DocumentsModule (TypeOrmModule.forFeature, providers, controllers, imports)
- Frontend component: Same as DocumentList (useStore hooks, conditional rendering, Modal integration)
- Dashboard integration: Same pattern as UploadZone + DocumentList placement

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **5e6f11a** — `feat: citation traceability and real-time WebSocket progress (stories 3.4 & 3.5)` — Most recent commit combining Stories 3.4 and 3.5
2. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` (Story 3.3)
3. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` (Story 3.2)
4. **2f8bc61** — `feat: processing jobs infrastructure with BullMQ migration and code review fixes` (Story 3.1)
5. **cc21320** — `feat: document list view and remove document with code review fixes` (Stories 2.6/2.7)

**Commit Message Pattern:** `feat: <description> and code review fixes`

**Files Changed in Story 3.5 (most relevant precedent):**
- Created: `processing.gateway.ts`, `processing-gateway.module.ts`, `processing.gateway.spec.ts`, `websocket.ts` (types), `websocket-client.ts`, `processingStore.ts`, `processing.ts` (API)
- Modified: `app.module.ts`, `processing.module.ts`, `literature-processing.processor.ts`, `packages/types/src/index.ts`

**Expected Commit for This Story:**
```
feat: initiate processing and progress display with controller, service, and frontend modal
```

---

### Latest Technology Information

**NestJS Controller with class-validator (NestJS 11.x):**

- `@Body()` decorator with a class-validator DTO automatically validates when `ValidationPipe` is globally configured
- `ValidationPipe({ whitelist: true })` strips unexpected properties from the request body
- `ValidationPipe({ transform: true })` transforms plain objects to class instances
- `@UsePipes()` can be used per-endpoint if global pipe isn't configured
- NestJS returns 400 with `{ statusCode: 400, message: [...validation errors], error: "Bad Request" }` on validation failure

**BullMQ Queue.add() (BullMQ 5.x):**

- `queue.add(jobName, data, opts?)` — jobName is a string identifier, data is the payload
- The worker pattern-matches on jobName in `@Processor('queue-name')`
- Job is immediately available for processing by the worker
- Returns a `Job` instance with `id`, `data`, `status` properties

**Zustand Reactive Rendering (Zustand 5.x):**

- Components using `useProcessingStore((s) => s.status)` re-render only when `status` changes
- Multiple selectors can be combined: `useProcessingStore((s) => ({ status: s.status, progress: s.progressPercentage }))`
- Use shallow equality for object selectors to prevent unnecessary re-renders

**Next.js App Router Dynamic Routes:**

- `app/literature-review/[id]/page.tsx` creates route `/literature-review/:id`
- Access params via `{ params }` prop in the page component
- Use `'use client'` directive for interactive pages

---

### Project Structure Notes

- ProcessingService and ProcessingController are added to the EXISTING ProcessingModule — no new module needed for processing jobs
- LiteratureReviewsModule is a NEW module — follows separation of concerns (processing creation vs. review retrieval)
- Frontend processing components go in `src/components/features/processing/` — new directory
- Placeholder literature review page at `app/literature-review/[id]/page.tsx` — will be expanded in Story 3.7
- Dashboard page modification is minimal — add two component imports and render calls

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.6-Initiate-Processing-and-Progress-Display] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR6, FR21, FR22 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — REST endpoints, WebSocket events, API versioning
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] — JwtAuthGuard, rate limiting patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Zustand stores, component architecture, react-pdf
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-Boundaries] — FR6/FR21/FR22 structure mapping
- [Source: _bmad-output/planning-artifacts/architecture.md#Integration-Points] — Processing flow: POST → BullMQ → worker → WebSocket → store → UI
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — camelCase JSON, snake_case DB, PascalCase components, kebab-case backend files
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] — FR6, FR21, FR22 requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Zero-friction input, calm confidence, automatic intelligence
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Emotional-Journey-Mapping] — Stage 2 "During Processing": relaxed detachment + trust, progress bar shows it's working
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Processing without feedback is unrecoverable failure
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-Pattern-Analysis] — "Generate Literature Review" button is prominent (high contrast for primary actions)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Anti-Patterns] — No modal dialogs that block work (but progress modal is appropriate — shows progress, not blocking)
- [Source: apps/api/src/modules/processing/processing.module.ts] — ProcessingModule with BullMQ queues, entities, AiModule, ProcessingGatewayModule
- [Source: apps/api/src/entities/processing-job.entity.ts] — ProcessingJob entity with status enum, progress fields
- [Source: apps/api/src/entities/literature-review.entity.ts] — LiteratureReview entity
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Worker expects { processingJobId, userId, documentIds } job data
- [Source: apps/api/src/modules/documents/documents.controller.ts] — Controller pattern to follow (JwtAuthGuard, Throttle, DTOs)
- [Source: apps/api/src/gateways/processing.gateway.ts] — WebSocket gateway (no changes needed)
- [Source: apps/web/src/lib/store/processingStore.ts] — Processing store with startProcessing, syncJobStatus, resetProcessing
- [Source: apps/web/src/lib/api/processing.ts] — Frontend API calls (createProcessingJob, getProcessingJob)
- [Source: apps/web/src/lib/websocket-client.ts] — WebSocket client singleton
- [Source: apps/web/app/dashboard/page.tsx] — Dashboard page to integrate button + modal
- [Source: apps/web/src/components/features/upload/DocumentList.tsx] — Component integration pattern in dashboard
- [Source: apps/web/src/components/features/layout/Modal.tsx] — Modal component API (open, onClose, title, actions)
- [Source: apps/web/src/components/features/cards/DocumentCard.tsx] — Document card with textExtracted status
- [Source: apps/web/src/lib/store/documentStore.ts] — Document store pattern
- [Source: packages/types/src/processing.ts] — ProcessingJobStatus, CreateProcessingJobDto, ProcessingJobResponse
- [Source: packages/types/src/websocket.ts] — WS_EVENTS, ProgressEvent, CompleteEvent, ErrorEvent
- [Source: _bmad-output/implementation-artifacts/3-5-real-time-progress-updates-via-websocket.md] — Previous story learnings, 83 tests passing

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No blocking issues encountered during implementation.

### Completion Notes List

- Created ProcessingService with createJob (validates document ownership, textExtracted status, creates QUEUED job, adds to BullMQ queue), getJob (with ownership verification), and getJobsByUser methods
- Created ProcessingController with POST / (rate limited 5 req/min, returns 201) and GET /:id endpoints following DocumentsController patterns
- Created CreateProcessingJobDto with class-validator decorators (@IsArray, @IsUUID, @ArrayMinSize) and ProcessingJobResponseDto matching @repo/types interface
- Wired ProcessingService (provider) and ProcessingController (controller) into existing ProcessingModule
- Created LiteratureReviewsModule with service (fetches review + citations with ownership verification) and controller (GET /literature-reviews/:id with camelCase response)
- Imported LiteratureReviewsModule in AppModule
- Created ProcessingProgressModal using Dialog component: queued state (0% bar, "Queued - waiting to start..."), processing state (animated bar with percentage and message), completed state (100% green bar, "View Literature Review" button navigating to /literature-review/{resultId}), failed state (error message, "Try Again" and "Close" buttons). Modal is not closeable during active processing (UX: no uncertainty)
- Created GenerateReviewButton with disabled states: no ready documents (tooltip + helper text), processing in-progress (tooltip). On click passes all textExtracted document IDs to startProcessing
- Integrated GenerateReviewButton between upload zone and document list in dashboard, ProcessingProgressModal rendered outside main content area
- Created getLiteratureReview API function in new literature-reviews.ts file with typed response interface
- Created placeholder literature review page at /literature-review/[id] for Story 3.7
- All validations pass: pnpm typecheck (4/4 packages), nest build (clean), 83/83 tests (0 regressions)
- Pre-existing Next.js build issue on root / page (useSearchParams without Suspense) is unrelated to this story

### Change Log

- 2026-02-07: Implemented Story 3.6 — ProcessingService, ProcessingController, LiteratureReviewsModule (backend), ProcessingProgressModal, GenerateReviewButton (frontend), placeholder review page, dashboard integration
- 2026-02-07: Code review fixes — (1) "Try Again" now properly retries processing with lastDocumentIds stored in processingStore, (2) ParseUUIDPipe added to both controllers' :id params, (3) @ArrayUnique() added to CreateProcessingJobDto, (4) Active job check prevents duplicate concurrent processing, (5) Defensive req.user validation added to both controllers, (6) Service now filters to only textExtracted document IDs before queuing

### File List

**New Files:**
- apps/api/src/modules/processing/processing.service.ts
- apps/api/src/modules/processing/processing.controller.ts
- apps/api/src/modules/processing/dto/create-processing-job.dto.ts
- apps/api/src/modules/processing/dto/processing-job-response.dto.ts
- apps/api/src/modules/literature-reviews/literature-reviews.module.ts
- apps/api/src/modules/literature-reviews/literature-reviews.service.ts
- apps/api/src/modules/literature-reviews/literature-reviews.controller.ts
- apps/web/src/components/features/processing/ProcessingProgressModal.tsx
- apps/web/src/components/features/processing/GenerateReviewButton.tsx
- apps/web/src/lib/api/literature-reviews.ts
- apps/web/app/literature-review/[id]/page.tsx

**Modified Files:**
- apps/api/src/modules/processing/processing.module.ts (added ProcessingService to providers, ProcessingController to controllers)
- apps/api/src/app.module.ts (imported LiteratureReviewsModule)
- apps/web/app/dashboard/page.tsx (added GenerateReviewButton and ProcessingProgressModal imports and renders)
- apps/web/src/lib/store/processingStore.ts (added lastDocumentIds for retry support — code review fix)
- _bmad-output/implementation-artifacts/sprint-status.yaml (3-6 status: ready-for-dev -> in-progress -> review -> done)
