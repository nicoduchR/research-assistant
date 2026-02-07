# Story 3.2: AI Integration Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to integrate the Anthropic Claude SDK,
so that the application can call Claude API for literature review synthesis.

## Acceptance Criteria

1. **Given** the API infrastructure is set up **When** I integrate the Anthropic Claude SDK **Then** the `@anthropic-ai/sdk` package is installed (already present at ^0.72.1)

2. **Given** the SDK is available **When** I create an AI service module **Then** an AI service module is created in the NestJS application **And** the service is properly structured with dependency injection using NestJS patterns

3. **Given** the AI service exists **When** I configure it **Then** the service is configured with the Anthropic API key from environment variables via ConfigService **And** the Anthropic client is initialized using the existing `getAnthropicClient()` factory in `apps/api/src/config/anthropic.config.ts`

4. **Given** the AI service is configured **When** I create a health check endpoint **Then** a test endpoint `GET /api/v1/ai/health` verifies API connectivity **And** the endpoint returns a success response when the API key is valid and Claude is reachable **And** the endpoint returns an error response with details when connectivity fails

5. **Given** the API has rate limiting configured **When** AI processing endpoints are accessed **Then** rate limiting is configured using `@nestjs/throttler` (5 req/min for AI processing endpoints) **And** the throttle decorator is applied to the AI controller

6. **Given** the AI service exists **When** I implement the core method **Then** the AI service has a method `generateLiteratureReview(documents, extractedTexts)` that accepts document metadata and extracted text content **And** the method constructs a prompt instructing Claude to generate a structured literature review **And** the method returns the structured response from Claude

7. **Given** the AI service is operational **When** environment variables are checked **Then** API key configuration is documented in `.env.example` (already present as `ANTHROPIC_API_KEY`)

8. **Given** the AI service makes API calls **When** errors occur **Then** error handling wraps all AI API calls with try-catch and logging **And** different error types are handled appropriately (auth errors, rate limits, timeouts, service unavailable) **And** errors are logged with context (job ID, document count, error type)

## Tasks / Subtasks

