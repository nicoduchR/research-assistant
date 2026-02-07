# Story 3.7: Literature Review Display and Editing

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to view the generated literature review with inline citations and edit the content,
so that I can refine the draft and customize it for my academic paper.

## Acceptance Criteria

1. **Given** a literature review has been generated **When** I navigate to `/literature-review/{reviewId}` **Then** a GET request is made to `/api/v1/literature-reviews/{reviewId}` **And** the API verifies the review belongs to the authenticated user **And** the review content is displayed in a clean, readable format **And** the title is displayed at the top (e.g., "Literature Review - [Date]")

2. **Given** the content has inline citations **When** the review is rendered **Then** each citation appears as a superscript number or clickable marker (e.g., [1], [2]) **And** hovering over a citation shows a tooltip with: document name, page number **And** the citation is visually distinct (e.g., colored, underlined)

3. **Given** I want to edit the generated text **When** I click an "Edit" button **Then** the content becomes editable in a textarea **And** I can modify any part of the text **And** citations remain linked even if I edit surrounding text **And** a "Save" button saves my changes

4. **Given** I save my edits **When** I click "Save" **Then** a PUT request is sent to `/api/v1/literature-reviews/{reviewId}` with updated content **And** the updated_at timestamp is refreshed **And** the changes are persisted to the database **And** a success message appears: "Changes saved" **And** the editor exits edit mode and displays the updated content

5. **Given** another user tries to access my review **When** they navigate to my review URL **Then** the API returns 403 status with error "You do not have permission to view this review" **And** no content is displayed

## Tasks / Subtasks

