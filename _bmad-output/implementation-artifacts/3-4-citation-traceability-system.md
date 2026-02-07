# Story 3.4: Citation Traceability System

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want every AI-generated claim to link to its source document and exact page number,
so that I can verify the accuracy and cite sources correctly in my academic paper.

## Acceptance Criteria

1. **Given** the AI generates literature review content **When** the content is processed and saved **Then** the AI prompt explicitly requests citation metadata in a structured format **And** each synthesized claim includes: {text: "claim text", sourceDocumentId: "uuid", pageNumber: 12} **And** a `Citation` entity is created with fields: id (uuid), literature_review_id (uuid FK), document_id (uuid FK), page_number (integer), claim_text (text), position_in_review (integer), is_verified (boolean default false), user_notes (text nullable), created_at (timestamp) **And** a TypeORM migration is generated for the citations table **And** the migration creates foreign key constraints to literature_reviews and research_documents **And** an index is created on literature_review_id for query performance **And** all citations are extracted from the AI response and saved to the citations table **And** the citation data links the claim text to the source document ID and page number **And** the literature review content is rendered with inline citation references (e.g., superscript numbers or markers)

2. **Given** the AI cannot determine a page number for a specific claim **When** the citation is processed **Then** the page_number field is set to null **And** a flag indicates uncertain page accuracy (can use user_notes or a separate field) **And** the citation is still saved and linked to the document

3. **Given** a citation references a document that doesn't exist in the database **When** the citation is validated **Then** the citation is flagged with an error in the logs **And** the citation is still saved with the provided document_id for manual review **And** the job does not fail due to this issue

## Tasks / Subtasks

