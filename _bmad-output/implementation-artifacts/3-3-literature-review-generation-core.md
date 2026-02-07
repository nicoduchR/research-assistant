# Story 3.3: Literature Review Generation Core

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want the AI to synthesize my uploaded PDFs into a structured literature review,
so that I have a draft that organizes the key themes and arguments from my research papers.

## Acceptance Criteria

1. **Given** I have uploaded and extracted text from multiple PDFs **When** a processing job is executed by the worker **Then** the worker fetches all selected documents and their extracted text from the database **And** the documents' text is sent to Claude API with a prompt to generate a structured literature review **And** the prompt instructs Claude to identify themes, group related arguments, and synthesize findings **And** the prompt instructs Claude to include source references for every claim (document ID + page number) **And** the AI response is received and parsed

2. **Given** the AI response is parsed successfully **When** the review is saved **Then** a new `LiteratureReview` entity is created with fields: id (uuid), user_id (uuid FK), job_id (uuid FK), title (string), content (text), document_ids (jsonb array), created_at (timestamp), updated_at (timestamp) **And** the generated review content is saved to the literature_reviews table **And** the processing job's result_id is set to the literature review ID **And** the job status is updated to "completed"

3. **Given** the AI generation takes several minutes **When** the worker is processing **Then** the job remains in "processing" status throughout **And** the worker does not timeout (configured for long-running tasks) **And** progress updates are emitted periodically (progress percentage and message updated on the ProcessingJob record)

4. **Given** the AI API call fails (timeout, rate limit, service error) **When** the error occurs **Then** the error is caught and logged with job ID and error details **And** the job status is set to "failed" **And** the error_message field captures the failure reason **And** no literature review record is created

## Tasks / Subtasks