- [x] Task 1: Create AI Module structure (AC: #2, #3)
  - [x] 1.1 Create `apps/api/src/modules/ai/ai.module.ts` with ConfigModule import and provider/export of AiService
  - [x] 1.2 Create `apps/api/src/modules/ai/ai.service.ts` with Anthropic client initialization via `getAnthropicClient()` from existing config
  - [x] 1.3 Register AiModule in `apps/api/src/app.module.ts`

- [x] Task 2: Implement AI Health Check endpoint (AC: #4, #5)
  - [x] 2.1 Create `apps/api/src/modules/ai/ai.controller.ts` with `GET /api/v1/ai/health` endpoint
  - [x] 2.2 Implement health check that sends a minimal message to Claude API and verifies response
  - [x] 2.3 Apply `@UseGuards(JwtAuthGuard)` to protect the endpoint (authenticated users only)
  - [x] 2.4 Apply `@Throttle({ default: { ttl: 60000, limit: 5 } })` rate limiting to the controller

- [x] Task 3: Implement `generateLiteratureReview` method (AC: #6, #8)
  - [x] 3.1 Define input interface: `GenerateLiteratureReviewInput` with `documents` array (id, fileName, pageCount) and `extractedTexts` map (documentId -> text content)
  - [x] 3.2 Define output interface: `LiteratureReviewResult` with `title`, `content` (structured markdown), `citations` array (each with `text`, `sourceDocumentId`, `pageNumber`)
  - [x] 3.3 Implement prompt construction that instructs Claude to: synthesize a structured literature review, identify themes, group related arguments, and return citation metadata with source document IDs and page numbers in a parseable format
  - [x] 3.4 Call `client.messages.create()` with model `claude-sonnet-4-5-20250929`, appropriate max_tokens (4096), and structured prompt
  - [x] 3.5 Parse Claude's response to extract the literature review content and citation metadata
  - [x] 3.6 Implement comprehensive error handling with try-catch wrapping all API calls

- [x] Task 4: Add shared AI types to @repo/types (AC: #6)
  - [x] 4.1 Create `packages/types/src/ai.ts` with `GenerateLiteratureReviewInput`, `LiteratureReviewResult`, `CitationResult`, and `AiHealthResponse` interfaces
  - [x] 4.2 Export from `packages/types/src/index.ts`

- [x] Task 5: Verify environment and documentation (AC: #1, #7)
  - [x] 5.1 Verify `@anthropic-ai/sdk` is already installed in `apps/api/package.json` (^0.72.1 - no action needed)
  - [x] 5.2 Verify `ANTHROPIC_API_KEY` is already in `apps/api/.env.example` (no action needed)
  - [x] 5.3 Verify application builds successfully (`pnpm typecheck` + `nest build` pass)
  - [x] 5.4 Verify health endpoint responds correctly with valid/invalid API keys

## Dev Notes

### Story Context

This is **Story 3.2** in **Epic 3: AI-Powered Literature Review Generation**. It sets up the Anthropic Claude SDK integration as a NestJS service module, providing the AI backbone that Story 3.3 (Literature Review Generation Core) will consume through the BullMQ worker pipeline established in Story 3.1.

**Critical Dependency Chain:**
- **Depends on:** Story 3.1 (Processing Jobs Infrastructure) - completed, provides BullMQ queue infrastructure
- **Depended on by:** Story 3.3 (Literature Review Generation Core) - will inject AiService into the literature-processing worker to actually generate reviews
- **Depended on by:** Story 3.4 (Citation Traceability System) - will use citation output format from AiService

**What's Already Built (Do NOT Recreate):**

- **Anthropic SDK package:** `@anthropic-ai/sdk@^0.72.1` already installed in `apps/api/package.json`
- **Anthropic config factory:** `apps/api/src/config/anthropic.config.ts` — `getAnthropicClient(configService)` creates and returns an Anthropic client instance
- **Environment variable:** `ANTHROPIC_API_KEY` already in `.env.example` and `.env`
- **BullMQ infrastructure:** Story 3.1 completed — `literature-processing` queue and placeholder processor exist
- **Literature processor:** `apps/api/src/jobs/literature-processing.processor.ts` — has status transition logic, placeholder for actual AI processing
- **Rate limiter:** `@nestjs/throttler@^6.5.0` already installed and presumably configured
- **Swagger:** `@nestjs/swagger@^11.2.5` already installed for API documentation decorators

**What This Story Actually Needs:**

1. **AI Service Module** (`AiModule` + `AiService`) — NestJS module wrapping the Anthropic client with `generateLiteratureReview()` method
2. **AI Controller** — Health check endpoint at `/api/v1/ai/health` with rate limiting
3. **Prompt Engineering** — Structured prompt for literature review synthesis with citation extraction
4. **Response Parsing** — Parse Claude's response into structured `LiteratureReviewResult` with citations
5. **Error Handling** — Comprehensive error handling for all AI API call failure modes
6. **Shared Types** — AI-specific types in `@repo/types`

**What NOT to Build:**

- Do NOT implement the full processing pipeline (Story 3.3 connects AiService to BullMQ worker)
- Do NOT create LiteratureReview or Citation entities (Stories 3.3/3.4)
- Do NOT implement WebSocket progress updates (Story 3.5)
- Do NOT create processing API endpoints beyond the health check (Story 3.6)
- Do NOT modify the literature-processing.processor.ts (Story 3.3 will inject AiService there)
- Do NOT implement streaming responses (not needed for MVP — batch processing via BullMQ)
- Do NOT install any new packages (all dependencies already present)
- Do NOT modify frontend code (no frontend changes in this story)

---

### Technical Requirements

**AI Service Architecture:**

The AI service follows NestJS dependency injection patterns. The existing `getAnthropicClient()` factory in `anthropic.config.ts` should be used to create the client instance.

```typescript
// apps/api/src/modules/ai/ai.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient } from '../../config/anthropic.config';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private client: Anthropic;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = getAnthropicClient(this.configService);
    this.logger.log('Anthropic AI client initialized');
  }

  async checkHealth(): Promise<{ status: string; model: string }> {
    // Send minimal message to verify connectivity
  }

  async generateLiteratureReview(
    documents: DocumentMetadata[],
    extractedTexts: Map<string, string>,
  ): Promise<LiteratureReviewResult> {
    // Construct prompt, call Claude, parse response
  }
}
```

**Anthropic SDK Usage Pattern (v0.72.x):**

```typescript
const message = await this.client.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  messages: [{ role: 'user', content: prompt }],
});

// Response structure:
// message.content[0].text — the text response
// message.usage.input_tokens / message.usage.output_tokens — token usage
// message.stop_reason — 'end_turn', 'max_tokens', 'stop_sequence'
```

**Important SDK Notes (2026):**
- The `output_format` parameter has been moved to `output_config.format` in newer API versions
- Fine-grained tool streaming is now GA (no beta header required) — but NOT needed for this story
- The SDK defaults to reading `ANTHROPIC_API_KEY` from env, but we explicitly pass it via `getAnthropicClient()`
- For batch processing (our use case), standard `client.messages.create()` is sufficient — no streaming needed

**Prompt Engineering Strategy:**

The prompt must instruct Claude to:
1. Synthesize a structured literature review from multiple PDF texts
2. Identify themes and group related arguments across documents
3. Include inline citation references for every claim
4. Return citation metadata in a structured, parseable format (JSON block at end or structured markers)

Recommended approach: Use a system prompt defining the output format, then a user prompt with the document texts. Request a JSON-structured response for citations to ensure reliable parsing.

```typescript
const systemPrompt = `You are an academic research assistant specializing in literature review synthesis.
Your task is to create a structured literature review from the provided research documents.

OUTPUT FORMAT:
1. A structured literature review in markdown with inline citation markers like [DOC_ID:PAGE]
2. After the review content, a JSON block with citation metadata

CITATION FORMAT in the review text:
Use markers like [doc-uuid:page_number] inline with claims.

After the review, output a JSON block:
\`\`\`json:citations
[
  {"text": "claim text", "sourceDocumentId": "doc-uuid", "pageNumber": 12}
]
\`\`\`
`;
```

**Error Handling Strategy:**

```typescript
try {
  const message = await this.client.messages.create({...});
  // Process response
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    switch (error.status) {
      case 401:
        this.logger.error('Invalid Anthropic API key');
        throw new Error('AI service authentication failed');
      case 429:
        this.logger.warn('Anthropic rate limit exceeded');
        throw new Error('AI service rate limited - please retry later');
      case 500:
      case 503:
        this.logger.error('Anthropic service unavailable');
        throw new Error('AI service temporarily unavailable');
      default:
        this.logger.error(`Anthropic API error: ${error.status} ${error.message}`);
        throw new Error(`AI service error: ${error.message}`);
    }
  }
  throw error;
}
```

**Model Selection:**

Use `claude-sonnet-4-5-20250929` for literature review generation. Sonnet provides the best balance of quality and cost for this use case. The model string should be configurable via environment variable with this as the default:

```typescript
const model = this.configService.get<string>('ANTHROPIC_MODEL', 'claude-sonnet-4-5-20250929');
```

---

### Architecture Compliance

**NestJS Module Organization:**

- Create new `AiModule` at `apps/api/src/modules/ai/` — self-contained module with controller + service
- Register in `app.module.ts` imports array
- Export `AiService` so `ProcessingModule` can inject it in Story 3.3
- Follow existing module patterns (see `DocumentsModule`, `ProcessingModule`)

**API Endpoint Patterns (MUST follow exactly):**

- Base URL: `/api/v1/ai/health` — follows `/api/v1/{resource}` convention
- Response format: Direct data object (no wrapper), camelCase fields
- Error format: Standardized with `statusCode`, `message`, `error`, `timestamp`, `path`
- Authentication: `@UseGuards(JwtAuthGuard)` on controller
- Rate limiting: `@Throttle()` decorator on controller

**Naming Conventions:**

- Backend files: kebab-case (`ai.module.ts`, `ai.service.ts`, `ai.controller.ts`)
- Class names: PascalCase (`AiService`, `AiController`, `AiModule`)
- Methods: camelCase (`generateLiteratureReview`, `checkHealth`)
- Constants: SCREAMING_SNAKE_CASE if needed (`DEFAULT_MAX_TOKENS`)
- Shared types: Domain-based in `packages/types/src/ai.ts`

**Swagger Documentation:**

Apply `@nestjs/swagger` decorators to the controller and DTOs:
- `@ApiTags('ai')` on controller
- `@ApiOperation()` on endpoints
- `@ApiResponse()` for success and error responses

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies are already installed:

| Package | Version | Status | Usage |
|---------|---------|--------|-------|
| `@anthropic-ai/sdk` | ^0.72.1 | Already installed | Anthropic Claude SDK |
| `@nestjs/throttler` | ^6.5.0 | Already installed | Rate limiting |
| `@nestjs/swagger` | ^11.2.5 | Already installed | API documentation |
| `@nestjs/config` | ^4.0.2 | Already installed | Environment config |

**No Frontend Package Changes.**

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/
└── modules/
    └── ai/
        ├── ai.module.ts          # NEW: AI module with ConfigModule, exports AiService
        ├── ai.service.ts         # NEW: AiService with generateLiteratureReview() and checkHealth()
        └── ai.controller.ts      # NEW: Health check endpoint with rate limiting

packages/types/src/
└── ai.ts                         # NEW: Shared AI types (GenerateLiteratureReviewInput, LiteratureReviewResult, etc.)
```

**Files to Modify:**

```
apps/api/src/
└── app.module.ts                 # MODIFY: Add AiModule to imports

packages/types/src/
└── index.ts                      # MODIFY: Export AI types
```

**No Changes Expected To:**

```
apps/web/                                          # No frontend changes
apps/api/src/config/anthropic.config.ts            # Keep as-is (already has getAnthropicClient)
apps/api/src/entities/                             # No new entities
apps/api/src/migrations/                           # No new migrations
apps/api/src/jobs/literature-processing.processor.ts  # Story 3.3 will modify this
apps/api/src/modules/processing/                   # No changes
apps/api/src/modules/documents/                    # No changes
apps/api/src/modules/auth/                         # No changes
apps/api/package.json                              # No new packages
apps/api/.env.example                              # Already has ANTHROPIC_API_KEY
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm dev` starts both apps without errors
2. NestJS logs show "Anthropic AI client initialized" on startup
3. `GET /api/v1/ai/health` with valid JWT returns `{ "status": "ok", "model": "claude-sonnet-4-5-20250929" }` (or similar)
4. `GET /api/v1/ai/health` without JWT returns 401
5. `GET /api/v1/ai/health` more than 5 times in 60 seconds returns 429
6. With invalid `ANTHROPIC_API_KEY`, health endpoint returns appropriate error
7. TypeScript compilation passes (`pnpm typecheck`)
8. No regressions on existing tests

---

### Previous Story Intelligence

**From Story 3.1 - Processing Jobs Infrastructure:**

**Key Learnings:**
1. **BullMQ migration completed** — All processors now use `WorkerHost` pattern with `@nestjs/bullmq`. AiService does NOT use BullMQ directly — it's a plain NestJS injectable service.
2. **Literature processing processor exists** — `apps/api/src/jobs/literature-processing.processor.ts` has status transition logic (queued->processing->completed/failed) but placeholder processing body. Story 3.3 will inject AiService here.
3. **ProcessingJob entity** — Entity with status enum, documentIds (jsonb), resultId, progress fields. AiService doesn't interact with this directly.
4. **Local enum pattern** — `ProcessingJobStatus` enum is defined locally in the entity file AND in `@repo/types/processing.ts`. The local copy is kept because `@repo/types` serves raw TypeScript and extensionless imports fail under Node.js ESM at runtime. Follow same pattern if needed for AI types.

**Code Review Patterns Established:**
- Status transition infrastructure in processors (H1 fix)
- `@UpdateDateColumn` on entities with `updated_at` (M1 fix)
- CHECK constraints on JSONB columns (M3 fix)
- Error re-throwing pattern: catch, update DB with error state, then re-throw for retry

**Patterns to Preserve:**
- Same module pattern (Module → Controller → Service with DI)
- Same logging pattern (`private readonly logger = new Logger(ClassName.name)`)
- Same error handling pattern (try-catch, log error with context, throw typed error)
- Same import patterns (`@nestjs/common`, `@nestjs/config`, etc.)
- Same Swagger decorator patterns on controllers

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **2f8bc61** - "feat: processing jobs infrastructure with BullMQ migration and code review fixes" (Story 3.1)
2. **cc21320** - "feat: document list view and remove document with code review fixes" (Stories 2.6/2.7)
3. **c8d9599** - "feat: drag-and-drop upload interface with code review fixes" (Story 2.5)
4. **e18f933** - "fix: pdf-parse v2 API migration and Story 2.4 uncommitted changes" (Story 2.4 fix)
5. **4d9a9cd** - "feat: pdf text extraction pipeline" (Story 2.4)

**Patterns Observed:**
- Commit messages follow `feat:` / `fix:` conventional commits
- Code review fixes bundled into same commit as feature
- Stories committed as single atomic commits
- Backend-only stories don't include frontend changes

**Files Created in Story 3.1 (Most Relevant Previous Story):**
- `apps/api/src/entities/processing-job.entity.ts` — entity pattern reference
- `apps/api/src/jobs/literature-processing.processor.ts` — future consumer of AiService
- `apps/api/src/migrations/1738620000000-CreateProcessingJobsTable.ts` — migration pattern
- `packages/types/src/processing.ts` — shared types pattern

**Expected Commit for This Story:**
```
feat: AI integration setup with Anthropic Claude SDK service

- Create AiModule with AiService wrapping Anthropic Claude SDK
- Implement generateLiteratureReview() method with prompt engineering
- Add /api/v1/ai/health endpoint with rate limiting
- Add shared AI types to @repo/types
- Comprehensive error handling for all API call failure modes
```

---

### Latest Technology Information

**@anthropic-ai/sdk (v0.72.x — already installed):**

- Uses `client.messages.create()` for standard message generation
- Model string: `claude-sonnet-4-5-20250929` for Sonnet 4.5
- Response: `message.content[0].text` for text content, `message.usage` for token counts
- Error types: `Anthropic.APIError` with `.status` for HTTP status codes
- The SDK auto-reads `ANTHROPIC_API_KEY` from env but project explicitly passes via config
- `max_tokens` is required parameter (no default)
- `stop_reason` indicates why generation stopped (`end_turn`, `max_tokens`, `stop_sequence`)

**2026 API Changes:**
- `output_format` parameter moved to `output_config.format` for structured outputs
- Fine-grained tool streaming is GA (no beta header) — not relevant for batch processing
- Data residency controls available via `inference_geo` parameter — not needed for MVP
- 1M token context window available in beta for Opus 4.6 — may be useful for very large document sets

**Model Selection Rationale:**
- `claude-sonnet-4-5-20250929` — Best balance of quality, speed, and cost for literature review synthesis
- Supports up to 200K context window (sufficient for multiple academic papers)
- Structured output support available but standard text response with JSON block parsing is simpler and sufficient

---

### Project Structure Notes

- Alignment with architecture: AiModule follows NestJS modular architecture pattern with controller + service
- New module at `apps/api/src/modules/ai/` — consistent with existing module locations (auth, documents, processing)
- AiService exported for injection by ProcessingModule in Story 3.3
- No database entities needed — this story is pure service integration
- No migrations needed — no schema changes
- Existing `anthropic.config.ts` factory reused — no configuration duplication
- Rate limiting via `@nestjs/throttler` consistent with architecture spec (5 req/min for AI processing)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.2-AI-Integration-Setup]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core-Architectural-Decisions] — Anthropic Claude, @anthropic-ai/sdk
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — REST endpoints, rate limiting, error format
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — API client patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns] — Naming conventions, module patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure-Deployment] — Environment variables, Anthropic API key
- [Source: apps/api/src/config/anthropic.config.ts] — Existing getAnthropicClient() factory
- [Source: apps/api/package.json] — @anthropic-ai/sdk@^0.72.1 already installed
- [Source: apps/api/src/app.module.ts] — Module registration pattern
- [Source: apps/api/src/modules/processing/processing.module.ts] — Module structure reference
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Future consumer of AiService (Story 3.3)
- [Source: apps/api/.env.example] — ANTHROPIC_API_KEY already documented
- [Source: _bmad-output/implementation-artifacts/3-1-processing-jobs-infrastructure.md] — Previous story learnings
- [Source: https://github.com/anthropics/anthropic-sdk-typescript] — SDK documentation and usage patterns

## Change Log

- 2026-02-07: Implemented AI integration setup — AiModule with AiService wrapping Anthropic Claude SDK, health check endpoint at /api/v1/ai/health with JWT auth and rate limiting, generateLiteratureReview() method with prompt engineering and citation parsing, shared AI types in @repo/types, comprehensive error handling for all API failure modes.
- 2026-02-07: Code review fixes — [H1] Registered ThrottlerModule.forRoot() and ThrottlerGuard as APP_GUARD in app.module.ts (rate limiting was non-functional across entire app). [H2] Removed duplicate local interfaces from ai.service.ts, now imports shared types from @repo/types via `import type`. Extracted DocumentMetadata as standalone export in @repo/types/ai.ts. [M1] Controller now maps AI service errors to appropriate HTTP status codes (502 for auth failures, 429 for rate limits, 503 for service unavailable) instead of generic 500. [M2] Service and controller now use AiHealthResponse shared type for return values. [M3] Citation parsing regex made more tolerant — matches `json:citations`, `json`, or `citations` code blocks. Added warning log when no citations block found. [M4] Added input validation for empty documents array and missing extracted texts.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- TypeScript typecheck: PASS (all 4 packages)
- API build (nest build): PASS
- Existing test suite: 74/74 tests passing, 11 suites, no regressions
- Package verification: @anthropic-ai/sdk@^0.72.1, @nestjs/throttler@^6.5.0, @nestjs/swagger@^11.2.5 all confirmed installed
- Environment verification: ANTHROPIC_API_KEY confirmed in .env.example
- Note: `pnpm start` has a pre-existing multer module resolution error in documents.controller.js (not related to this story)

### Completion Notes List

- **Task 4 (Types):** Created `packages/types/src/ai.ts` with `GenerateLiteratureReviewInput`, `LiteratureReviewResult`, `CitationResult`, `AiHealthResponse` interfaces. Exported from index.ts. Used `Record<string, string>` for extractedTexts (matching the story's map pattern) instead of `Map<string, string>` for JSON serialization compatibility.
- **Task 1 (Module):** Created `AiModule` at `apps/api/src/modules/ai/` with ConfigModule import, AiService provider, and AiService export for Story 3.3 consumption. Registered in app.module.ts. Follows DocumentsModule pattern exactly.
- **Task 2 (Controller):** Created `AiController` with `GET /ai/health` (becomes `/api/v1/ai/health` via global prefix). Applied `@UseGuards(JwtAuthGuard)`, `@Throttle({ default: { ttl: 60000, limit: 5 } })`, and `@ApiTags('ai')` with Swagger decorators. Health check sends minimal "Respond with ok" message to Claude to verify connectivity.
- **Task 3 (Service):** Implemented `AiService` with `OnModuleInit` for client initialization via `getAnthropicClient()`. `checkHealth()` sends minimal message to verify API connectivity. `generateLiteratureReview()` constructs system prompt defining citation format, builds user prompt from document texts, calls `client.messages.create()` with configurable model (default `claude-sonnet-4-5-20250929`, overridable via `ANTHROPIC_MODEL` env var) and 4096 max_tokens. Response parsing extracts title from first markdown heading and citations from `json:citations` code block. Error handling covers 401 (auth), 429 (rate limit), 500/503 (service unavailable) via `Anthropic.APIError` with contextual logging.
- **Task 5 (Verification):** All packages confirmed present. ANTHROPIC_API_KEY in .env.example. TypeScript compilation and build both pass. All 74 existing tests pass with no regressions.

### File List

- `apps/api/src/modules/ai/ai.module.ts` — NEW: AI module with ConfigModule, exports AiService
- `apps/api/src/modules/ai/ai.service.ts` — NEW: AiService with checkHealth() and generateLiteratureReview(); imports shared types from @repo/types
- `apps/api/src/modules/ai/ai.controller.ts` — NEW: Health check endpoint with JWT auth, rate limiting, Swagger docs; maps error types to proper HTTP status codes
- `apps/api/src/app.module.ts` — MODIFIED: Added AiModule import, ThrottlerModule.forRoot(), and ThrottlerGuard as APP_GUARD
- `packages/types/src/ai.ts` — NEW: Shared AI types (DocumentMetadata, GenerateLiteratureReviewInput, LiteratureReviewResult, CitationResult, AiHealthResponse)
- `packages/types/src/index.ts` — MODIFIED: Export AI types including DocumentMetadata
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: Story status updated
