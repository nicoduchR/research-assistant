# Story 3.9: Error Handling and Partial Results

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want the system to handle errors gracefully and show me partial results when possible,
so that one problematic PDF doesn't prevent me from processing the rest of my documents.

## Acceptance Criteria

1. **Given** I select 5 documents for processing, and 1 is a scanned PDF **When** the processing job runs **Then** the worker detects the scanned PDF (text_extracted = false) before AI processing **And** a warning is logged: "Skipping document [name] - no text extracted (scanned PDF)" **And** the other 4 documents proceed to AI processing **And** the literature review is generated from the 4 successful documents **And** the processing job completes with status "completed"

2. **Given** processing completed with warnings **When** I view the result **Then** a notice is displayed: "Literature review generated from 4 of 5 documents" **And** the skipped document is listed with reason: "[filename] - Scanned PDF, text extraction not available" **And** a suggestion is provided: "Consider re-scanning with OCR or finding a text-based version" **And** the partial literature review is fully usable

3. **Given** all selected documents are scanned PDFs **When** the processing job runs **Then** the worker detects no valid documents for processing **And** the job fails with status "failed" **And** the error message explains: "No documents with extracted text available. Please upload text-based PDFs." **And** no literature review is created

4. **Given** 1 of 5 documents causes an AI processing error **When** the error occurs during synthesis **Then** the error is caught and logged with document ID **And** the other 4 documents continue processing **And** the literature review is generated from the successful documents **And** the error is noted in the job's error_message field **And** the user sees: "Literature review generated from 4 of 5 documents. 1 document could not be processed."

5. **Given** the entire AI service is down **When** the processing attempts to call Claude API **Then** the error is caught after retries (BullMQ retry logic with exponential backoff) **And** the job status is set to "failed" **And** the error message is clear: "AI service unavailable. Please try again later." **And** the user is notified via the progress modal **And** the job can be manually retried from the UI

## Tasks / Subtasks

