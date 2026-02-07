# Story 3.1: Processing Jobs Infrastructure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up BullMQ with Redis for async job processing,
so that long-running AI tasks can be processed in the background without blocking the API.

## Acceptance Criteria

1. **Given** the NestJS API is running **When** I set up the job queue infrastructure **Then** Redis is configured and connected to the NestJS application

2. **Given** Redis is connected **When** I configure BullMQ **Then** BullMQ is installed and configured with a queue named "literature-processing" **And** the queue has retry logic with exponential backoff (3 attempts, 2s base delay)

3. **Given** the database is set up **When** I create the ProcessingJob entity **Then** a `ProcessingJob` entity is created with fields: id (uuid), user_id (uuid FK), status (enum: queued, processing, completed, failed), document_ids (jsonb array), result_id (uuid nullable FK), error_message (text nullable), progress_percentage (integer default 0), progress_message (string nullable), queued_at (timestamp), started_at (timestamp nullable), completed_at (timestamp nullable)

4. **Given** the ProcessingJob entity exists **When** I generate a TypeORM migration **Then** a migration is created for the processing_jobs table with snake_case columns and an index on user_id

5. **Given** the queue is configured **When** a job worker is set up **Then** a worker is configured to listen to the "literature-processing" queue **And** the worker logs when it starts processing a job

6. **Given** the processing infrastructure is set up **When** job status transitions occur **Then** job status transitions are tracked: queued -> processing -> completed/failed **And** the ProcessingJob entity in the database is updated accordingly

7. **Given** the infrastructure is configured **When** I check the environment **Then** Redis configuration is documented in .env.example (host, port, password)

## Tasks / Subtasks