- [x] Task 1: Add PUT endpoint to LiteratureReviewsController (AC: #4, #5)
  - [x] 1.1 Create `apps/api/src/modules/literature-reviews/dto/update-literature-review.dto.ts` with `@IsOptional() @IsString() title?: string` and `@IsOptional() @IsString() content?: string` validated by class-validator
  - [x] 1.2 Add `updateReview(reviewId, userId, dto)` method to `literature-reviews.service.ts` — verify ownership (403), update fields, save, return updated review with citations
  - [x] 1.3 Add `@Put(':id')` endpoint to `literature-reviews.controller.ts` — accept `UpdateLiteratureReviewDto` body, `ParseUUIDPipe` on `:id`, return updated review in same format as GET

- [x] Task 2: Create literature review Zustand store (AC: #1, #3, #4)
  - [x] 2.1 Create `apps/web/src/lib/store/literatureReviewStore.ts` with state: `{ review: LiteratureReviewResponse | null, isLoading: boolean, error: string | null, isEditing: boolean, editContent: string, editTitle: string, isSaving: boolean }`
  - [x] 2.2 Implement actions: `fetchReview(reviewId)`, `startEditing()`, `cancelEditing()`, `setEditContent(content)`, `setEditTitle(title)`, `saveEdits(reviewId)`
  - [x] 2.3 Follow existing Zustand store pattern from `documentStore.ts` — `create<T>()((set, get) => ({...}))`

- [x] Task 3: Add `updateLiteratureReview` API function (AC: #4)
  - [x] 3.1 Add `updateLiteratureReview(reviewId, data: { title?: string, content?: string })` to `apps/web/src/lib/api/literature-reviews.ts`

- [x] Task 4: Create LiteratureReviewContent display component (AC: #1, #2)
  - [x] 4.1 Create `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` — renders markdown content as HTML
  - [x] 4.2 Parse inline citation markers `[doc-uuid:page]` in content and render as clickable `<CitationBadge>` components (reuse existing `apps/web/src/components/molecules/CitationBadge.tsx`)
  - [x] 4.3 Map citation markers to citation data from the review's `citations[]` array by matching documentId — show superscript citation number based on position
  - [x] 4.4 On citation hover: show tooltip with document fileName + page number (use document metadata from review context or fetch from documents API)
  - [x] 4.5 On citation click: for now, just highlight/scroll — PDF viewer opening is Story 4.3

- [x] Task 5: Create LiteratureReviewEditor component (AC: #3, #4)
  - [x] 5.1 Create `apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx` — a textarea-based editor for the review content (markdown)
  - [x] 5.2 Editor shows the raw markdown content (with citation markers visible as `[doc-uuid:page]`) in a large textarea
  - [x] 5.3 Title is editable via an Input component above the textarea
  - [x] 5.4 "Save" button calls `saveEdits(reviewId)` from literatureReviewStore
  - [x] 5.5 "Cancel" button calls `cancelEditing()` to discard changes and return to view mode
  - [x] 5.6 Show saving state with disabled button + spinner during PUT request

- [x] Task 6: Build the literature review page (AC: #1, #2, #3, #4, #5)
  - [x] 6.1 Replace placeholder at `apps/web/app/literature-review/[id]/page.tsx` with full implementation
  - [x] 6.2 Use `useParams()` to get reviewId, call `fetchReview(reviewId)` on mount
  - [x] 6.3 Show loading state (Spinner) while fetching
  - [x] 6.4 Show error state if review not found or forbidden (redirect to dashboard with toast)
  - [x] 6.5 Display Header component at top (same as dashboard)
  - [x] 6.6 Show review title, creation date (formatted: "Jan 15, 2026"), edit button
  - [x] 6.7 Toggle between LiteratureReviewContent (view mode) and LiteratureReviewEditor (edit mode) based on `isEditing` store state
  - [x] 6.8 Show toast "Changes saved" on successful save via toastStore
  - [x] 6.9 Add "Back to Dashboard" link/button for navigation

- [x] Task 7: Verify build, types, and integration (AC: all)
  - [x] 7.1 Run `pnpm typecheck` — all packages pass
  - [x] 7.2 Run `nest build` in apps/api — compiles without errors
  - [x] 7.3 Run existing test suite — no regressions
  - [x] 7.4 Verify GET `/api/v1/literature-reviews/:id` returns review with citations
  - [x] 7.5 Verify PUT `/api/v1/literature-reviews/:id` updates content and returns updated review
  - [x] 7.6 Verify literature review page loads and displays content
  - [x] 7.7 Verify edit mode toggle works and saves changes

## Dev Notes

### Story Context

This is **Story 3.7** in **Epic 3: AI-Powered Literature Review Generation**. It builds the primary output view — the page where users see, read, and refine their AI-generated literature review. This is one of the **critical success moments** identified in the UX spec: when users see the results and verify citations, trust converts from skepticism to confidence.

**Functional Requirements Covered:** FR9 (view generated literature review output), FR10 (edit generated literature review content), FR13 (see citation reference for any generated statement)

**Critical Dependency Chain:**
- **Depends on:** Story 3.3 (LiteratureReview entity, AI generation) — **STATUS: DONE**
- **Depends on:** Story 3.4 (Citation entity, traceability) — **STATUS: DONE**
- **Depends on:** Story 3.6 (Processing initiation, placeholder review page, LiteratureReviewsModule) — **STATUS: DONE**
- **Depended on by:** Story 3.8 (Methodology Progress Tracker — displayed on this page)
- **Depended on by:** Story 3.10 (Bibliography Export — displayed on this page)
- **Depended on by:** Story 4.3 (Click-to-Verify Citation Navigation — citations become clickable to open PDF viewer)

**What's Already Built (Do NOT Recreate):**

- **LiteratureReview entity** — `apps/api/src/entities/literature-review.entity.ts` with id, userId, jobId, title (varchar 500), content (text/markdown), documentIds (jsonb), createdAt, updatedAt [Source: `apps/api/src/entities/literature-review.entity.ts`]
- **Citation entity** — `apps/api/src/entities/citation.entity.ts` with id, literatureReviewId, documentId, pageNumber (nullable), claimText (text), positionInReview (int), isVerified (bool, default false), userNotes (nullable text), createdAt [Source: `apps/api/src/entities/citation.entity.ts`]
- **LiteratureReviewsModule** — `apps/api/src/modules/literature-reviews/literature-reviews.module.ts` with TypeOrmModule.forFeature([LiteratureReview, Citation]), already imported in AppModule [Source: `apps/api/src/modules/literature-reviews/literature-reviews.module.ts`]
- **LiteratureReviewsService** — `apps/api/src/modules/literature-reviews/literature-reviews.service.ts` with `getReview(reviewId, userId)` method that fetches review + citations with ownership check [Source: `apps/api/src/modules/literature-reviews/literature-reviews.service.ts`]
- **LiteratureReviewsController** — `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` with GET `/literature-reviews/:id` endpoint, JWT auth, ParseUUIDPipe, camelCase response mapping [Source: `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts`]
- **Frontend getLiteratureReview API** — `apps/web/src/lib/api/literature-reviews.ts` with `getLiteratureReview(reviewId)` returning `LiteratureReviewResponse` [Source: `apps/web/src/lib/api/literature-reviews.ts`]
- **Placeholder page** — `apps/web/app/literature-review/[id]/page.tsx` — simple placeholder, ready to be replaced [Source: `apps/web/app/literature-review/[id]/page.tsx`]
- **ProcessingProgressModal** — navigates to `/literature-review/${resultId}` on completion [Source: `apps/web/src/components/features/processing/ProcessingProgressModal.tsx`]
- **CitationBadge molecule** — `apps/web/src/components/molecules/CitationBadge.tsx` — displays "Author, Year, p.Page" with click handler, interactive styles [Source: `apps/web/src/components/molecules/CitationBadge.tsx`]
- **Existing UI components** — Button, Card, Badge, Spinner, Input, Textarea, Dialog, Modal, Toast, Header all available [Source: `apps/web/src/components/`]
- **Axios API client** — `apps/web/src/lib/api/axiosInstance.ts` with baseURL `/api/v1`, credentials, 30s timeout, 401 interceptor [Source: `apps/web/src/lib/api/axiosInstance.ts`]
- **Zustand stores** — authStore, documentStore, processingStore, toastStore, researchStore — all following same pattern [Source: `apps/web/src/lib/store/`]
- **Shared types** — `packages/types/src/literature-review.ts` (LiteratureReview, LiteratureReviewResponse), `packages/types/src/citation.ts` (Citation, CitationResponse) [Source: `packages/types/src/`]
- **Header component** — `apps/web/src/components/features/layout/Header.tsx` for page header [Source: `apps/web/src/components/features/layout/Header.tsx`]

**What NOT to Build:**

- Do NOT create any database entities or migrations — LiteratureReview and Citation entities already exist
- Do NOT modify the processing worker or AI service
- Do NOT modify the WebSocket gateway or processingStore
- Do NOT implement the PDF viewer side panel — that's Story 4.2/4.3
- Do NOT implement bibliography export section — that's Story 3.10
- Do NOT implement methodology progress tracker — that's Story 3.8
- Do NOT implement FR14 (manual citation correction) beyond basic content editing — citation correction via dedicated UI is post-MVP
- Do NOT add rich text editor libraries (TipTap, Quill, etc.) — use a simple textarea for editing markdown. Users are editing the raw text, which is simple markdown. Keep it simple.
- Do NOT install any new npm packages — all dependencies already installed

---

### Technical Requirements

**AI Content Format:**

The AI generates literature review content as **markdown** with inline citation markers. The format is:
- Content is markdown text with headers, paragraphs, bullet points
- Citation markers appear inline as `[doc-uuid:page_number]` (e.g., `[a1b2c3d4-...:12]`)
- The citations array in the response maps each marker to structured data: `{ id, documentId, pageNumber, claimText, positionInReview, isVerified, userNotes }`

**Content Rendering Strategy:**

1. Parse the markdown content for display (use simple HTML rendering — split by newlines, handle `#` headings, `**bold**`, `*italic*`, `- ` lists)
2. Detect citation markers `[uuid:page]` pattern via regex
3. Replace markers with clickable `<CitationBadge>` components or styled superscript numbers
4. Match markers to the `citations[]` array by documentId to get fileName and page info
5. Do NOT use a full markdown library — keep rendering simple and lightweight

**Important: Simple Markdown Rendering** — The content from AI is basic markdown (headings, paragraphs, bold, italic, lists). Do NOT add a heavy markdown parser like `react-markdown` or `marked`. Implement a lightweight renderer:

```tsx
// Simple approach: render markdown as HTML
function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>');
}
```

Then replace citation markers with React components after rendering.

**PUT Endpoint Pattern:**

Follow the existing controller pattern from LiteratureReviewsController:

```typescript
// Add to literature-reviews.controller.ts
@Put(':id')
async updateReview(
  @Req() req: any,
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateLiteratureReviewDto,
): Promise<LiteratureReviewResponseDto> {
  if (!req.user?.userId) {
    throw new UnauthorizedException('User not authenticated');
  }
  const review = await this.literatureReviewsService.updateReview(id, req.user.userId, dto);
  return this.mapToResponse(review);
}
```

**UpdateLiteratureReviewDto:**

```typescript
import { IsOptional, IsString } from 'class-validator';

export class UpdateLiteratureReviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
```

**Service Update Method:**

```typescript
async updateReview(reviewId: string, userId: string, dto: UpdateLiteratureReviewDto): Promise<LiteratureReview & { citations: Citation[] }> {
  const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
  if (!review) throw new NotFoundException('Literature review not found');
  if (review.userId !== userId) throw new ForbiddenException('You do not have permission to edit this review');

  if (dto.title !== undefined) review.title = dto.title;
  if (dto.content !== undefined) review.content = dto.content;

  const saved = await this.reviewRepository.save(review);
  const citations = await this.citationRepository.find({
    where: { literatureReviewId: saved.id },
    order: { positionInReview: 'ASC' },
  });
  return { ...saved, citations };
}
```

**Zustand Store Pattern:**

Follow the same pattern as `documentStore.ts`:

```typescript
import { create } from 'zustand';
import { getLiteratureReview, updateLiteratureReview } from '../api/literature-reviews';

interface LiteratureReviewState {
  review: LiteratureReviewResponse | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  editContent: string;
  editTitle: string;
  isSaving: boolean;

  fetchReview: (reviewId: string) => Promise<void>;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditContent: (content: string) => void;
  setEditTitle: (title: string) => void;
  saveEdits: (reviewId: string) => Promise<void>;
  reset: () => void;
}
```

**Page Component Pattern:**

Follow the dashboard page pattern — `'use client'` directive, useEffect for data loading, conditional rendering:

```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLiteratureReviewStore } from '@/src/lib/store/literatureReviewStore';
import { useToastStore } from '@/src/lib/store/toastStore';
import { Header } from '@/src/components/features/layout/Header';
```

---

### Architecture Compliance

**API Patterns:**
- PUT endpoint under `/api/v1/literature-reviews/:id` (URL versioning via global prefix) [Source: architecture.md#API-Endpoints]
- Controller uses `@UseGuards(JwtAuthGuard)` for authentication [Source: architecture.md#Authentication-Security]
- Response DTOs map entity fields to camelCase JSON [Source: architecture.md#Naming-Patterns]
- Error responses via NestJS built-in exceptions (ForbiddenException, NotFoundException) [Source: architecture.md#Error-Handling]
- `ParseUUIDPipe` on `:id` param for input validation [Source: story 3.6 pattern]

**Frontend Patterns:**
- Components in `src/components/features/literature-review/` directory [Source: architecture.md#Component-Architecture]
- New Zustand store `literatureReviewStore` — separate domain from processingStore [Source: architecture.md#State-Management]
- Reuse existing atoms: Button, Card, Spinner, Input, Textarea [Source: architecture.md#Components]
- Reuse existing CitationBadge molecule for inline citations
- API calls via centralized axios instance with interceptors

**Naming Conventions:**
- Frontend components: PascalCase (`LiteratureReviewContent.tsx`, `LiteratureReviewEditor.tsx`)
- Backend files: kebab-case (`update-literature-review.dto.ts`)
- JSON responses: camelCase (`createdAt`, `documentIds`, `pageNumber`)
- Store files: camelCase (`literatureReviewStore.ts`)

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies already installed:

| Package | Location | Usage in This Story |
|---------|----------|---------------------|
| `react` 19.x | apps/web | UI components |
| `next` 15.x | apps/web | App Router, useParams, useRouter |
| `zustand` 5.x | apps/web | literatureReviewStore |
| `axios` 1.6.x | apps/web | API calls via axiosInstance |
| `class-validator` 0.14.x | apps/api | UpdateLiteratureReviewDto validation |
| `typeorm` 0.3.x | apps/api | Repository save/find operations |
| `@nestjs/common` 11.x | apps/api | Controller, Service decorators |
| `tailwindcss` 3.4.x | apps/web | Styling |
| `sanitize-html` 2.17.x | apps/api | Already installed — use if needed for content sanitization |

**Important: No rich text editor needed.** The editing experience is a simple textarea showing raw markdown. Users see the formatted view in read mode, and raw markdown in edit mode. This is intentional — keep the MVP simple.

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/modules/literature-reviews/
└── dto/
    └── update-literature-review.dto.ts            # NEW: DTO for PUT body validation

apps/web/src/components/features/literature-review/
├── LiteratureReviewContent.tsx                     # NEW: Markdown content renderer with citations
└── LiteratureReviewEditor.tsx                      # NEW: Textarea editor for edit mode

apps/web/src/lib/store/
└── literatureReviewStore.ts                        # NEW: Zustand store for review state
```

**Files to Modify:**

```
apps/api/src/modules/literature-reviews/literature-reviews.service.ts   # MODIFY: Add updateReview method
apps/api/src/modules/literature-reviews/literature-reviews.controller.ts # MODIFY: Add PUT endpoint
apps/web/src/lib/api/literature-reviews.ts                              # MODIFY: Add updateLiteratureReview function
apps/web/app/literature-review/[id]/page.tsx                            # MODIFY: Replace placeholder with full page
```

**No Changes Expected To:**

```
apps/api/src/entities/                                # No entity changes
apps/api/src/migrations/                              # No migrations
apps/api/src/gateways/                                # Gateway unchanged
apps/api/src/jobs/                                    # Worker unchanged
apps/api/src/main.ts                                  # No changes
apps/api/src/modules/processing/                      # Processing unchanged
apps/web/src/lib/store/processingStore.ts              # Store unchanged
apps/web/src/lib/store/documentStore.ts                # Store unchanged
apps/web/src/lib/websocket-client.ts                   # WS client unchanged
apps/web/app/dashboard/page.tsx                        # Dashboard unchanged
packages/types/                                        # Types unchanged
```

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors
3. Existing test suite passes (no regressions)
4. GET `/api/v1/literature-reviews/:id` returns review with title, content, citations array, createdAt, updatedAt
5. PUT `/api/v1/literature-reviews/:id` with `{ content: "updated text" }` returns updated review
6. PUT `/api/v1/literature-reviews/:id` for another user's review returns 403
7. PUT `/api/v1/literature-reviews/:id` with invalid UUID returns 400
8. Literature review page loads at `/literature-review/{id}` with formatted content
9. Citations render as clickable markers inline with the text
10. Hovering a citation shows tooltip with document name and page number
11. Clicking "Edit" switches to textarea editor with raw markdown
12. Clicking "Save" sends PUT request and returns to view mode with updated content
13. Clicking "Cancel" discards changes and returns to view mode
14. Toast notification appears on successful save
15. Error state shown if review ID doesn't exist or user doesn't own it

---

### Previous Story Intelligence

**From Story 3.6 - Initiate Processing and Progress Display (Most Recent):**

**Key Learnings:**
1. **ProcessingProgressModal navigation** — On completion, calls `router.push('/literature-review/${resultId}')`. Story 3.7 page is the destination of this navigation
2. **LiteratureReviewsModule already exists** — Service has `getReview()`, Controller has `GET /:id`. This story adds `PUT /:id` to the same module
3. **Controller response mapping pattern** — Uses a private `mapToResponse()` method that converts entity to camelCase DTO. Reuse this for PUT response
4. **ParseUUIDPipe pattern** — Applied to `:id` params: `@Param('id', ParseUUIDPipe) id: string`
5. **Defensive req.user check** — All controllers check `if (!req.user?.userId)` before processing
6. **83 tests passing** — Current test count, ensure no regressions
7. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored

**From Story 3.4 - Citation Traceability System:**

**Key Learnings:**
1. **Citation entity relations** — Citation has ManyToOne to LiteratureReview (literatureReviewId) and ResearchDocument (documentId). When fetching reviews for display, use relations to include citations
2. **positionInReview ordering** — Citations have integer `positionInReview` field for display ordering. Fetch with `order: { positionInReview: 'ASC' }`
3. **pageNumber can be null** — Some citations may not have page numbers. Display gracefully (e.g., "p. unknown" or no page indicator)
4. **isVerified flag** — Defaults to false. Can be toggled by user in future stories
5. **userNotes field** — Pre-filled with "Page number uncertain" when pageNumber is null. Editable by user

**From Story 3.3 - Literature Review Generation Core:**

**Key Learnings:**
1. **AI content format** — Content is markdown with inline `[doc-uuid:page]` citation markers. The `parseResponse()` method strips the JSON citations block, leaving clean markdown with markers
2. **Title extraction** — Title is extracted from first `#` heading in AI response, defaults to "Literature Review"
3. **Content is plain text/markdown** — Stored as `text` column in PostgreSQL, no special formatting

**Code Patterns to Follow:**
- Controller: Same as existing LiteratureReviewsController (add PUT method alongside existing GET)
- Service: Same as existing getReview pattern (add updateReview method)
- Store: Same as documentStore (create/set/get/reset pattern)
- Page: Same as dashboard page (useEffect, conditional rendering, Header)
- API function: Same as getLiteratureReview (add updateLiteratureReview)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **74e15e0** — `feat: initiate processing and progress display with code review fixes (story 3.6)` — Created LiteratureReviewsModule, ProcessingController, ProcessingProgressModal
2. **5e6f11a** — `feat: citation traceability and real-time WebSocket progress (stories 3.4 & 3.5)` — Created Citation entity, WebSocket gateway, processingStore
3. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` — Created LiteratureReview entity, AI service, worker
4. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` — Anthropic SDK integration
5. **2f8bc61** — `feat: processing jobs infrastructure with BullMQ migration and code review fixes` — ProcessingJob entity, BullMQ setup

**Commit Message Pattern:** `feat: <description> with code review fixes`

**Expected Commit for This Story:**
```
feat: literature review display and editing with inline citations and code review fixes
```

---

### Project Structure Notes

- LiteratureReviewsController and Service already exist — this story ADDS to them (PUT endpoint, updateReview method), does NOT create new ones
- New frontend components go in `src/components/features/literature-review/` — new directory for this domain
- New Zustand store `literatureReviewStore.ts` in `src/lib/store/` — follows existing store pattern
- Literature review page at `app/literature-review/[id]/page.tsx` already exists as placeholder — REPLACE contents entirely
- This page will be extended in Stories 3.8 (methodology tracker section) and 3.10 (bibliography section)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.7-Literature-Review-Display-and-Editing] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR9, FR10, FR13 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — REST endpoints, API versioning
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Zustand stores, component architecture
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — camelCase JSON, PascalCase components, kebab-case backend files
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-Boundaries] — FR9/FR10/FR13 structure mapping
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] — FR9, FR10, FR13 requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Results display as trust-building moment
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Calm confidence, trust through transparency
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Emotional-Journey-Mapping] — Stage 3 "Seeing Results": Disbelief -> Relief -> Excitement
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-Pattern-Analysis] — Dark text on light background for reading comfort, spacious layouts
- [Source: apps/api/src/modules/literature-reviews/literature-reviews.controller.ts] — Existing GET endpoint and response mapping
- [Source: apps/api/src/modules/literature-reviews/literature-reviews.service.ts] — Existing getReview method
- [Source: apps/api/src/modules/literature-reviews/literature-reviews.module.ts] — Module with TypeOrmModule.forFeature
- [Source: apps/api/src/entities/literature-review.entity.ts] — LiteratureReview entity (title, content, documentIds)
- [Source: apps/api/src/entities/citation.entity.ts] — Citation entity (documentId, pageNumber, claimText, positionInReview)
- [Source: apps/api/src/modules/ai/ai.service.ts] — AI output format: markdown with [doc-uuid:page] markers + JSON citations block
- [Source: apps/web/src/lib/api/literature-reviews.ts] — getLiteratureReview function
- [Source: apps/web/src/lib/api/axiosInstance.ts] — Axios client configuration
- [Source: apps/web/src/lib/store/documentStore.ts] — Zustand store pattern reference
- [Source: apps/web/src/lib/store/toastStore.ts] — Toast notification system
- [Source: apps/web/src/components/molecules/CitationBadge.tsx] — Reusable citation badge component
- [Source: apps/web/src/components/features/processing/ProcessingProgressModal.tsx] — Navigation to /literature-review/{resultId}
- [Source: apps/web/app/literature-review/[id]/page.tsx] — Current placeholder to replace
- [Source: apps/web/app/dashboard/page.tsx] — Page component pattern reference
- [Source: _bmad-output/implementation-artifacts/3-6-initiate-processing-and-progress-display.md] — Previous story learnings, 83 tests passing

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered.

### Completion Notes List

- **Task 1:** Added PUT `/api/v1/literature-reviews/:id` endpoint with UpdateLiteratureReviewDto (class-validator). Service verifies ownership (403), updates title/content, returns review with citations. Extracted `mapToResponse()` private method to avoid duplication between GET and PUT.
- **Task 2:** Created `literatureReviewStore` Zustand store following documentStore pattern — manages review fetch, editing state (isEditing, editContent, editTitle), saving state, and reset.
- **Task 3:** Added `updateLiteratureReview(reviewId, data)` API function using axios PUT to `/literature-reviews/{reviewId}`.
- **Task 4:** Created `LiteratureReviewContent` component with lightweight markdown renderer (headings, bold, italic, lists) and inline citation parsing. Citations render as superscript numbered badges with hover tooltips showing document fileName + page number. Uses regex to detect `[uuid:page]` markers and maps them to citation data.
- **Task 5:** Created `LiteratureReviewEditor` with textarea for raw markdown editing, title input, save/cancel buttons with saving spinner state.
- **Task 6:** Replaced placeholder page with full implementation — loading state, error redirect to dashboard with toast, review header with title/date/edit button, content/editor toggle, back to dashboard navigation. Fetches documents for citation tooltip data.
- **Task 7:** All verifications passed: `pnpm typecheck` (4/4 packages), `nest build` clean, 83/83 tests passing (no regressions).

### Change Log

- 2026-02-07: Implemented story 3.7 — Literature review display page with inline citations, markdown rendering, edit mode with textarea, PUT endpoint for saving edits
- 2026-02-07: Code review fixes — XSS prevention via HTML escaping in markdown renderer, @MaxLength validators on DTO, AC#5 error message alignment, partial update optimization in saveEdits, File List documentation fix

### File List

**New files:**
- `apps/api/src/modules/literature-reviews/dto/update-literature-review.dto.ts`
- `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx`
- `apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx`
- `apps/web/src/lib/store/literatureReviewStore.ts`

**Modified files:**
- `apps/api/src/modules/literature-reviews/literature-reviews.service.ts` — added `updateReview()` method
- `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` — added PUT endpoint, extracted `mapToResponse()`
- `apps/web/src/lib/api/literature-reviews.ts` — added `updateLiteratureReview()` function
- `apps/web/app/literature-review/[id]/page.tsx` — replaced placeholder with full implementation
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — updated story 3.7 status