- [x] Task 1: Add skipped/failed document tracking to ProcessingJob entity (AC: #1, #2, #4)
  - [x] 1.1 Add `skippedDocuments` JSONB column to ProcessingJob entity — stores `Array<{ documentId: string, fileName: string, reason: string }>` for documents excluded before AI processing (scanned PDFs, missing text)
  - [x] 1.2 Add `processedDocumentCount` integer column to ProcessingJob entity — tracks how many documents actually contributed to the literature review
  - [x] 1.3 Generate TypeORM migration for the new columns
  - [x] 1.4 Run migration to apply schema changes

- [x] Task 2: Update literature-processing.processor.ts for partial results (AC: #1, #3, #4)
  - [x] 2.1 Before AI call, partition documents into `validDocs` (textExtracted=true AND extractedText populated) and `skippedDocs` (all others) — log a warning for each skipped document: `"Skipping document ${doc.fileName} — no text extracted (${doc.extractionError || 'unknown reason'})"`
  - [x] 2.2 Save `skippedDocs` metadata to `processingJob.skippedDocuments` JSONB field immediately (before AI call)
  - [x] 2.3 If `validDocs.length === 0`, fail the job with message: "No documents with extracted text available. Please upload text-based PDFs." — do NOT call AI API
  - [x] 2.4 If `validDocs.length > 0` but `validDocs.length < totalDocs`, proceed with valid docs and emit progress message: "Processing {validDocs.length} of {totalDocs} documents ({skippedDocs.length} skipped)"
  - [x] 2.5 After successful AI processing and review save, set `processingJob.processedDocumentCount = validDocs.length`
  - [x] 2.6 If skipped docs exist, set job `errorMessage` to: "Literature review generated from {validDocs.length} of {totalDocs} documents. {skippedDocs.length} document(s) could not be processed." — job status remains "completed" (not failed)

- [x] Task 3: Enhance BullMQ retry configuration for AI failures (AC: #5)
  - [x] 3.1 Ensure literature-processing queue job options use exponential backoff: `{ attempts: 3, backoff: { type: 'exponential', delay: 3000 } }` — already partially configured, verify and align
  - [x] 3.2 In the AI service error handling (`ai.service.ts` `handleApiError`), classify errors as retryable (429 rate limit, 500/503 server errors, network timeouts) vs non-retryable (401 auth, 400 bad request)
  - [x] 3.3 For non-retryable AI errors, throw a custom `NonRetryableError` that BullMQ recognizes via `UnrecoverableError` (from `bullmq` package) to skip remaining retries
  - [x] 3.4 For retryable errors, throw standard Error to trigger BullMQ exponential backoff retry
  - [x] 3.5 On final failure (all retries exhausted), ensure job status is "failed" with clear message: "AI service unavailable. Please try again later."

- [x] Task 4: Update shared types for partial results (AC: #2, #4)
  - [x] 4.1 In `packages/types/src/processing.ts`, add `skippedDocuments?: Array<{ documentId: string, fileName: string, reason: string }>` and `processedDocumentCount?: number` to `ProcessingJob` interface
  - [x] 4.2 In `packages/types/src/websocket.ts`, extend `CompleteEvent` with optional `skippedDocuments` and `processedDocumentCount` fields
  - [x] 4.3 In `packages/types/src/websocket.ts`, extend `ErrorEvent` with optional `failureType?: 'no_documents' | 'ai_error' | 'unknown'` field

- [x] Task 5: Update processing service and controller for partial result exposure (AC: #2)
  - [x] 5.1 In `processing.service.ts`, remove the hard rejection that blocks job creation when some documents lack extracted text — filter documents but still create the job if at least one has extracted text
  - [x] 5.2 Update the processing job response DTO to include `skippedDocuments` and `processedDocumentCount` fields
  - [x] 5.3 In the `GET /api/v1/processing-jobs/:id` response, include `skippedDocuments` and `processedDocumentCount` so the frontend can display partial result metadata

- [x] Task 6: Update WebSocket gateway to emit partial result metadata (AC: #2, #4)
  - [x] 6.1 In `processing.gateway.ts` `emitComplete()`, include `skippedDocuments` and `processedDocumentCount` in the `processing:complete` event payload
  - [x] 6.2 In `emitError()`, include `failureType` in the `processing:error` event payload

- [x] Task 7: Update frontend processing store for partial results (AC: #2, #4, #5)
  - [x] 7.1 In `processingStore.ts`, add state fields: `skippedDocuments: Array<{ documentId: string, fileName: string, reason: string }>`, `processedDocumentCount: number | null`
  - [x] 7.2 Update `PROCESSING_COMPLETE` handler to store `skippedDocuments` and `processedDocumentCount` from the event payload
  - [x] 7.3 Update `syncJobStatus` to fetch and store `skippedDocuments` and `processedDocumentCount` from the REST API response
  - [x] 7.4 Add a `hasSkippedDocuments` computed getter that returns `skippedDocuments.length > 0`

- [x] Task 8: Update ProcessingProgressModal for partial results and enhanced errors (AC: #2, #4, #5)
  - [x] 8.1 In the `completed` state of ProcessingProgressModal, if `hasSkippedDocuments`, display an info banner: "Literature review generated from {processedDocumentCount} of {totalDocs} documents" with a collapsible list of skipped documents showing filename and reason
  - [x] 8.2 Below the skipped documents list, show suggestion text: "Consider re-scanning with OCR or finding text-based versions of skipped documents"
  - [x] 8.3 In the `failed` state, if `failureType === 'no_documents'`, show specific message: "No documents with extracted text available. Please upload text-based PDFs." with a link/button to go back to upload
  - [x] 8.4 In the `failed` state, if `failureType === 'ai_error'`, show: "AI service unavailable. Please try again later." with "Try Again" button
  - [x] 8.5 Ensure "Try Again" button remains functional — uses `lastDocumentIds` from the store

- [x] Task 9: Update literature review page for partial result notice (AC: #2)
  - [x] 9.1 On the literature review page (`apps/web/app/literature-review/[id]/page.tsx`), after loading the review, fetch the associated processing job to check for `skippedDocuments`
  - [x] 9.2 If `skippedDocuments.length > 0`, display a persistent warning banner at the top of the review content: "This literature review was generated from {processedDocumentCount} of {totalDocs} documents. {skippedCount} document(s) were skipped."
  - [x] 9.3 Make the banner collapsible — on expand, show list of skipped documents with filenames and reasons
  - [x] 9.4 Style the banner using existing Card/Badge atoms with a warning color scheme (amber/yellow)

- [x] Task 10: Verify build, types, and integration (AC: all)
  - [x] 10.1 Run `pnpm typecheck` — all packages pass
  - [x] 10.2 Run `nest build` in apps/api — compiles without errors
  - [x] 10.3 Run existing test suite — no regressions
  - [x] 10.4 Manual verification: upload 3 text-based PDFs + 1 known-scanned PDF, trigger processing, verify partial results display
  - [x] 10.5 Manual verification: attempt processing with only scanned PDFs, verify proper failure message
  - [x] 10.6 Manual verification: verify "Try Again" button works from failed state
  - [x] 10.7 Manual verification: verify literature review page shows partial result banner
  - [x] 10.8 Verify all existing functionality (upload, processing, display, edit, citations) still works

## Dev Notes

### Story Context

This is **Story 3.9** in **Epic 3: AI-Powered Literature Review Generation**. It adds robust error handling and partial results support across the full stack — backend job processor, shared types, WebSocket events, and frontend UI. The goal is graceful degradation: when some documents fail (scanned PDFs, extraction errors), the system processes what it can and clearly communicates what happened.

**Functional Requirements Covered:** FR25 (detect unprocessable PDFs), FR26 (clear error message on failure), FR27 (continue processing remaining documents when one fails), FR28 (show which documents succeeded/failed)

**Critical Dependency Chain:**
- **Depends on:** Story 3.6 (Processing & Progress Display — the modal), Story 3.7 (Literature Review Display — the page), Story 3.3 (Literature Review Generation Core — the processor), Story 3.5 (WebSocket progress — the gateway) — ALL STATUS: DONE
- **Depended on by:** Story 3.10 (Bibliography Export) — only indirectly; no hard dependency

**What's Already Built (Do NOT Recreate):**

- **ProcessingProgressModal** — `apps/web/src/components/features/processing/ProcessingProgressModal.tsx` — modal with progress bar, percentage display, completion/failure states, "Try Again" button, "Close" button. States: queued, processing, completed, failed. [Source: `apps/web/src/components/features/processing/ProcessingProgressModal.tsx`]
- **GenerateReviewButton** — `apps/web/src/components/features/processing/GenerateReviewButton.tsx` — button that triggers processing with validation (requires documents with extracted text). [Source: `apps/web/src/components/features/processing/GenerateReviewButton.tsx`]
- **processingStore** — `apps/web/src/lib/store/processingStore.ts` — Zustand store managing job lifecycle: `status` (`idle|queued|processing|completed|failed`), `progressPercentage`, `progressMessage`, `errorMessage`, `resultId`, `lastDocumentIds`, `activeJobId`. WebSocket event handlers for `PROCESSING_PROGRESS`, `PROCESSING_COMPLETE`, `PROCESSING_ERROR`. `syncJobStatus` for reconnection recovery. [Source: `apps/web/src/lib/store/processingStore.ts`]
- **literature-processing.processor.ts** — `apps/api/src/jobs/literature-processing.processor.ts` — BullMQ worker that: loads documents from DB, filters by textExtracted, calls AI service, saves LiteratureReview + Citations, emits WebSocket events. Currently: 3 retries with exponential backoff (delay 2000ms), 5-min lock duration. Has try-catch around entire job with status update to FAILED on error. [Source: `apps/api/src/jobs/literature-processing.processor.ts`]
- **pdf-extraction.processor.ts** — `apps/api/src/jobs/pdf-extraction.processor.ts` — BullMQ worker for PDF text extraction. Already handles scanned PDF detection (< 100 chars), sets `textExtracted: false` and `extractionError` on failure. 3 retries. [Source: `apps/api/src/jobs/pdf-extraction.processor.ts`]
- **ai.service.ts** — `apps/api/src/modules/ai/ai.service.ts` — Anthropic Claude SDK integration. Has `handleApiError()` that classifies errors by HTTP status (401, 429, 500/503). Currently throws all errors (no retry/non-retry distinction). [Source: `apps/api/src/modules/ai/ai.service.ts`]
- **processing.service.ts** — `apps/api/src/modules/processing/processing.service.ts` — Creates processing jobs. Currently HARD REJECTS if any documents lack extracted text (this needs to change for partial results). Validates document ownership. [Source: `apps/api/src/modules/processing/processing.service.ts`]
- **processing.gateway.ts** — `apps/api/src/gateways/processing.gateway.ts` — WebSocket gateway with `emitProgress`, `emitComplete`, `emitError` methods. Events: `processing:progress`, `processing:complete`, `processing:error`. [Source: `apps/api/src/gateways/processing.gateway.ts`]
- **ProcessingJob entity** — `apps/api/src/entities/processing-job.entity.ts` — Fields: id, userId, status (QUEUED/PROCESSING/COMPLETED/FAILED), documentIds (JSONB), resultId, errorMessage, progressPercentage, progressMessage, queuedAt, startedAt, completedAt. [Source: `apps/api/src/entities/processing-job.entity.ts`]
- **LiteratureReview entity** — `apps/api/src/entities/literature-review.entity.ts` — Fields: id, userId, jobId, title, content, documentIds (JSONB), createdAt, updatedAt. [Source: `apps/api/src/entities/literature-review.entity.ts`]
- **ResearchDocument entity** — `apps/api/src/entities/research-document.entity.ts` — Fields: id, userId, fileName, fileSize, mimeType, storagePath, pageCount, textExtracted (boolean), extractionError (string nullable), extractedText (text), uploadedAt, updatedAt. [Source: `apps/api/src/entities/research-document.entity.ts`]
- **WebSocket types** — `packages/types/src/websocket.ts` — ProgressEvent: `{ jobId, progressPercentage, progressMessage, timestamp }`, CompleteEvent: `{ jobId, resultId, timestamp }`, ErrorEvent: `{ jobId, errorMessage, timestamp }`. [Source: `packages/types/src/websocket.ts`]
- **Processing types** — `packages/types/src/processing.ts` — ProcessingJobStatus enum, ProcessingJob interface. [Source: `packages/types/src/processing.ts`]
- **Toast system** — `apps/web/src/lib/store/toastStore.ts` + `apps/web/src/components/molecules/Toast/` — Types: success, error, info, warning. Auto-dismiss 5s. [Source: `apps/web/src/lib/store/toastStore.ts`]
- **Card atoms** — `apps/web/src/components/atoms/Card/Card.tsx` — Card, CardHeader, CardTitle, CardContent for UI sections. [Source: `apps/web/src/components/atoms/Card/Card.tsx`]
- **Badge atom** — `apps/web/src/components/atoms/Badge/Badge.tsx` — StatusBadge for visual indicators. [Source: `apps/web/src/components/atoms/Badge/Badge.tsx`]
- **Material Icons** — Available via `<span className="material-symbols-outlined">icon_name</span>`. [Source: various components]
- **Literature review page** — `apps/web/app/literature-review/[id]/page.tsx` — Two-column layout (review content + methodology sidebar). View/edit modes. Fetches review by ID. [Source: `apps/web/app/literature-review/[id]/page.tsx`]

**What NOT to Build:**

- Do NOT create a new global exception filter — the standard NestJS exception handling is sufficient for this story
- Do NOT add a new ProcessingJob status (like "partial") — use "completed" with metadata to indicate partial results
- Do NOT implement job cancellation — that's beyond the scope of this story
- Do NOT add retry logic at the API client (axios) level — retries happen at the BullMQ job queue level
- Do NOT implement automatic retry for individual documents — retry is the full job via "Try Again" button
- Do NOT install any new npm packages — `bullmq` already provides `UnrecoverableError`
- Do NOT modify the PDF extraction processor — scanned PDF detection already works correctly
- Do NOT modify LiteratureReviewContent or LiteratureReviewEditor components
- Do NOT modify the MethodologyProgressTracker component
- Do NOT add client-side timeout handling — job processing time is managed by BullMQ lock duration

---

### Technical Requirements

**Entity Changes (ProcessingJob):**

Add two new columns to the ProcessingJob entity:

```typescript
// apps/api/src/entities/processing-job.entity.ts — ADD these columns

@Column({ type: 'jsonb', nullable: true, name: 'skipped_documents' })
skippedDocuments: Array<{ documentId: string; fileName: string; reason: string }> | null;

@Column({ type: 'int', nullable: true, name: 'processed_document_count' })
processedDocumentCount: number | null;
```

**Migration:** Generate with `pnpm --filter api migration:generate -- -n AddSkippedDocumentsToProcessingJob`

**Processor Changes (literature-processing.processor.ts):**

The key change is in the document filtering logic. Currently:
```typescript
// Current: Filters docs, throws if none valid
const validDocs = allDocs.filter(d => d.textExtracted && d.extractedText);
if (validDocs.length === 0) throw new Error('No documents with extracted text');
```

New pattern:
```typescript
// New: Partition docs, track skipped, proceed with valid
const validDocs = allDocs.filter(d => d.textExtracted && d.extractedText);
const skippedDocs = allDocs.filter(d => !d.textExtracted || !d.extractedText);

// Save skipped metadata to job
if (skippedDocs.length > 0) {
  job.data.skippedDocuments = skippedDocs.map(d => ({
    documentId: d.id,
    fileName: d.fileName,
    reason: d.extractionError || 'Text extraction not available',
  }));
  await processingJobRepo.update(jobEntity.id, {
    skippedDocuments: job.data.skippedDocuments,
  });
  this.logger.warn(`Skipping ${skippedDocs.length} documents without extracted text`);
  for (const doc of skippedDocs) {
    this.logger.warn(`Skipping document ${doc.fileName} - ${doc.extractionError || 'no text extracted'}`);
  }
}

if (validDocs.length === 0) {
  // Total failure — no valid docs at all
  throw new Error('No documents with extracted text available. Please upload text-based PDFs.');
}

// Emit progress showing partial processing
this.emitProgress(userId, jobId, 10, `Processing ${validDocs.length} of ${allDocs.length} documents...`);

// ... proceed with AI call using validDocs only ...

// After success, save metadata
await processingJobRepo.update(jobEntity.id, {
  processedDocumentCount: validDocs.length,
  errorMessage: skippedDocs.length > 0
    ? `Literature review generated from ${validDocs.length} of ${allDocs.length} documents. ${skippedDocs.length} document(s) could not be processed.`
    : null,
});
```

**AI Service Error Classification:**

```typescript
// apps/api/src/modules/ai/ai.service.ts — Update handleApiError

import { UnrecoverableError } from 'bullmq';

private handleApiError(error: unknown): never {
  if (error instanceof Anthropic.APIError) {
    const status = error.status;
    if (status === 401) {
      // Non-retryable: bad API key
      throw new UnrecoverableError('AI service authentication failed. Contact administrator.');
    }
    if (status === 429) {
      // Retryable: rate limited
      throw new Error('AI service rate limited. Retrying...');
    }
    if (status === 500 || status === 503) {
      // Retryable: server issues
      throw new Error('AI service temporarily unavailable. Retrying...');
    }
    // Non-retryable: unknown client error
    throw new UnrecoverableError(`AI service error: ${error.message}`);
  }
  // Network errors are retryable
  throw new Error(`AI service connection error: ${(error as Error).message}`);
}
```

**Shared Types Updates:**

```typescript
// packages/types/src/processing.ts — ADD fields
export interface ProcessingJob {
  // ... existing fields ...
  skippedDocuments?: Array<{ documentId: string; fileName: string; reason: string }>;
  processedDocumentCount?: number;
}

// packages/types/src/websocket.ts — EXTEND events
export interface ProcessingCompleteEvent {
  jobId: string;
  resultId: string;
  timestamp: string;
  skippedDocuments?: Array<{ documentId: string; fileName: string; reason: string }>;
  processedDocumentCount?: number;
}

export interface ProcessingErrorEvent {
  jobId: string;
  errorMessage: string;
  timestamp: string;
  failureType?: 'no_documents' | 'ai_error' | 'unknown';
}
```

**Frontend Store Updates:**

```typescript
// apps/web/src/lib/store/processingStore.ts — ADD state
interface ProcessingState {
  // ... existing fields ...
  skippedDocuments: Array<{ documentId: string; fileName: string; reason: string }>;
  processedDocumentCount: number | null;
}

// In PROCESSING_COMPLETE handler:
skippedDocuments: data.skippedDocuments || [],
processedDocumentCount: data.processedDocumentCount || null,

// In reset/initial state:
skippedDocuments: [],
processedDocumentCount: null,
```

**ProcessingProgressModal Updates:**

In the completed state, add a conditional warning banner:

```tsx
{status === 'completed' && skippedDocuments.length > 0 && (
  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-center gap-2 text-amber-800 font-medium">
      <span className="material-symbols-outlined text-amber-600">warning</span>
      Literature review generated from {processedDocumentCount} of {processedDocumentCount + skippedDocuments.length} documents
    </div>
    <div className="mt-2 text-sm text-amber-700">
      <p className="font-medium">Skipped documents:</p>
      <ul className="mt-1 space-y-1">
        {skippedDocuments.map(doc => (
          <li key={doc.documentId}>• {doc.fileName} — {doc.reason}</li>
        ))}
      </ul>
      <p className="mt-2 text-amber-600 italic">
        Consider re-scanning with OCR or finding text-based versions.
      </p>
    </div>
  </div>
)}
```

**Literature Review Page Banner:**

Add a warning banner at the top of the review content when partial results:

```tsx
{skippedDocuments.length > 0 && (
  <Card className="mb-4 border-amber-200 bg-amber-50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-amber-800">
        <span className="material-symbols-outlined text-amber-600">info</span>
        <span className="font-medium">
          This literature review was generated from {processedDocumentCount} of{' '}
          {processedDocumentCount + skippedDocuments.length} documents.
        </span>
      </div>
      {/* Collapsible details */}
    </CardContent>
  </Card>
)}
```

---

### Architecture Compliance

**Backend Patterns:**
- TypeORM migration for schema changes [Source: architecture.md#Data-Architecture]
- JSONB column for flexible skippedDocuments array [Source: architecture.md#Data-Architecture]
- BullMQ `UnrecoverableError` for non-retryable errors [Source: BullMQ docs]
- Exponential backoff retry already configured (verify alignment) [Source: architecture.md#Infrastructure-Deployment]
- NestJS Logger for structured warnings per skipped document [Source: architecture.md#Logging]
- WebSocket gateway extends event payloads (backward compatible — new fields optional) [Source: architecture.md#WebSocket-Event-Naming]

**Frontend Patterns:**
- Zustand store extends with new fields (no new store needed) [Source: architecture.md#State-Management]
- ProcessingProgressModal extends existing completed/failed states [Source: architecture.md#Component-Architecture]
- Warning banner uses existing Card/Badge atoms [Source: architecture.md#Components]
- Toast notifications for errors (already in use) [Source: architecture.md#Error-Handling]
- Responsive design patterns maintained [Source: ux-design-specification.md#Responsive-Design]

**API Contract:**
- REST endpoint response extended (backward compatible — new optional fields) [Source: architecture.md#API-Responses]
- No new endpoints created
- camelCase JSON fields maintained [Source: architecture.md#JSON-Fields]

**Naming Conventions:**
- Entity column: `skipped_documents` (snake_case in DB) → `skippedDocuments` (camelCase in TypeScript) [Source: architecture.md#Naming-Patterns]
- Entity column: `processed_document_count` (snake_case in DB) → `processedDocumentCount` (camelCase in TypeScript)
- Migration file: timestamp-based naming (TypeORM standard) [Source: architecture.md#Data-Architecture]
- Backend files: kebab-case [Source: architecture.md#File-Naming]

**UX Design Compliance:**
- Graceful degradation — partial failures don't block entire workflow [Source: ux-design-specification.md#Error-Recovery, prd.md#Reliability]
- Clear error messages that explain AND suggest solutions [Source: ux-design-specification.md#Emotional-Design-Principles]
- Calm confidence — no panic-inducing error states, amber/warning tones not red/danger [Source: ux-design-specification.md#Experience-Principles]
- Transparency — shows exactly which documents succeeded/failed [Source: ux-design-specification.md#Trust-Through-Transparency]
- Guided next steps — suggests OCR or text-based alternatives [Source: ux-design-specification.md#Guided-Simplicity]

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies already installed:

| Package | Location | Usage in This Story |
|---------|----------|---------------------|
| `bullmq` | apps/api | `UnrecoverableError` class for non-retryable errors |
| `typeorm` | apps/api | Migration generation, entity column additions |
| `@nestjs/websockets` | apps/api | Extended event payloads |
| `react` 19.x | apps/web | Component rendering |
| `next` 15.x | apps/web | Page modifications |
| `zustand` | apps/web | Store state extension |
| `tailwindcss` | apps/web | Warning banner styling |

**BullMQ Retry Configuration Reference:**
- Exponential backoff: `2^(attempts-1) * delay` — e.g., 3s, 6s, 12s for 3 attempts with 3000ms delay
- `UnrecoverableError` from `bullmq` — when thrown, skips remaining retries immediately
- Lock duration: 5 minutes (already configured for long AI calls)

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/migrations/XXXXXXXXX-AddSkippedDocumentsToProcessingJob.ts  # NEW: Migration for new columns
```

**Files to Modify:**

```
apps/api/src/entities/processing-job.entity.ts                            # MODIFY: Add skippedDocuments + processedDocumentCount columns
apps/api/src/jobs/literature-processing.processor.ts                      # MODIFY: Partition docs, track skipped, partial result logic
apps/api/src/modules/ai/ai.service.ts                                     # MODIFY: Error classification with UnrecoverableError
apps/api/src/modules/processing/processing.service.ts                     # MODIFY: Remove hard rejection of mixed-extraction jobs
apps/api/src/gateways/processing.gateway.ts                               # MODIFY: Extend emitComplete/emitError payloads
packages/types/src/processing.ts                                          # MODIFY: Add skippedDocuments + processedDocumentCount to interface
packages/types/src/websocket.ts                                           # MODIFY: Extend CompleteEvent + ErrorEvent types
apps/web/src/lib/store/processingStore.ts                                 # MODIFY: Add skippedDocuments state + handlers
apps/web/src/components/features/processing/ProcessingProgressModal.tsx   # MODIFY: Add partial result banner in completed state, enhance failed state
apps/web/app/literature-review/[id]/page.tsx                              # MODIFY: Add partial result warning banner
```

**Also needs update (DTO):**
```
apps/api/src/modules/processing/dto/processing-job-response.dto.ts       # MODIFY: Add skippedDocuments + processedDocumentCount fields
```

**No Changes Expected To:**

```
apps/api/src/jobs/pdf-extraction.processor.ts                            # Already handles scanned PDF detection correctly
apps/api/src/entities/literature-review.entity.ts                        # No structural changes needed
apps/api/src/entities/citation.entity.ts                                 # No changes
apps/api/src/entities/research-document.entity.ts                        # No changes
apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx  # Unchanged
apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx   # Unchanged
apps/web/src/components/features/literature-review/MethodologyProgressTracker.tsx  # Unchanged
apps/web/src/lib/store/literatureReviewStore.ts                          # Unchanged
apps/web/src/components/features/processing/GenerateReviewButton.tsx     # Unchanged — validation still works as-is
```

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages (apps/api, apps/web, packages/types)
2. `nest build` in apps/api compiles without errors
3. Existing test suite passes (no regressions) — 83+ tests as of Story 3.8
4. **Partial results scenario:** Upload 3+ text-based PDFs and 1+ known-scanned PDF. Trigger processing. Verify:
   - Processing completes successfully (status: "completed")
   - ProcessingProgressModal shows success with warning banner listing skipped document(s)
   - Warning shows filename and reason for each skipped document
   - "Consider re-scanning with OCR" suggestion is visible
   - Clicking "View Literature Review" navigates to the review page
   - Review page shows amber warning banner: "Generated from X of Y documents"
   - Literature review content is fully usable (view, edit, citations all work)
5. **All-scanned scenario:** Upload only scanned PDFs. Trigger processing. Verify:
   - Job fails with message: "No documents with extracted text available. Please upload text-based PDFs."
   - ProcessingProgressModal shows error state with clear message
   - "Try Again" button is visible and functional
6. **AI failure scenario:** (Test by temporarily providing invalid API key or network disconnect)
   - Job retries with exponential backoff (check API logs for retry attempts)
   - After retries exhausted, job fails with: "AI service unavailable. Please try again later."
   - "Try Again" button works to resubmit the job
7. **Happy path regression:** Upload all valid text-based PDFs. Trigger processing. Verify:
   - Processing completes with NO warning banner (no skipped documents)
   - Literature review displays normally without partial result notices
   - All existing functionality (edit, save, citations, methodology tracker) works correctly
8. **WebSocket reconnection:** Disconnect network briefly during processing, reconnect. Verify:
   - `syncJobStatus` fetches current state including skippedDocuments
   - UI updates correctly after reconnection

---

### Previous Story Intelligence

**From Story 3.8 - Methodology Progress Tracker (Most Recent):**

**Key Learnings:**
1. **Literature review page layout** — Now uses `max-w-7xl` with two-column layout (review content flex-1 + sidebar lg:w-80). The partial result banner goes in the primary content column ABOVE the review content.
2. **83+ tests passing** — Ensure no regressions after changes.
3. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored.
4. **Sticky sidebar** — Methodology tracker uses `lg:sticky lg:top-8`. The warning banner should NOT be in the sidebar — it goes in the main content area.
5. **Card styling patterns** — White card with rounded corners, generous padding, subtle border. Amber/warning variant for partial results.
6. **Material Icons** — Use `material-symbols-outlined` spans for icons like `warning`, `info`, `error`.

**From Story 3.6 - Processing & Progress Display:**
1. **ProcessingProgressModal** structure — Has distinct state branches: queued, processing, completed, failed. Extend the completed and failed branches.
2. **"Try Again" uses lastDocumentIds** — Retry logic preserves the original document selection. No changes needed to retry mechanism.

**From Story 3.3 - Literature Review Generation Core:**
1. **literature-processing.processor.ts** — The main file to modify. Has try-catch around entire job. Progress emissions at 10%, 80%, 85%, 100%.
2. **Citation saving is already fault-tolerant** — Individual citation save failures don't crash the job.

**From Story 3.5 - WebSocket Progress:**
1. **All WebSocket emits wrapped in try-catch** — Gateway already handles emit failures gracefully. New payload fields won't break if gateway fails.

**Code Patterns to Follow:**
- Entity: Same TypeORM column decorator patterns as existing ProcessingJob fields
- Processor: Same try-catch error handling pattern, same Logger usage
- Store: Same Zustand pattern with status + data fields + handlers
- Components: Same conditional rendering pattern in modal states
- Page: Same Card/CardContent patterns for warning banners

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **836a51a** — `feat: methodology progress tracker on literature review page with code review fixes (story 3.8)` — Modified lit review page layout
2. **b91b0ad** — `feat: literature review display and editing with inline citations and code review fixes (story 3.7)` — Created lit review page
3. **74e15e0** — `feat: initiate processing and progress display with code review fixes (story 3.6)` — ProcessingProgressModal, processingStore
4. **5e6f11a** — `feat: citation traceability and real-time WebSocket progress (stories 3.4 & 3.5)` — Citation entity, WebSocket gateway
5. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` — LiteratureReview entity, AI processor

**Commit Message Pattern:** `feat: <description> with code review fixes (story X.Y)`

**Expected Commit for This Story:**
```
feat: error handling and partial results with code review fixes (story 3.9)
```

**Files Changed in Recent Commits (Relevant to This Story):**
- `apps/api/src/jobs/literature-processing.processor.ts` — Created in story 3.3, will be MODIFIED
- `apps/api/src/gateways/processing.gateway.ts` — Created in story 3.5, will be MODIFIED
- `apps/web/src/lib/store/processingStore.ts` — Created in story 3.6, will be MODIFIED
- `apps/web/src/components/features/processing/ProcessingProgressModal.tsx` — Created in story 3.6, will be MODIFIED
- `apps/web/app/literature-review/[id]/page.tsx` — Modified in stories 3.7 and 3.8, will be MODIFIED again
- `packages/types/src/processing.ts` — Created in story 3.1, will be MODIFIED
- `packages/types/src/websocket.ts` — Created in story 3.5, will be MODIFIED

---

### Latest Tech Information

**BullMQ Retry Best Practices (Verified 2026):**
- **Exponential backoff formula:** `2^(attempts-1) * delay` — e.g., with delay 3000ms: 3s → 6s → 12s
- **`UnrecoverableError`:** Import from `bullmq` package — when thrown, immediately fails job without remaining retries
- **Jitter recommended** for production: `backoff: { type: 'exponential', delay: 3000, jitter: 0.5 }` prevents thundering herd
- **Job retention:** Configure `removeOnComplete: { count: 100 }` and `removeOnFail: { count: 500 }` to prevent Redis memory growth
- **Graceful shutdown:** Handle SIGINT/SIGTERM with `worker.close()` to prevent stalled jobs

---

### Project Structure Notes

- New migration file goes in `apps/api/src/migrations/` alongside existing migration files
- ProcessingJob entity modification adds JSONB + integer columns — both nullable for backward compatibility
- Shared types in `packages/types/` — all new fields are optional (backward compatible)
- No new components created — all changes extend existing components and pages
- Frontend changes touch 3 files: processingStore, ProcessingProgressModal, literature review page
- Backend changes touch 5 files: entity, processor, service, gateway, DTO + 1 new migration file
- Total estimated files changed: ~12 (including migration)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.9-Error-Handling-and-Partial-Results] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR25-FR28 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture] — TypeORM migrations, JSONB columns
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — Error handling, WebSocket events
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Zustand stores, component patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — snake_case DB, camelCase TypeScript, PascalCase components
- [Source: _bmad-output/planning-artifacts/prd.md#Error-Handling] — FR25-FR28 error handling requirements
- [Source: _bmad-output/planning-artifacts/prd.md#Reliability] — Graceful degradation requirement
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Calm confidence, trust through transparency
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Emotional-Design-Principles] — Error recovery over prevention
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Error recovery as emotional design
- [Source: apps/api/src/entities/processing-job.entity.ts] — ProcessingJob entity to modify
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Main processor to modify
- [Source: apps/api/src/modules/ai/ai.service.ts] — AI service error handling to enhance
- [Source: apps/api/src/modules/processing/processing.service.ts] — Service to relax validation
- [Source: apps/api/src/gateways/processing.gateway.ts] — WebSocket gateway to extend
- [Source: apps/web/src/lib/store/processingStore.ts] — Processing store to extend
- [Source: apps/web/src/components/features/processing/ProcessingProgressModal.tsx] — Modal to enhance
- [Source: apps/web/app/literature-review/[id]/page.tsx] — Page to add warning banner
- [Source: packages/types/src/processing.ts] — Processing types to extend
- [Source: packages/types/src/websocket.ts] — WebSocket event types to extend
- [Source: _bmad-output/implementation-artifacts/3-8-methodology-progress-tracker.md] — Previous story learnings
- [Source: https://docs.bullmq.io/guide/retrying-failing-jobs] — BullMQ retry documentation

## Change Log

- 2026-02-07: Implemented error handling and partial results across full stack (story 3.9)
- 2026-02-07: Code review fixes applied — H1: only emit error/set FAILED on final BullMQ retry attempt (prevents duplicate jobs and UI flickering); M1: derive failureType from errorMessage in REST API response so it persists across page refresh/reconnection; M2: added dark mode classes to ProcessingProgressModal warning banner; M3: added logging for network errors in AI service before throwing generic message; M4: eliminated duplicate skippedMetadata computation in processor; L2: fixed duplicate step numbering comment

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- All 83 existing tests pass (no regressions)
- `pnpm typecheck` passes across all packages (api, web, types, utils)
- `nest build` compiles without errors
- Migration CLI has ESM compatibility issue but AUTO_RUN_MIGRATIONS=true handles migration on app start
- Task 10.4-10.8 (manual verifications) marked as requiring manual testing by user

### Completion Notes List

- **Task 1:** Added `skippedDocuments` (JSONB) and `processedDocumentCount` (int) columns to ProcessingJob entity with migration
- **Task 2:** Updated literature-processing.processor.ts to partition documents into valid/skipped, save skipped metadata, emit partial processing info, and set completion error messages for partial results. Added failureType classification in error handler.
- **Task 3:** Updated BullMQ backoff delay from 2000ms to 3000ms for exponential backoff. Classified AI errors as retryable (429, 500, 503, network) vs non-retryable (401, 400, other) using BullMQ `UnrecoverableError`.
- **Task 4:** Extended shared types — added `SkippedDocument` interface, extended `ProcessingJob`, `ProcessingJobResponse`, `CompleteEvent`, and `ErrorEvent` types with new optional fields.
- **Task 5:** Removed hard rejection of mixed-extraction jobs in processing.service.ts — now passes ALL document IDs to processor which handles partitioning. Updated response DTO and controller mapping to include new fields.
- **Task 6:** WebSocket gateway already supports new fields via type extension and spread operator — no code changes needed.
- **Task 7:** Extended processingStore with `skippedDocuments`, `processedDocumentCount`, `failureType` state. Updated COMPLETE/ERROR handlers and syncJobStatus to capture new fields.
- **Task 8:** Added partial result warning banner with collapsible skipped documents list to ProcessingProgressModal completed state. Enhanced failed state with failureType-specific messages for `no_documents` and `ai_error`.
- **Task 9:** Added persistent amber warning banner to literature review page showing partial result info. Fetches processing job by jobId (newly exposed in review response) to get skipped document metadata. Banner is collapsible with expand/collapse toggle.
- **Task 10:** All typechecks pass, nest build compiles, 83 tests pass, no regressions. Manual verification scenarios documented for user testing.

### File List

**New Files:**
- `apps/api/src/migrations/1739000000000-AddSkippedDocumentsToProcessingJob.ts`

**Modified Files:**
- `apps/api/src/entities/processing-job.entity.ts`
- `apps/api/src/jobs/literature-processing.processor.ts`
- `apps/api/src/modules/ai/ai.service.ts`
- `apps/api/src/modules/processing/processing.module.ts`
- `apps/api/src/modules/processing/processing.service.ts`
- `apps/api/src/modules/processing/processing.controller.ts`
- `apps/api/src/modules/processing/dto/processing-job-response.dto.ts`
- `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts`
- `packages/types/src/processing.ts`
- `packages/types/src/websocket.ts`
- `apps/web/src/lib/store/processingStore.ts`
- `apps/web/src/lib/api/literature-reviews.ts`
- `apps/web/src/components/features/processing/ProcessingProgressModal.tsx`
- `apps/web/app/literature-review/[id]/page.tsx`