- [x] Task 1: Migrate from @nestjs/bull to @nestjs/bullmq (AC: #1, #2)
  - [x] 1.1 Uninstall `@nestjs/bull` and `bull` packages
  - [x] 1.2 Install `@nestjs/bullmq` package (bullmq and ioredis already installed)
  - [x] 1.3 Update `apps/api/src/config/redis.config.ts` to add `maxRetriesPerRequest: null` (critical for BullMQ workers)
  - [x] 1.4 Update `apps/api/src/app.module.ts`: change `BullModule` import from `@nestjs/bull` to `@nestjs/bullmq`, change `redis:` to `connection:` in config
  - [x] 1.5 Update `apps/api/src/modules/processing/processing.module.ts`: change imports to `@nestjs/bullmq`, change `redis:` to `connection:` if present

- [x] Task 2: Migrate existing PdfExtractionProcessor to BullMQ pattern (AC: #1)
  - [x] 2.1 Update imports in `apps/api/src/jobs/pdf-extraction.processor.ts` from `@nestjs/bull` to `@nestjs/bullmq`, from `bull` Job to `bullmq` Job
  - [x] 2.2 Extend `WorkerHost` class and implement `process()` method instead of `@Process('extract-text')` decorator
  - [x] 2.3 Add `@OnWorkerEvent('completed')` and `@OnWorkerEvent('failed')` event handlers
  - [x] 2.4 Update `apps/api/src/modules/documents/documents.service.ts`: change `@InjectQueue` import from `@nestjs/bull` to `@nestjs/bullmq`

- [x] Task 3: Register "literature-processing" queue (AC: #2, #5)
  - [x] 3.1 Add `BullModule.registerQueue({ name: 'literature-processing' })` to ProcessingModule with defaultJobOptions (attempts: 3, exponential backoff 2s, removeOnComplete: 100, removeOnFail: 500)
  - [x] 3.2 Create placeholder `LiteratureProcessingProcessor` in `apps/api/src/jobs/literature-processing.processor.ts` extending `WorkerHost` with logging on job start
  - [x] 3.3 Register the processor in ProcessingModule providers

- [x] Task 4: Create ProcessingJob entity (AC: #3)
  - [x] 4.1 Create `apps/api/src/entities/processing-job.entity.ts` with all specified fields following existing entity patterns (UUID PK, snake_case columns, camelCase properties, @Index on user_id, @ManyToOne to User)
  - [x] 4.2 Create ProcessingJobStatus enum: `queued`, `processing`, `completed`, `failed`
  - [x] 4.3 Add entity to TypeOrmModule.forFeature in ProcessingModule

- [x] Task 5: Create TypeORM migration for processing_jobs table (AC: #4)
  - [x] 5.1 Create migration file `apps/api/src/migrations/[timestamp]-CreateProcessingJobsTable.ts` following existing migration patterns
  - [x] 5.2 Create table with all snake_case columns, UUID PK with uuid_generate_v4(), foreign key to users table with ON DELETE CASCADE
  - [x] 5.3 Create index `idx_processing_jobs_user_id` on user_id column
  - [x] 5.4 Implement `down()` method to drop FK, index, and table in reverse order

- [x] Task 6: Add shared ProcessingJob types (AC: #6)
  - [x] 6.1 Create `packages/types/src/processing.ts` with ProcessingJob interface, ProcessingJobStatus enum, CreateProcessingJobDto, and ProcessingJobResponse types
  - [x] 6.2 Export from `packages/types/src/index.ts`

- [x] Task 7: Update .env.example and verify (AC: #7)
  - [x] 7.1 Verify Redis config already documented in `apps/api/.env.example` (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD) - add if missing
  - [x] 7.2 Verify application starts successfully with `pnpm dev` from root
  - [x] 7.3 Verify migration runs successfully against PostgreSQL

## Dev Notes

### Story Context

This is **Story 3.1** in **Epic 3: AI-Powered Literature Review Generation** - the **first story** in this epic. It establishes the foundational async job processing infrastructure that all subsequent Epic 3 stories depend on (AI integration, literature review generation, WebSocket progress, etc.).

**Critical Dependency:** Epic 3 stories 3.2 through 3.10 all depend on this infrastructure being correctly set up. The "literature-processing" queue will be consumed by the AI synthesis processor in Story 3.3.

**What's Already Built (Do NOT Recreate):**

- **Redis configuration:** `apps/api/src/config/redis.config.ts` - basic Redis config with host/port/password from ConfigService
- **BullModule root config:** `apps/api/src/app.module.ts` - BullModule.forRootAsync already configured (but using OLD `@nestjs/bull` package)
- **ProcessingModule:** `apps/api/src/modules/processing/processing.module.ts` - already exists with `pdf-extraction` queue registered
- **PdfExtractionProcessor:** `apps/api/src/jobs/pdf-extraction.processor.ts` - existing processor using OLD `@nestjs/bull` decorators (`@Processor`, `@Process`)
- **Queue injection pattern:** `apps/api/src/modules/documents/documents.service.ts` - already injects and uses `pdf-extraction` queue via `@InjectQueue`
- **TypeORM entities:** `apps/api/src/entities/` - User, ResearchDocument, ResearchScope entities with established patterns
- **Migrations:** `apps/api/src/migrations/` - multiple migrations following consistent patterns
- **Packages installed:** `bullmq@5.67.2`, `ioredis@5.9.2` already in package.json

**What This Story Actually Needs:**

1. **Migration from `@nestjs/bull` to `@nestjs/bullmq`** - The codebase currently uses the older `@nestjs/bull` package (wraps Bull v4). It needs to migrate to `@nestjs/bullmq` (wraps BullMQ v5+) for modern patterns and better features.
2. **ProcessingJob entity + migration** - New database table for tracking job status
3. **"literature-processing" queue registration** - New queue for the AI processing pipeline
4. **Placeholder worker** - Basic processor that logs job start (actual AI logic comes in Story 3.3)
5. **Shared types** - ProcessingJob interface for frontend/backend type safety

**What NOT to Build:**

- Do NOT implement AI processing logic (Story 3.2/3.3)
- Do NOT implement WebSocket progress updates (Story 3.5)
- Do NOT create processing API endpoints (Story 3.6)
- Do NOT create LiteratureReview or Citation entities (Stories 3.3/3.4)
- Do NOT install new packages beyond `@nestjs/bullmq` (bullmq and ioredis already installed)
- Do NOT modify frontend code (no frontend changes in this story)
- Do NOT add Bull Board monitoring (not in scope)

---

### Technical Requirements

**BullMQ Migration (Critical):**

The project currently uses `@nestjs/bull@11.0.4` which wraps the older Bull v4 library. Story 3.1 must migrate to `@nestjs/bullmq` which wraps the modern BullMQ v5+.

Key differences:
- Import changes: `@nestjs/bull` -> `@nestjs/bullmq`
- Config key: `redis:` -> `connection:` in BullModule config
- Processor pattern: `@Process('job-name')` decorator -> `WorkerHost.process()` method with job name routing
- Events: separate methods -> `@OnWorkerEvent('completed')` decorators
- Redis config: MUST add `maxRetriesPerRequest: null` for workers
- Job from `bull` -> Job from `bullmq`

**Redis Config Update:**

```typescript
// apps/api/src/config/redis.config.ts
export const getRedisConfig = (configService: ConfigService) => ({
  host: configService.get<string>('REDIS_HOST', 'localhost'),
  port: parseInt(configService.get('REDIS_PORT', '6379'), 10),
  password: configService.get<string>('REDIS_PASSWORD') || undefined,
  maxRetriesPerRequest: null, // CRITICAL: Required for BullMQ workers
});
```

**AppModule BullModule Update:**

```typescript
// Change from:
import { BullModule } from '@nestjs/bull';
// ... redis: getRedisConfig(configService)

// Change to:
import { BullModule } from '@nestjs/bullmq';
// ... connection: getRedisConfig(configService)
```

**PdfExtractionProcessor Migration Pattern:**

```typescript
// FROM (current @nestjs/bull pattern):
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('pdf-extraction')
export class PdfExtractionProcessor {
  @Process('extract-text')
  async handleExtraction(job: Job<Payload>): Promise<void> { ... }
}

// TO (@nestjs/bullmq pattern):
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('pdf-extraction')
export class PdfExtractionProcessor extends WorkerHost {
  async process(job: Job<Payload>): Promise<void> {
    switch (job.name) {
      case 'extract-text':
        return await this.handleExtraction(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) { ... }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) { ... }

  private async handleExtraction(job: Job<Payload>): Promise<void> { ... }
}
```

**ProcessingJob Entity Pattern:**

```typescript
// apps/api/src/entities/processing-job.entity.ts
export enum ProcessingJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('processing_jobs')
export class ProcessingJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_processing_jobs_user_id')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ProcessingJobStatus, default: ProcessingJobStatus.QUEUED })
  status: ProcessingJobStatus;

  @Column({ name: 'document_ids', type: 'jsonb' })
  documentIds: string[];

  @Column({ name: 'result_id', type: 'uuid', nullable: true })
  resultId: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'progress_percentage', type: 'integer', default: 0 })
  progressPercentage: number;

  @Column({ name: 'progress_message', type: 'varchar', nullable: true })
  progressMessage: string | null;

  @CreateDateColumn({ name: 'queued_at' })
  queuedAt: Date;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;
}
```

**Literature Processing Placeholder Processor:**

```typescript
// apps/api/src/jobs/literature-processing.processor.ts
@Processor('literature-processing')
export class LiteratureProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(LiteratureProcessingProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Starting literature processing job ${job.id} (${job.name})`);
    // Actual processing logic will be added in Story 3.3
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Literature processing job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Literature processing job ${job.id} failed: ${error.message}`, error.stack);
  }
}
```

---

### Architecture Compliance

**NestJS Module Organization:**

- `ProcessingModule` at `apps/api/src/modules/processing/processing.module.ts` — MODIFY to register "literature-processing" queue and add LiteratureProcessingProcessor
- Existing `pdf-extraction` queue and processor KEEP but migrate to @nestjs/bullmq pattern
- Both queues in same module since they share the processing domain

**TypeORM Entity Patterns (MUST follow exactly):**

- UUID primary keys: `@PrimaryGeneratedColumn('uuid')`
- snake_case database columns: `@Column({ name: 'column_name' })`
- camelCase TypeScript properties
- Explicit column types: `{ type: 'uuid' }`, `{ type: 'text' }`, `{ type: 'jsonb' }`
- Index on foreign keys: `@Index('idx_tablename_column')`
- Timestamps: `@CreateDateColumn` for creation, plain `@Column` with nullable for optional timestamps
- Relationships: `@ManyToOne(() => User, { onDelete: 'CASCADE' })` with `@JoinColumn({ name: 'user_id' })`

**Migration Patterns (MUST follow exactly):**

- Filename: `[timestamp]-CreateProcessingJobsTable.ts`
- Class name: `CreateProcessingJobsTable[timestamp]`
- Use `queryRunner.createTable()` with `new Table()`
- UUID PK with `default: 'uuid_generate_v4()'`
- Create indexes with `queryRunner.createIndex()` using `new TableIndex()`
- Create FKs with `queryRunner.createForeignKey()` using `new TableForeignKey()`
- `down()` drops in reverse order: FK -> index -> table
- Pass `true` as second arg to createTable (ifNotExists)

**Naming Conventions:**

- Backend files: kebab-case (`processing-job.entity.ts`, `literature-processing.processor.ts`)
- Entity class: PascalCase (`ProcessingJob`)
- Table name: snake_case (`processing_jobs`)
- Column names: snake_case in DB, camelCase in TypeScript
- Enum values: lowercase strings matching DB enum values
- Index names: `idx_tablename_column`
- FK names: `fk_tablename_column`

---

### Library & Framework Requirements

**Package Changes:**

| Action | Package | Version | Notes |
|--------|---------|---------|-------|
| INSTALL | `@nestjs/bullmq` | ^11.0.4 | Modern BullMQ wrapper for NestJS |
| UNINSTALL | `@nestjs/bull` | ^11.0.4 | Old Bull v4 wrapper - being replaced |
| UNINSTALL | `bull` | ^4.16.5 | Old Bull library - being replaced |
| KEEP | `bullmq` | ^5.67.2 | Already installed - used by @nestjs/bullmq |
| KEEP | `ioredis` | ^5.9.2 | Already installed - Redis client |

**No Frontend Package Changes.**

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/
├── entities/
│   └── processing-job.entity.ts           # NEW: ProcessingJob entity with status enum
├── jobs/
│   └── literature-processing.processor.ts # NEW: Placeholder processor for literature queue
└── migrations/
    └── [timestamp]-CreateProcessingJobsTable.ts  # NEW: Migration for processing_jobs table

packages/types/src/
└── processing.ts                          # NEW: ProcessingJob shared types
```

**Files to Modify:**

```
apps/api/src/
├── config/
│   └── redis.config.ts                    # MODIFY: Add maxRetriesPerRequest: null
├── app.module.ts                          # MODIFY: Change @nestjs/bull → @nestjs/bullmq imports
├── modules/
│   ├── processing/
│   │   └── processing.module.ts           # MODIFY: Add literature-processing queue, add processors, update imports
│   └── documents/
│       └── documents.service.ts           # MODIFY: Change @InjectQueue import to @nestjs/bullmq
└── jobs/
    └── pdf-extraction.processor.ts        # MODIFY: Migrate to WorkerHost pattern

packages/types/src/
└── index.ts                               # MODIFY: Export processing types

apps/api/
├── package.json                           # MODIFY: Remove @nestjs/bull, bull; add @nestjs/bullmq
└── .env.example                           # VERIFY: Redis vars present
```

**No Changes Expected To:**

```
apps/web/                                  # No frontend changes
apps/api/src/entities/user.entity.ts       # Keep as-is
apps/api/src/entities/research-document.entity.ts  # Keep as-is
apps/api/src/entities/research-scope.entity.ts     # Keep as-is
apps/api/src/modules/auth/                 # No auth changes
apps/api/src/modules/documents/documents.controller.ts  # No controller changes
apps/api/src/config/database.config.ts     # No DB config changes
apps/api/src/main.ts                       # No main.ts changes
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm dev` starts both apps without errors
2. NestJS logs show Redis connection established
3. NestJS logs show BullMQ workers initialized for both queues ("pdf-extraction" and "literature-processing")
4. Upload a PDF and verify pdf-extraction queue still works (text extraction completes)
5. TypeORM migration runs successfully (`pnpm migration:run` in apps/api)
6. ProcessingJob entity is recognized by TypeORM (no synchronize errors)
7. Verify processing_jobs table exists in PostgreSQL with correct columns
8. Verify idx_processing_jobs_user_id index exists
9. Verify foreign key to users table exists with CASCADE delete

---

### Previous Story Intelligence

**From Story 2.7 - Remove Document Functionality (Last Story in Epic 2):**

**Key Learnings:**
1. **Store error re-throwing pattern** — `documentStore.deleteDocument` was refactored to re-throw errors instead of swallowing them. Follow same pattern for any new store actions.
2. **Shared toast store** — `apps/web/src/lib/store/toastStore.ts` created for centralized toast management. Use this instead of component-local toast state.
3. **Destructive button variant** — Added to Button component (`bg-error text-white`). Available for future use.
4. **Code review fixes integrated** — Try/catch patterns, error clearing in stores, proper modal behavior established.

**From Story 2.4 - PDF Text Extraction Pipeline:**

**Key Learnings:**
1. **pdf-parse v2 API migration** — The processor uses `new PDFParse({ data: new Uint8Array(buffer) })` + `parser.getText()` + `parser.destroy()` pattern (not the old `pdfParse(buffer)` function).
2. **Scanned PDF detection** — Threshold-based detection (< 100 chars extracted = scanned). Error stored in `extractionError` field.
3. **Error handling in processors** — Catch, update DB with error, then re-throw for Bull retry logic.
4. **Job queuing pattern** — Documents.service uses `@InjectQueue('pdf-extraction')` and `queue.add('extract-text', payload)`.

**Patterns to Preserve:**
- Same entity pattern (UUID PKs, snake_case columns, @Index on FKs, @ManyToOne with CASCADE)
- Same migration pattern (queryRunner.createTable with explicit columns, up/down symmetry)
- Same processor pattern (Logger, constructor injection, try/catch with DB update before rethrow)
- Same module pattern (BullModule.registerQueue with defaultJobOptions, export BullModule)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **cc21320** - "feat: document list view and remove document with code review fixes" (Stories 2.6/2.7)
2. **c8d9599** - "feat: drag-and-drop upload interface with code review fixes" (Story 2.5)
3. **e18f933** - "fix: pdf-parse v2 API migration and Story 2.4 uncommitted changes" (Story 2.4 fix)
4. **4d9a9cd** - "feat: pdf text extraction pipeline" (Story 2.4)
5. **0ce3625** - "feat: single pdf upload" (Story 2.3)

**Patterns Observed:**
- Commit messages follow `feat:` / `fix:` conventional commits
- Code review fixes bundled into same commit as feature
- Stories committed as single atomic commits
- Backend and frontend changes in same commit when related

**Files Relevant to This Story (from recent commits):**
- `apps/api/src/jobs/pdf-extraction.processor.ts` — Will be modified (BullMQ migration)
- `apps/api/src/modules/documents/documents.service.ts` — Will be modified (import change)
- `apps/api/src/app.module.ts` — Will be modified (BullModule import change)

**Expected Commit for This Story:**
```
feat: processing jobs infrastructure with BullMQ migration

- Migrate from @nestjs/bull to @nestjs/bullmq for modern queue patterns
- Create ProcessingJob entity and migration (processing_jobs table)
- Register literature-processing queue with retry configuration
- Add placeholder literature processing worker
- Add shared ProcessingJob types to @repo/types
- Migrate PdfExtractionProcessor to WorkerHost pattern
```

---

### Latest Technology Information

**@nestjs/bullmq v11.0.4 (2025):**
- Wraps BullMQ v5+ which is the actively maintained version
- Uses `WorkerHost` base class pattern instead of `@Process` decorators
- Uses `@OnWorkerEvent` for lifecycle events
- Requires `connection:` instead of `redis:` in config
- **Critical:** Redis connection MUST have `maxRetriesPerRequest: null` for workers

**BullMQ v5 Breaking Changes (Already Applicable):**
- Connection parameter is mandatory (not optional)
- Job IDs must be strings (not integers)
- `QueueScheduler` removed (delayed jobs handled automatically by workers)
- `attemptsMade` only increments on completion/failure (not on start)

**Migration from @nestjs/bull to @nestjs/bullmq:**
- Replace `@Process('name')` with `WorkerHost.process()` + switch on `job.name`
- Replace event methods with `@OnWorkerEvent('event')` decorators
- Change `redis:` to `connection:` in all BullModule configs
- Change `Job` import from `bull` to `bullmq`
- Add `super()` call in constructor when extending `WorkerHost`

---

### Project Structure Notes

- Alignment with architecture: ProcessingJob entity follows established entity patterns exactly
- Migration follows established migration conventions
- New "literature-processing" queue aligns with architecture document specification
- BullMQ migration is a necessary modernization — old `@nestjs/bull` package is superseded
- No frontend changes — this is pure backend infrastructure
- No detected conflicts with existing codebase patterns

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.1-Processing-Jobs-Infrastructure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture] — Redis caching, BullMQ job queue
- [Source: _bmad-output/planning-artifacts/architecture.md#Core-Architectural-Decisions] — BullMQ for async processing
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure-Deployment] — Redis service on Coolify
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Naming conventions, entity patterns
- [Source: _bmad-output/planning-artifacts/prd.md#Reliability] — Async job persistence, processing recovery
- [Source: apps/api/src/config/redis.config.ts] — Existing Redis configuration
- [Source: apps/api/src/app.module.ts] — Current BullModule root config (needs migration)
- [Source: apps/api/src/modules/processing/processing.module.ts] — Existing processing module
- [Source: apps/api/src/jobs/pdf-extraction.processor.ts] — Existing processor (needs migration)
- [Source: apps/api/src/modules/documents/documents.service.ts] — Queue injection pattern
- [Source: apps/api/src/entities/research-document.entity.ts] — Entity pattern reference
- [Source: apps/api/src/migrations/] — Migration pattern reference
- [Source: _bmad-output/implementation-artifacts/2-7-remove-document-functionality.md] — Previous story learnings
- [Source: _bmad-output/implementation-artifacts/2-4-pdf-text-extraction-pipeline.md] — Processor patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None - clean implementation with no blocking issues.

### Completion Notes List

- **Task 1:** Migrated from `@nestjs/bull` + `bull` to `@nestjs/bullmq`. Uninstalled old packages, installed `@nestjs/bullmq@11.0.4`. Updated redis config with `maxRetriesPerRequest: null` (required for BullMQ workers). Changed `redis:` to `connection:` in BullModule.forRootAsync config. Updated imports in app.module.ts, processing.module.ts.
- **Task 2:** Migrated `PdfExtractionProcessor` to BullMQ `WorkerHost` pattern. Replaced `@Process('extract-text')` decorator with `process()` method + switch on `job.name`. Added `@OnWorkerEvent('completed')` and `@OnWorkerEvent('failed')` handlers. Changed `Job` import from `bull` to `bullmq`. Added `super()` call in constructor. Updated `documents.service.ts` `@InjectQueue` and `Queue` imports to `@nestjs/bullmq`/`bullmq`.
- **Task 3:** Registered "literature-processing" queue in ProcessingModule with retry config (3 attempts, exponential backoff 2s, removeOnComplete: 100, removeOnFail: 500). Created placeholder `LiteratureProcessingProcessor` extending `WorkerHost` with logging on job start and event handlers.
- **Task 4:** Created `ProcessingJob` entity with all specified fields (id, userId, status enum, documentIds jsonb, resultId, errorMessage, progressPercentage, progressMessage, queuedAt, startedAt, completedAt). Follows existing entity patterns exactly (UUID PK, snake_case columns, @Index, @ManyToOne with CASCADE). Added to TypeOrmModule.forFeature in ProcessingModule.
- **Task 5:** Created migration `1738620000000-CreateProcessingJobsTable.ts` with enum type creation, all columns, user_id index, and FK with CASCADE delete. Follows existing migration patterns (createTable with `true` flag, createIndex, createForeignKey, reverse-order drops in down()).
- **Task 6:** Created `packages/types/src/processing.ts` with `ProcessingJob` interface, `ProcessingJobStatus` enum, `CreateProcessingJobDto`, and `ProcessingJobResponse` types. Exported from `packages/types/src/index.ts`.
- **Task 7:** Updated `.env.example` with `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (previously only had `REDIS_URL` which didn't match the redis.config.ts params). TypeScript compilation passes. All 74 existing tests pass with 0 regressions.

### Change Log

- **2026-02-07:** Story 3.1 implementation complete - BullMQ migration, ProcessingJob entity/migration, literature-processing queue, shared types.
- **2026-02-07:** Code review (Claude Opus 4.6) - Fixed 4 issues: status transition infrastructure in processor (H1), added @UpdateDateColumn to entity/migration (M1), standardized progress_message column to text type (M2), added CHECK constraint on document_ids JSONB (M3). H2 (duplicate enum) reverted - local enum is correct because @repo/types serves raw TS and extensionless imports fail under Node.js ESM at runtime. Added comment to keep enums in sync. All 74 tests pass.

### File List

**New Files:**
- `apps/api/src/entities/processing-job.entity.ts` — ProcessingJob entity with local ProcessingJobStatus enum (kept in sync with @repo/types)
- `apps/api/src/jobs/literature-processing.processor.ts` — Processor with status transition infrastructure (queued->processing->completed/failed)
- `apps/api/src/migrations/1738620000000-CreateProcessingJobsTable.ts` — Migration for processing_jobs table with CHECK constraint on document_ids
- `packages/types/src/processing.ts` — Shared ProcessingJob types (canonical source for ProcessingJobStatus enum)

**Modified Files:**
- `apps/api/src/config/redis.config.ts` — Added `maxRetriesPerRequest: null`
- `apps/api/src/app.module.ts` — Changed `@nestjs/bull` to `@nestjs/bullmq`, `redis:` to `connection:`
- `apps/api/src/modules/processing/processing.module.ts` — Changed imports to `@nestjs/bullmq`, added literature-processing queue + processor, added ProcessingJob to TypeOrmModule
- `apps/api/src/jobs/pdf-extraction.processor.ts` — Migrated to WorkerHost pattern with process() method and @OnWorkerEvent handlers
- `apps/api/src/modules/documents/documents.service.ts` — Changed @InjectQueue/Queue imports from `@nestjs/bull`/`bull` to `@nestjs/bullmq`/`bullmq`
- `packages/types/src/index.ts` — Added ProcessingJob type exports
- `apps/api/.env.example` — Updated Redis config vars (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
- `apps/api/package.json` — Removed @nestjs/bull and bull, added @nestjs/bullmq
- `pnpm-lock.yaml` — Updated lockfile from package changes