- [x] Task 1: Create Citation entity and migration (AC: #1)
  - [x] 1.1 Create `apps/api/src/entities/citation.entity.ts` with fields: id (uuid PK), literatureReviewId (uuid FK to literature_reviews), documentId (uuid FK to research_documents), pageNumber (integer nullable), claimText (text), positionInReview (integer), isVerified (boolean default false), userNotes (text nullable), createdAt (timestamp)
  - [x] 1.2 Create migration `apps/api/src/migrations/1738900000000-CreateCitationsTable.ts` with table `citations`, foreign keys to `literature_reviews` (CASCADE DELETE) and `research_documents` (CASCADE DELETE), index on `literature_review_id`, index on `document_id`
  - [x] 1.3 Register Citation entity in `ProcessingModule`'s `TypeOrmModule.forFeature` imports

- [x] Task 2: Create shared Citation types in @repo/types (AC: #1)
  - [x] 2.1 Create `packages/types/src/citation.ts` with `Citation` interface and `CitationResponse` DTO
  - [x] 2.2 Export from `packages/types/src/index.ts`

- [x] Task 3: Persist citations in the literature processing worker (AC: #1, #2, #3)
  - [x] 3.1 Inject `Repository<Citation>` into `LiteratureProcessingProcessor`
  - [x] 3.2 After saving the LiteratureReview entity (step 8 in processor), extract `result.citations` from the AI response
  - [x] 3.3 Map each `CitationResult` to a `Citation` entity with: literatureReviewId from saved review, documentId from citation's sourceDocumentId, pageNumber (null if AI couldn't determine), claimText from citation text, positionInReview as the citation's index in the array, isVerified defaults to false
  - [x] 3.4 Validate each citation's documentId against the processed document IDs — log warning if documentId not found in valid documents but still save the citation
  - [x] 3.5 Bulk save all Citation entities using `citationRepository.save(citations)`
  - [x] 3.6 Update progress message: 85% "Saving citations..." between review save and completion
  - [x] 3.7 Handle citation persistence errors gracefully — log error but do NOT fail the processing job (citations are supplementary to the review)

- [x] Task 4: Update ProcessingModule imports (AC: #1)
  - [x] 4.1 Add `Citation` entity to `TypeOrmModule.forFeature` in `ProcessingModule`

- [x] Task 5: Verify build and existing tests (AC: all)
  - [x] 5.1 Run `pnpm typecheck` — all packages must pass
  - [x] 5.2 Run `nest build` in apps/api — must compile without errors
  - [x] 5.3 Run existing test suite — no regressions (74/74 tests expected)
  - [x] 5.4 Verify application starts with `pnpm dev` without errors

## Dev Notes

### Story Context

This is **Story 3.4** in **Epic 3: AI-Powered Literature Review Generation**. It establishes the citation traceability system — the architectural backbone of the entire application. Citation traceability is not just a feature; it is the core trust mechanism that differentiates this product from ChatGPT and other AI tools.

**Critical Dependency Chain:**
- **Depends on:** Story 3.3 (Literature Review Generation Core) — provides LiteratureReview entity, AI processing pipeline, and `result.citations` from AiService — **STATUS: DONE**
- **Depends on:** Story 3.2 (AI Integration Setup) — provides AiService with `CitationResult[]` in response — **STATUS: DONE**
- **Depended on by:** Story 3.7 (Literature Review Display and Editing) — will render citations with inline markers and tooltip hover
- **Depended on by:** Story 4.3 (Click-to-Verify Citation Navigation) — will use citation data to navigate PDF viewer to exact page

**What's Already Built (Do NOT Recreate):**

- **AiService prompt:** Already instructs Claude to return citations in structured format with `[doc-uuid:page_number]` inline markers AND a `json:citations` JSON block [Source: `apps/api/src/modules/ai/ai.service.ts`]
- **CitationResult type:** Already exists at `packages/types/src/ai.ts` with fields: `text`, `sourceDocumentId`, `pageNumber` (nullable)
- **AI response parsing:** `AiService.parseResponse()` already extracts citations using tolerant regex (handles `json:citations`, `json`, `citations` format variants) [Source: `apps/api/src/modules/ai/ai.service.ts:114-143`]
- **Literature processing worker:** Already calls `aiService.generateLiteratureReview()` and receives `result.citations` but currently **discards them** [Source: `apps/api/src/jobs/literature-processing.processor.ts`]
- **LiteratureReview entity:** Already exists with id, userId, jobId, title, content, documentIds [Source: `apps/api/src/entities/literature-review.entity.ts`]
- **ProcessingJob entity:** Already exists with status transitions, progress tracking [Source: `apps/api/src/entities/processing-job.entity.ts`]
- **ResearchDocument entity:** Already exists with id, userId, fileName, pageCount, extractedText [Source: `apps/api/src/entities/research-document.entity.ts`]
- **Shared AI types:** `DocumentMetadata`, `LiteratureReviewResult`, `CitationResult` at `packages/types/src/ai.ts`
- **ProcessingModule:** Already imports AiModule and has TypeOrmModule.forFeature with ResearchDocument, ProcessingJob, LiteratureReview

**What This Story Actually Needs:**

1. **Citation Entity** — New TypeORM entity for the `citations` table
2. **Migration** — Database migration to create the `citations` table with foreign keys and indexes
3. **Citation Persistence** — Modify `literature-processing.processor.ts` to save citations from `result.citations` after saving the literature review
4. **Module Wiring** — Add Citation entity to ProcessingModule's TypeOrmModule.forFeature
5. **Shared Types** — Citation interface and CitationResponse DTO in `@repo/types`

**What NOT to Build:**

- Do NOT create a CitationsModule with controller/service/repository (Story 3.7 or 4.3 will handle citation API endpoints when needed)
- Do NOT create citation API endpoints (no GET /api/v1/citations needed yet)
- Do NOT modify the AI prompt or AiService (already produces structured citations)
- Do NOT implement citation editing/correction UI (Story 3.7)
- Do NOT implement click-to-verify citation navigation (Story 4.3)
- Do NOT create frontend components for citation display (Story 3.7)
- Do NOT implement bibliography export (Story 3.10)
- Do NOT install any new npm packages (all dependencies already present)
- Do NOT modify frontend code (no frontend changes in this story)
- Do NOT create a separate NestJS module for citations — keep it within ProcessingModule since citation persistence is part of the processing pipeline

---

### Technical Requirements

**Citation Entity Pattern:**

Follow the exact same entity pattern as `LiteratureReview` and `ProcessingJob`:

```typescript
// apps/api/src/entities/citation.entity.ts
import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn, Index,
} from 'typeorm';
import { LiteratureReview } from './literature-review.entity';
import { ResearchDocument } from './research-document.entity';

@Entity('citations')
export class Citation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'literature_review_id', type: 'uuid' })
  @Index('idx_citations_literature_review_id')
  literatureReviewId: string;

  @ManyToOne(() => LiteratureReview, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'literature_review_id' })
  literatureReview: LiteratureReview;

  @Column({ name: 'document_id', type: 'uuid' })
  @Index('idx_citations_document_id')
  documentId: string;

  @ManyToOne(() => ResearchDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: ResearchDocument;

  @Column({ name: 'page_number', type: 'integer', nullable: true })
  pageNumber: number | null;

  @Column({ name: 'claim_text', type: 'text' })
  claimText: string;

  @Column({ name: 'position_in_review', type: 'integer' })
  positionInReview: number;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'user_notes', type: 'text', nullable: true })
  userNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

**Migration Pattern (follow `CreateLiteratureReviewsTable` exactly):**

```typescript
// apps/api/src/migrations/1738900000000-CreateCitationsTable.ts
// - UUID primary key with uuid_generate_v4() default
// - Foreign keys to literature_reviews (CASCADE DELETE) and research_documents (CASCADE DELETE)
// - Indexes on literature_review_id AND document_id
// - page_number is INTEGER NULLABLE (null = uncertain page)
// - claim_text is TEXT NOT NULL
// - position_in_review is INTEGER NOT NULL
// - is_verified BOOLEAN DEFAULT false
// - user_notes TEXT NULLABLE
// - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Citation Persistence in Worker:**

The existing `literature-processing.processor.ts` saves the LiteratureReview at step 8 and marks complete at step 9. Insert citation persistence between steps 8 and 9:

```typescript
// After step 8 (saving literature review) and before step 9 (marking complete):

// 8.5 Save citations
await this.processingJobRepository.update(processingJobId, {
  progressPercentage: 85,
  progressMessage: 'Saving citations...',
});

if (result.citations && result.citations.length > 0) {
  const validDocIds = new Set(validDocs.map(d => d.id));

  const citationEntities = result.citations.map((citation, index) => {
    // Validate document reference
    if (!validDocIds.has(citation.sourceDocumentId)) {
      this.logger.warn(
        `Citation references unknown document ${citation.sourceDocumentId} - saving anyway for manual review`,
        'LiteratureProcessingProcessor',
      );
    }

    return this.citationRepository.create({
      literatureReviewId: saved.id,
      documentId: citation.sourceDocumentId,
      pageNumber: citation.pageNumber, // null if AI couldn't determine
      claimText: citation.text,
      positionInReview: index,
      isVerified: false,
      userNotes: citation.pageNumber === null ? 'Page number uncertain' : null,
    });
  });

  try {
    await this.citationRepository.save(citationEntities);
    this.logger.log(
      `Saved ${citationEntities.length} citations for review ${saved.id}`,
      'LiteratureProcessingProcessor',
    );
  } catch (citationError) {
    // Citation persistence failure should NOT fail the job
    this.logger.error(
      `Failed to save citations for review ${saved.id}: ${citationError}`,
      (citationError as Error).stack,
      'LiteratureProcessingProcessor',
    );
  }
}
```

**Important: Citation persistence is non-blocking** — If citation save fails, the literature review itself is still valid. Log the error but do NOT re-throw or fail the job.

**Important: Document ID validation** — Some citations may reference documents the AI hallucinated or misidentified. Log a warning but save the citation anyway. The foreign key constraint to `research_documents` will cause the save to fail for truly invalid UUIDs — catch this per-citation if needed, or wrap the bulk save in a try-catch.

**Important: Handling FK constraint violations** — If a citation references a document_id that doesn't exist in `research_documents`, the FK constraint will reject it. Two approaches:
1. **Filter approach (recommended):** Before saving, filter out citations with invalid document IDs and log warnings for filtered ones
2. **Individual save approach:** Save citations one-by-one, catching FK violations per citation

Use the filter approach for simplicity — validate `citation.sourceDocumentId` exists in the `documents` array fetched earlier (which already exists in `validDocs`). For citations referencing documents that were in the original `documentIds` but excluded from processing (e.g., no extracted text), they should still be saved if the document exists in the database. To handle this correctly:
- Build a set of ALL document IDs from the `documents` query (not just `validDocs`)
- Filter citations to only those referencing IDs in this set
- Log warnings for any filtered-out citations

---

### Architecture Compliance

**NestJS Module Organization:**

- `Citation` entity added to `ProcessingModule`'s `TypeOrmModule.forFeature` imports
- No new module needed — Citation persistence is part of the processing pipeline
- No new controller or service — citations are saved within the existing processor worker
- Future stories (3.7, 4.3) may create a `CitationsModule` with controller/service for API endpoints

**Database Schema:**

- Table name: `citations` (snake_case, plural)
- Column names: `literature_review_id`, `document_id`, `page_number`, `claim_text`, `position_in_review`, `is_verified`, `user_notes`, `created_at` (snake_case)
- TypeScript properties: `literatureReviewId`, `documentId`, `pageNumber`, `claimText`, `positionInReview`, `isVerified`, `userNotes`, `createdAt` (camelCase)
- Foreign keys: CASCADE DELETE on both literature_review and research_document
- Indexes: `idx_citations_literature_review_id`, `idx_citations_document_id`

**API Endpoint Patterns:**

No new endpoints in this story. Citations are saved within the existing BullMQ processing pipeline.

**Naming Conventions:**

- Entity file: `citation.entity.ts` (kebab-case)
- Class name: `Citation` (PascalCase)
- Table name: `citations` (snake_case)
- Migration file: `1738900000000-CreateCitationsTable.ts`

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies are already installed:

| Package | Version | Status | Usage |
|---------|---------|--------|-------|
| `typeorm` | installed | Already installed | ORM for entities/migrations |
| `@nestjs/typeorm` | installed | Already installed | TypeORM NestJS integration |
| `@nestjs/bullmq` | installed | Already installed | BullMQ queue integration |
| `bullmq` | installed | Already installed | Queue/worker primitives |

**TypeORM Notes:**

- `repository.create()` + `repository.save()` for bulk entity creation
- `repository.save(arrayOfEntities)` for bulk insert — TypeORM handles this efficiently
- FK constraint violations will throw `QueryFailedError` — catch specifically if filtering approach misses edge cases
- `@Index` decorator on entity columns creates database indexes via migration

**Existing AI Types (No Changes Needed):**

The `CitationResult` interface at `packages/types/src/ai.ts` already provides the data structure returned from the AI:
```typescript
interface CitationResult {
  text: string;
  sourceDocumentId: string;
  pageNumber: number | null;
}
```

This maps to the Citation entity as:
- `text` → `claimText`
- `sourceDocumentId` → `documentId`
- `pageNumber` → `pageNumber`

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/
├── entities/
│   └── citation.entity.ts                    # NEW: Citation TypeORM entity
└── migrations/
    └── 1738900000000-CreateCitationsTable.ts  # NEW: Migration for citations table

packages/types/src/
└── citation.ts                                # NEW: Shared Citation types
```

**Files to Modify:**

```
apps/api/src/
├── jobs/
│   └── literature-processing.processor.ts     # MODIFY: Add citation persistence after review save
└── modules/
    └── processing/
        └── processing.module.ts               # MODIFY: Add Citation entity to TypeOrmModule.forFeature

packages/types/src/
└── index.ts                                   # MODIFY: Export Citation types
```

**No Changes Expected To:**

```
apps/web/                                          # No frontend changes
apps/api/src/modules/ai/                           # AiService unchanged (already returns citations)
apps/api/src/modules/documents/                    # Documents unchanged
apps/api/src/modules/auth/                         # Auth unchanged
apps/api/src/entities/literature-review.entity.ts  # Entity unchanged
apps/api/src/entities/processing-job.entity.ts     # Entity unchanged
apps/api/src/entities/research-document.entity.ts  # Entity unchanged
apps/api/src/config/                               # Config files unchanged
apps/api/src/app.module.ts                         # Root module unchanged
apps/api/package.json                              # No new packages
packages/types/src/ai.ts                           # CitationResult unchanged
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors
3. Existing test suite passes (74/74 tests, no regressions)
4. `pnpm dev` starts both apps without errors
5. Migration can be run against the database (`pnpm migration:run`)
6. The `citations` table is created with correct schema (FK constraints, indexes, nullable fields)
7. (Integration test, if possible): Queue a job with valid document IDs and verify Citation records are created alongside the LiteratureReview record, with correct document ID and page number linkage

---

### Previous Story Intelligence

**From Story 3.3 - Literature Review Generation Core:**

**Key Learnings:**
1. **Citations are already extracted but not persisted** — `result.citations` is a `CitationResult[]` available in the processor after AI call, but currently discarded after saving only the LiteratureReview
2. **Worker pattern established** — Inject repository via constructor, use `this.repository.create()` + `this.repository.save()`, update progress between steps
3. **Progress tracking pattern** — Update `ProcessingJob.progressPercentage` and `progressMessage` fields at each stage (10%, 80%, 100%)
4. **Error handling pattern** — Try-catch around processing logic, update job to FAILED status on error, re-throw for BullMQ retry
5. **Code review finding H2** — `documentIds` should use only *actually processed* IDs, not all requested IDs — apply same logic to citation document validation
6. **Code review finding H3** — Empty input validation added as early guard — citation persistence should also guard against empty citations array
7. **Module wiring pattern** — Add entity to `TypeOrmModule.forFeature` in the module, import dependent modules
8. **Local enum pattern** — If runtime enums needed, define locally in entity file (though Citation has no enums)
9. **Migration timestamp** — Latest is `1738800000000`, new migration should use `1738900000000`

**From Story 3.2 - AI Integration Setup:**

**Key Learnings:**
1. **AiService.parseResponse() is tolerant** — Uses regex to match multiple JSON block format variants for citation extraction
2. **Shared types via import type** — Use `import type { ... } from '@repo/types'` for TypeScript-only imports at compile time
3. **Pre-existing issue** — `pnpm start` has a multer module resolution error in `documents.controller.js` — unrelated, do not attempt to fix

**Code Patterns to Follow:**
- Same entity pattern (snake_case columns with camelCase TypeScript properties, UUID PK, ManyToOne with CASCADE DELETE)
- Same logging pattern (`this.logger.warn/log/error` with class context)
- Same migration pattern (Table creation with explicit column definitions, indexes, foreign keys, uuid_generate_v4() default)
- Same module wiring (add entity to forFeature array)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` (Story 3.3) — Created LiteratureReview entity, migration, processing logic, module wiring
2. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` (Story 3.2) — Created AiService, AiModule, shared AI types
3. **2f8bc61** — `feat: processing jobs infrastructure with BullMQ migration and code review fixes` (Story 3.1) — Created ProcessingJob entity, BullMQ setup
4. **cc21320** — `feat: document list view and remove document with code review fixes` (Stories 2.6/2.7)
5. **c8d9599** — `feat: drag-and-drop upload interface with code review fixes` (Story 2.5)

**Commit Message Pattern:** `feat: <description> and code review fixes`

**Files Changed in Story 3.3 (most relevant precedent):**
- Created: `literature-review.entity.ts`, `1738800000000-CreateLiteratureReviewsTable.ts`, `packages/types/src/literature-review.ts`
- Modified: `literature-processing.processor.ts`, `processing.module.ts`, `packages/types/src/index.ts`

**Expected Commit for This Story:**
```
feat: citation traceability system with Citation entity, migration, and citation persistence
```

---

### Latest Technology Information

**TypeORM Bulk Save:**
- `repository.save(arrayOfEntities)` performs bulk insert efficiently
- For large arrays (100+ items), consider chunking — but for citations (typically 10-50 per review), single bulk save is fine
- FK constraint violations throw `QueryFailedError` — catch and handle gracefully

**Anthropic SDK Citation Output:**
- Current model `claude-sonnet-4-5-20250929` reliably returns citation JSON blocks when instructed
- Page number accuracy depends on text extraction quality — AI may return null for uncertain pages
- Citation `sourceDocumentId` should match document UUIDs provided in the prompt context — AI occasionally generates invalid IDs, hence the validation step

**BullMQ Progress Tracking:**
- Adding citation persistence between review save (80%) and completion (100%) is safe
- New progress step at 85% fits naturally in the existing flow
- If citation persistence fails, the job should still complete at 100% — non-blocking

---

### Project Structure Notes

- Citation entity at `apps/api/src/entities/citation.entity.ts` — consistent with existing entity locations
- Migration at `apps/api/src/migrations/1738900000000-CreateCitationsTable.ts` — timestamp follows after LiteratureReviews migration (1738800000000)
- No new NestJS module — Citation is part of `ProcessingModule` (same domain: processing pipeline produces citations alongside reviews)
- Citation entity registered in ProcessingModule's TypeOrmModule.forFeature
- Shared types at `packages/types/src/citation.ts` — follows domain-based type organization
- No changes to `app.module.ts` — no new module registration needed

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.4-Citation-Traceability-System] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR11-FR15 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture] — PostgreSQL with TypeORM, migration strategy
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Naming conventions, entity patterns, module organization
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-Boundaries] — FR11-FR15 structure mapping (citations module, entity, shared types)
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] — FR11, FR12, FR13, FR14, FR15 requirements
- [Source: _bmad-output/planning-artifacts/prd.md#Innovation-Novel-Patterns] — Citation traceability as core differentiator
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Click-to-verify as trust mechanism
- [Source: apps/api/src/modules/ai/ai.service.ts] — AiService with citation extraction in parseResponse()
- [Source: apps/api/src/modules/ai/ai.service.ts:12-27] — System prompt with citation format instructions
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Existing processor (citations currently discarded after result.citations)
- [Source: apps/api/src/entities/literature-review.entity.ts] — LiteratureReview entity pattern reference
- [Source: apps/api/src/entities/research-document.entity.ts] — ResearchDocument entity (FK target for citations)
- [Source: apps/api/src/modules/processing/processing.module.ts] — ProcessingModule with entity registration
- [Source: apps/api/src/migrations/1738800000000-CreateLiteratureReviewsTable.ts] — Migration pattern reference
- [Source: packages/types/src/ai.ts] — CitationResult interface (text, sourceDocumentId, pageNumber)
- [Source: _bmad-output/implementation-artifacts/3-3-literature-review-generation-core.md] — Previous story learnings, code patterns, review findings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No debug issues encountered during implementation.

### Completion Notes List

- Created Citation entity following exact same pattern as LiteratureReview entity (snake_case columns, camelCase TS properties, UUID PK, ManyToOne with CASCADE DELETE)
- Created migration with table `citations`, FK constraints to `literature_reviews` (CASCADE) and `research_documents` (CASCADE), indexes on `literature_review_id` and `document_id`
- Registered Citation entity in ProcessingModule's TypeOrmModule.forFeature
- Created shared Citation and CitationResponse types in `@repo/types` and exported from index.ts
- Modified `literature-processing.processor.ts` to persist citations between review save (step 8) and completion (step 9)
- Citation persistence uses filter approach: validates document IDs against ALL documents fetched from DB (not just validDocs) to prevent FK constraint violations
- Citations referencing documents with no extracted text still saved (they exist in DB), with a warning log
- Citations referencing unknown documents (not in DB) are filtered out to prevent FK violations, with warning logs
- Citation persistence is non-blocking: errors are caught and logged but do NOT fail the processing job
- Page number null handling: sets `userNotes = 'Page number uncertain'` when AI couldn't determine page
- Progress step at 85% "Saving citations..." added between review save and completion
- Typecheck passes for all packages, nest build compiles, 74/74 tests pass with no regressions

### Change Log

- 2026-02-07: Implemented citation traceability system — Citation entity, migration, shared types, and citation persistence in literature processing worker
- 2026-02-07: Code review fixes — (H1) Fixed positionInReview to use original array index instead of post-filter index, (H2) Changed bulk citation save to individual save to prevent one FK violation from losing all valid citations, (M1) Added sprint-status.yaml to File List

### File List

**New Files:**
- `apps/api/src/entities/citation.entity.ts` — Citation TypeORM entity
- `apps/api/src/migrations/1738900000000-CreateCitationsTable.ts` — Migration for citations table
- `packages/types/src/citation.ts` — Shared Citation and CitationResponse types

**Modified Files:**
- `apps/api/src/jobs/literature-processing.processor.ts` — Added Citation import, citationRepository injection, citation persistence logic (step 8.5)
- `apps/api/src/modules/processing/processing.module.ts` — Added Citation entity import and TypeOrmModule.forFeature registration
- `packages/types/src/index.ts` — Added Citation type exports
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated 3-4-citation-traceability-system status to review