- [x] Task 1: Create LiteratureReview entity and migration (AC: #2)
  - [x] 1.1 Create `apps/api/src/entities/literature-review.entity.ts` with fields: id (uuid PK), userId (uuid FK to users), jobId (uuid FK to processing_jobs), title (varchar 500), content (text), documentIds (jsonb array), createdAt, updatedAt
  - [x] 1.2 Create migration `apps/api/src/migrations/1738800000000-CreateLiteratureReviewsTable.ts` with table `literature_reviews`, foreign keys to `users` and `processing_jobs`, index on `user_id`, JSONB array CHECK constraint on `document_ids`
  - [x] 1.3 Add LiteratureReview entity to `ProcessingModule` TypeOrmModule.forFeature imports

- [x] Task 2: Create shared LiteratureReview types in @repo/types (AC: #2)
  - [x] 2.1 Create `packages/types/src/literature-review.ts` with `LiteratureReview` interface and `LiteratureReviewResponse` DTO
  - [x] 2.2 Export from `packages/types/src/index.ts`

- [x] Task 3: Implement literature processing logic in the BullMQ worker (AC: #1, #2, #3, #4)
  - [x] 3.1 Inject `AiService` into `LiteratureProcessingProcessor` (requires importing `AiModule` in `ProcessingModule`)
  - [x] 3.2 Inject `Repository<ResearchDocument>` to fetch documents and their extracted text
  - [x] 3.3 Inject `Repository<LiteratureReview>` to save generated reviews
  - [x] 3.4 In the `process()` method, fetch all documents by IDs from job payload and build `DocumentMetadata[]` and `extractedTexts` record
  - [x] 3.5 Filter out documents where `textExtracted === false` or `extractedText` is null; log skipped documents
  - [x] 3.6 If no documents have extracted text, fail the job with message "No documents with extracted text available"
  - [x] 3.7 Update progress: 10% "Preparing documents..." before AI call
  - [x] 3.8 Call `aiService.generateLiteratureReview(documents, extractedTexts)`
  - [x] 3.9 Update progress: 80% "Saving literature review..." after AI response
  - [x] 3.10 Create and save `LiteratureReview` entity with the AI response (title, content, document IDs)
  - [x] 3.11 Update `ProcessingJob.resultId` with the literature review's ID
  - [x] 3.12 Update progress: 100% "Complete" on successful save

- [x] Task 4: Configure BullMQ for long-running AI jobs (AC: #3)
  - [x] 4.1 Update `literature-processing` queue registration in `ProcessingModule` to remove or increase the default timeout (AI calls can take 4+ minutes)
  - [x] 4.2 Ensure `stalledInterval` is not too aggressive — worker must periodically yield to event loop (async operations handle this naturally)

- [x] Task 5: Update ProcessingModule imports (AC: #1, #2)
  - [x] 5.1 Add `AiModule` to `ProcessingModule` imports (for AiService injection into processor)
  - [x] 5.2 Add `LiteratureReview` entity to `TypeOrmModule.forFeature` in ProcessingModule

- [x] Task 6: Verify build and existing tests (AC: all)
  - [x] 6.1 Run `pnpm typecheck` — all packages must pass
  - [x] 6.2 Run `nest build` in apps/api — must compile without errors
  - [x] 6.3 Run existing test suite — no regressions (74/74 tests expected)
  - [x] 6.4 Verify application starts with `pnpm dev` without errors

## Dev Notes

### Story Context

This is **Story 3.3** in **Epic 3: AI-Powered Literature Review Generation**. It is the core story that connects the AI service (Story 3.2) to the BullMQ worker infrastructure (Story 3.1), enabling the actual generation of literature reviews from uploaded PDFs.

**Critical Dependency Chain:**
- **Depends on:** Story 3.1 (Processing Jobs Infrastructure) — provides BullMQ `literature-processing` queue and `LiteratureProcessingProcessor` skeleton with status transition logic
- **Depends on:** Story 3.2 (AI Integration Setup) — provides `AiService` with `generateLiteratureReview()` method that calls Claude API and returns parsed `LiteratureReviewResult`
- **Depended on by:** Story 3.4 (Citation Traceability System) — will create Citation entity and extract citations from the literature review
- **Depended on by:** Story 3.5 (Real-Time Progress Updates via WebSocket) — will emit WebSocket events for progress
- **Depended on by:** Story 3.6 (Initiate Processing and Progress Display) — will create processing API endpoints and frontend UI

**What's Already Built (Do NOT Recreate):**

- **BullMQ infrastructure:** `literature-processing` queue configured in `ProcessingModule` with retry logic (3 attempts, exponential backoff)
- **Literature processor skeleton:** `apps/api/src/jobs/literature-processing.processor.ts` — has status transition logic (queued->processing->completed/failed), job lifecycle events, and placeholder comment for Story 3.3 processing logic
- **ProcessingJob entity:** `apps/api/src/entities/processing-job.entity.ts` — has `resultId` field (uuid, nullable) ready to link to LiteratureReview
- **AiService:** `apps/api/src/modules/ai/ai.service.ts` — has `generateLiteratureReview(documents, extractedTexts)` method that sends structured prompts to Claude, parses response into `LiteratureReviewResult` with title, content, and citations
- **AiModule:** Exports `AiService` for injection into other modules
- **ResearchDocument entity:** `apps/api/src/entities/research-document.entity.ts` — has `extractedText` field (text, nullable) and `textExtracted` boolean
- **Shared AI types:** `packages/types/src/ai.ts` — `DocumentMetadata`, `LiteratureReviewResult`, `CitationResult` interfaces
- **ThrottlerModule:** Rate limiting configured globally in `app.module.ts`
- **Anthropic config:** `apps/api/src/config/anthropic.config.ts` — `getAnthropicClient()` factory

**What This Story Actually Needs:**

1. **LiteratureReview Entity** — New TypeORM entity for the `literature_reviews` table
2. **Migration** — Database migration to create the `literature_reviews` table with foreign keys
3. **Processing Logic** — Fill in the placeholder in `literature-processing.processor.ts` to: fetch documents, call AiService, save LiteratureReview, update ProcessingJob
4. **Module Wiring** — Import `AiModule` in `ProcessingModule`, register new entity
5. **Shared Types** — LiteratureReview interface in `@repo/types`

**What NOT to Build:**

- Do NOT create Citation entity or citations table (Story 3.4)
- Do NOT implement WebSocket progress events (Story 3.5) — only update ProcessingJob progress fields
- Do NOT create processing API endpoints (Story 3.6 creates `POST /api/v1/processing/start`, etc.)
- Do NOT create frontend UI components (Story 3.6/3.7)
- Do NOT implement literature review editing endpoints (Story 3.7)
- Do NOT implement bibliography export (Story 3.10)
- Do NOT modify the AI prompt or AiService (already working from Story 3.2)
- Do NOT install any new npm packages (all dependencies already present)
- Do NOT modify frontend code (no frontend changes in this story)

---

### Technical Requirements

**LiteratureReview Entity Pattern:**

Follow the exact same entity pattern as `ProcessingJob` and `ResearchDocument`:

```typescript
// apps/api/src/entities/literature-review.entity.ts
import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { ProcessingJob } from './processing-job.entity';

@Entity('literature_reviews')
export class LiteratureReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_literature_reviews_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'job_id', type: 'uuid' })
  jobId: string;

  @ManyToOne(() => ProcessingJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: ProcessingJob;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'document_ids', type: 'jsonb' })
  documentIds: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**Migration Pattern (follow `CreateProcessingJobsTable` exactly):**

```typescript
// apps/api/src/migrations/1738800000000-CreateLiteratureReviewsTable.ts
// - UUID primary key with uuid_generate_v4() default
// - Foreign keys to users (CASCADE DELETE) and processing_jobs (CASCADE DELETE)
// - Index on user_id
// - CHECK constraint on document_ids JSONB array
// - Timestamps: created_at (CURRENT_TIMESTAMP), updated_at (CURRENT_TIMESTAMP)
```

**Worker Implementation Pattern:**

The existing `literature-processing.processor.ts` has a placeholder at line 42. The implementation goes inside the `try` block:

```typescript
// Inside process() method try block:
// 1. Fetch documents from database
const documents = await this.documentRepository.find({
  where: { id: In(job.data.documentIds) },
});

// 2. Filter to documents with extracted text
const validDocs = documents.filter(d => d.textExtracted && d.extractedText);

// 3. Build AI input
const docMetadata: DocumentMetadata[] = validDocs.map(d => ({
  id: d.id, fileName: d.fileName, pageCount: d.pageCount,
}));
const extractedTexts: Record<string, string> = {};
validDocs.forEach(d => { extractedTexts[d.id] = d.extractedText!; });

// 4. Call AI service
const result = await this.aiService.generateLiteratureReview(docMetadata, extractedTexts);

// 5. Save literature review
const review = this.literatureReviewRepository.create({
  userId: job.data.userId,
  jobId: processingJobId,
  title: result.title,
  content: result.content,
  documentIds: job.data.documentIds,
});
const saved = await this.literatureReviewRepository.save(review);

// 6. Link to processing job
await this.processingJobRepository.update(processingJobId, {
  resultId: saved.id,
});
```

**Important: TypeORM `In` operator** — Import `In` from `typeorm` for `find({ where: { id: In(ids) } })`.

**Important: Local enum pattern** — If you define any new enums in the entity file, keep them local (not imported from `@repo/types`) because `@repo/types` serves raw TypeScript and extensionless imports fail under Node.js ESM resolution at runtime. Keep a copy in `@repo/types` for frontend usage.

---

### Architecture Compliance

**NestJS Module Organization:**

- `LiteratureReview` entity added to `ProcessingModule`'s `TypeOrmModule.forFeature` imports
- `AiModule` added to `ProcessingModule` imports (to inject `AiService` into the processor)
- No new module needed — LiteratureReview is part of the processing pipeline

**Database Schema:**

- Table name: `literature_reviews` (snake_case, plural)
- Column names: `user_id`, `job_id`, `document_ids`, `created_at`, `updated_at` (snake_case)
- TypeScript properties: `userId`, `jobId`, `documentIds`, `createdAt`, `updatedAt` (camelCase)
- Foreign keys: CASCADE DELETE on both user and processing job
- JSONB CHECK constraint: `jsonb_typeof(document_ids) = 'array'`

**API Endpoint Patterns:**

No new endpoints in this story. The existing processor is invoked by BullMQ queue internally.

**Naming Conventions:**

- Entity file: `literature-review.entity.ts` (kebab-case)
- Class name: `LiteratureReview` (PascalCase)
- Table name: `literature_reviews` (snake_case)
- Migration file: `1738800000000-CreateLiteratureReviewsTable.ts`

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies are already installed:

| Package | Version | Status | Usage |
|---------|---------|--------|-------|
| `@anthropic-ai/sdk` | ^0.72.1 | Already installed | Claude API (via AiService) |
| `@nestjs/bullmq` | installed | Already installed | BullMQ queue integration |
| `bullmq` | installed | Already installed | Queue/worker primitives |
| `typeorm` | installed | Already installed | ORM for entities/migrations |
| `@nestjs/typeorm` | installed | Already installed | TypeORM NestJS integration |

**Anthropic SDK Notes (v0.72.x):**

- Latest published: v0.73.0 (not a breaking change from 0.72.x)
- `client.messages.create()` is the correct API for batch (non-streaming) requests
- Model: `claude-sonnet-4-5-20250929` (configurable via `ANTHROPIC_MODEL` env var)
- `max_tokens: 4096` is set in AiService (sufficient for literature reviews)
- Response: `message.content[0].text` for text, `message.usage` for token counts
- No streaming needed — batch processing via BullMQ

**BullMQ Long-Running Jobs:**

- The `literature-processing` queue has retry logic: 3 attempts, exponential backoff with 2000ms initial delay
- AI processing can take 4+ minutes — ensure no aggressive `timeout` setting on the job options
- BullMQ's default stall detection interval is 30 seconds — async API calls naturally yield to event loop, so stalling should not be an issue
- If stalling occurs, increase `stalledInterval` in worker options
- Progress is tracked by updating `ProcessingJob.progressPercentage` and `progressMessage` fields directly (WebSocket emission is Story 3.5)

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/
├── entities/
│   └── literature-review.entity.ts        # NEW: LiteratureReview TypeORM entity
└── migrations/
    └── 1738800000000-CreateLiteratureReviewsTable.ts  # NEW: Migration for literature_reviews table

packages/types/src/
└── literature-review.ts                    # NEW: Shared LiteratureReview types
```

**Files to Modify:**

```
apps/api/src/
├── jobs/
│   └── literature-processing.processor.ts  # MODIFY: Add actual processing logic (fetch docs, call AI, save review)
└── modules/
    └── processing/
        └── processing.module.ts            # MODIFY: Add AiModule import, add LiteratureReview entity

packages/types/src/
└── index.ts                                # MODIFY: Export LiteratureReview types
```

**No Changes Expected To:**

```
apps/web/                                          # No frontend changes
apps/api/src/modules/ai/                           # AiService unchanged
apps/api/src/modules/documents/                    # Documents unchanged
apps/api/src/modules/auth/                         # Auth unchanged
apps/api/src/entities/processing-job.entity.ts     # Entity unchanged (resultId already exists)
apps/api/src/entities/research-document.entity.ts  # Entity unchanged
apps/api/src/config/                               # Config files unchanged
apps/api/src/app.module.ts                         # Root module unchanged
apps/api/package.json                              # No new packages
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors
3. Existing test suite passes (74/74 tests, no regressions)
4. `pnpm dev` starts both apps without errors
5. Migration can be run against the database (`pnpm migration:run`)
6. The `literature_reviews` table is created with correct schema
7. (Integration test, if possible): Queue a job with valid document IDs and verify a LiteratureReview record is created with content from Claude

---

### Previous Story Intelligence

**From Story 3.2 - AI Integration Setup:**

**Key Learnings:**
1. **AiService is ready for consumption** — `generateLiteratureReview(documents, extractedTexts)` returns `LiteratureReviewResult` with `title`, `content`, and `citations` array
2. **Import pattern for shared types** — Use `import type { ... } from '@repo/types'` for TypeScript-only imports. For runtime enums, define locally in entity file (same as `ProcessingJobStatus` pattern)
3. **ThrottlerModule registered globally** — Rate limiting is already configured in `app.module.ts` with `ThrottlerGuard` as `APP_GUARD`. No additional throttling setup needed
4. **Code review fixes established patterns:**
   - H1: Register global modules properly in `app.module.ts`
   - H2: Use shared types from `@repo/types` via `import type` instead of duplicating interfaces
   - M1: Map service errors to appropriate HTTP status codes
   - M3: Tolerant parsing (regex for multiple format variants)
   - M4: Input validation for empty inputs
5. **Pre-existing issue:** `pnpm start` has a multer module resolution error in `documents.controller.js` — unrelated to this story, do not attempt to fix

**From Story 3.1 - Processing Jobs Infrastructure:**

**Key Learnings:**
1. **Worker pattern:** `LiteratureProcessingProcessor extends WorkerHost` with `@Processor('literature-processing')` decorator
2. **Status transitions:** Already implemented in processor — `QUEUED -> PROCESSING -> COMPLETED/FAILED`
3. **Error handling pattern:** Catch error, update DB with failed status, then re-throw for BullMQ retry logic
4. **Entity pattern:** `ProcessingJobStatus` enum defined locally in entity file (not imported from `@repo/types`)
5. **Migration pattern:** UUID extension, ENUM types, JSONB with CHECK constraints, foreign keys with CASCADE DELETE

**Code Patterns to Follow:**
- Same module pattern (Module with TypeOrmModule.forFeature imports)
- Same logging pattern (`private readonly logger = new Logger(ClassName.name)`)
- Same error handling (try-catch, log with context, update DB, re-throw)
- Same entity pattern (snake_case columns with camelCase TypeScript properties)
- Same migration pattern (Table creation with explicit column definitions, indexes, foreign keys)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` (Story 3.2)
   - Created: `ai.module.ts`, `ai.service.ts`, `ai.controller.ts`, `packages/types/src/ai.ts`
   - Modified: `app.module.ts` (ThrottlerModule, AiModule), `packages/types/src/index.ts`
2. **2f8bc61** — `feat: processing jobs infrastructure with BullMQ migration and code review fixes` (Story 3.1)
   - Created: `processing-job.entity.ts`, `literature-processing.processor.ts`, migration, `packages/types/src/processing.ts`
   - Modified: `app.module.ts`, `processing.module.ts`, `pdf-extraction.processor.ts`
3. **cc21320** — `feat: document list view and remove document with code review fixes` (Stories 2.6/2.7)
4. **c8d9599** — `feat: drag-and-drop upload interface with code review fixes` (Story 2.5)
5. **e18f933** — `fix: pdf-parse v2 API migration and Story 2.4 uncommitted changes` (Story 2.4 fix)

**Commit Message Pattern:** `feat: <description> and code review fixes`

**Expected Commit for This Story:**
```
feat: literature review generation core with LiteratureReview entity and worker implementation
```

---

### Latest Technology Information

**@anthropic-ai/sdk:**
- Latest: v0.73.0 (project has ^0.72.1 — compatible, no breaking changes)
- `client.messages.create()` is the correct API for our batch use case
- `output_config.format` replaces `output_format` in newer API versions (not relevant — we use plain text response with JSON parsing)
- 1M token context window available in beta for Opus 4.6, 200K for Sonnet (sufficient for our use case)

**BullMQ Long-Running Jobs:**
- Default stall detection: 30 seconds — async Claude API calls naturally yield to event loop
- If AI calls take 4+ minutes, ensure no `timeout` is set on job options (currently none set, only `attempts` and `backoff`)
- Progress tracking via `ProcessingJob` entity fields (not BullMQ's built-in `job.updateProgress()` — WebSocket will read from DB in Story 3.5)
- Retry logic (3 attempts, exponential backoff) handles transient Claude API failures

**TypeORM:**
- `In` operator from `typeorm` for `find({ where: { id: In(ids) } })` to fetch multiple documents by ID array
- `repository.create()` then `repository.save()` pattern for new entities
- `repository.update(id, partialEntity)` for updating existing records

---

### Project Structure Notes

- LiteratureReview entity at `apps/api/src/entities/literature-review.entity.ts` — consistent with existing entity locations
- Migration at `apps/api/src/migrations/1738800000000-CreateLiteratureReviewsTable.ts` — timestamp follows after ProcessingJobs migration (1738620000000)
- No new NestJS module — LiteratureReview is part of `ProcessingModule` (same domain: processing pipeline produces literature reviews)
- AiModule imported into ProcessingModule for `AiService` injection into the processor
- Shared types at `packages/types/src/literature-review.ts` — follows domain-based type organization

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3-Literature-Review-Generation-Core] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture] — PostgreSQL with TypeORM, migration strategy
- [Source: _bmad-output/planning-artifacts/architecture.md#Core-Architectural-Decisions] — Anthropic Claude integration pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Naming conventions, entity patterns, module organization
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-Boundaries] — FR6-FR10 structure mapping
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] — FR6, FR7, FR8 requirements
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Existing processor skeleton (line 42 placeholder)
- [Source: apps/api/src/modules/ai/ai.service.ts] — AiService with generateLiteratureReview() method
- [Source: apps/api/src/entities/processing-job.entity.ts] — ProcessingJob entity with resultId field
- [Source: apps/api/src/entities/research-document.entity.ts] — ResearchDocument entity with extractedText field
- [Source: apps/api/src/modules/processing/processing.module.ts] — ProcessingModule with BullMQ queue registration
- [Source: apps/api/src/migrations/1738620000000-CreateProcessingJobsTable.ts] — Migration pattern reference
- [Source: packages/types/src/ai.ts] — Shared AI types (DocumentMetadata, LiteratureReviewResult, CitationResult)
- [Source: _bmad-output/implementation-artifacts/3-2-ai-integration-setup.md] — Previous story learnings
- [Source: _bmad-output/implementation-artifacts/3-1-processing-jobs-infrastructure.md] — BullMQ worker patterns
- [Source: https://docs.bullmq.io/guide/jobs/stalled] — BullMQ stalled jobs documentation
- [Source: https://github.com/anthropics/anthropic-sdk-typescript] — Anthropic SDK TypeScript documentation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

### Completion Notes List

- Task 1: Created `LiteratureReview` entity following existing entity patterns (snake_case columns, camelCase properties, UUID PK, ManyToOne relations with CASCADE DELETE). Created migration with table, foreign keys to `users` and `processing_jobs`, index on `user_id`, and JSONB array CHECK constraint.
- Task 2: Created shared `LiteratureReview` and `LiteratureReviewResponse` interfaces in `@repo/types` and exported from index.
- Task 3: Implemented full processing logic in `LiteratureProcessingProcessor`: fetches documents by ID using TypeORM `In` operator, filters for extracted text, builds AI input (DocumentMetadata + extractedTexts), calls `AiService.generateLiteratureReview()`, saves `LiteratureReview` entity, links via `ProcessingJob.resultId`, with progress updates at 10%, 80%, and 100%. Error handling catches failures and updates job status to FAILED with error message.
- Task 4: Set `lockDuration: 300000` (5 minutes) on the `@Processor` decorator to prevent BullMQ stall detection during long AI API calls. No timeout set on job options (correct — allows unlimited processing time with retry on failure).
- Task 5: Added `AiModule` import and `LiteratureReview` entity to `TypeOrmModule.forFeature` in `ProcessingModule`.
- Task 6: All verifications passed — `pnpm typecheck` (4/4 packages), `nest build` (0 errors), test suite (74/74 pass, 0 regressions), `pnpm dev` (application starts successfully, all modules initialized).

### Senior Developer Review (AI)

**Reviewer:** Nicolas (via Claude Opus 4.6) on 2026-02-07
**Outcome:** Approved with fixes applied

**Issues Found:** 3 High, 3 Medium, 1 Low

**HIGH — Fixed:**
- H1: Excessive DB round-trips (5 separate UPDATE calls on success path) — Merged steps 9, 10, and COMPLETED transition into single DB call (`literature-processing.processor.ts`)
- H2: `documentIds` saved all *requested* IDs instead of only *actually processed* IDs — Changed to `validDocs.map(d => d.id)` (`literature-processing.processor.ts:125`)
- H3: No validation for empty `documentIds` before starting processing — Added early guard inside try block (`literature-processing.processor.ts:53-56`)

**MEDIUM — Fixed:**
- M2: `LiteratureReviewResponse` DTO missing `jobId` field — Added `jobId: string` to DTO (`packages/types/src/literature-review.ts`)

**MEDIUM — Accepted (consistent with existing patterns):**
- M1: Migration uses `timestamp` without timezone — Same as existing `CreateProcessingJobsTable` migration; project-wide concern, not this story's scope
- M3: `Date` vs `string` type in interface vs DTO — Intentional serialization pattern, consistent with `ProcessingJobResponse`

**LOW — Noted:**
- L1: `sprint-status.yaml` modification not in File List — Workflow artifact, acceptable

**Verification:** `pnpm typecheck` 4/4 pass, `pnpm test` 74/74 pass, no regressions.

### Change Log

- 2026-02-07: Code review fixes — merged redundant DB updates, fixed documentIds to use only processed docs, added empty input validation, added jobId to LiteratureReviewResponse DTO
- 2026-02-07: Story 3.3 implementation — LiteratureReview entity, migration, processing logic, module wiring, shared types

### File List

**New Files:**
- `apps/api/src/entities/literature-review.entity.ts` — LiteratureReview TypeORM entity
- `apps/api/src/migrations/1738800000000-CreateLiteratureReviewsTable.ts` — Migration for literature_reviews table
- `packages/types/src/literature-review.ts` — Shared LiteratureReview and LiteratureReviewResponse interfaces

**Modified Files:**
- `apps/api/src/jobs/literature-processing.processor.ts` — Added document fetching, AI call, review saving, progress tracking, lockDuration
- `apps/api/src/modules/processing/processing.module.ts` — Added AiModule import, LiteratureReview entity to TypeOrmModule.forFeature
- `packages/types/src/index.ts` — Added LiteratureReview type exports
