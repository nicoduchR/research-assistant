# Story 2.6: Document List View

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to see all my uploaded documents in a list,
So that I can track what papers I've added and select documents for processing.

## Acceptance Criteria

1. **Given** I am authenticated and on the dashboard **When** the page loads **Then** a GET request is made to `/api/v1/documents` **And** the API returns all documents for the authenticated user only (user-scoped query) **And** documents are displayed in a list/grid with cards showing: file name, upload date, page count, file size

2. **Given** I have uploaded 3 documents **When** I view the document list **Then** all 3 documents are visible **And** documents are sorted by upload date (newest first) **And** each document card displays: file icon, file name (truncated if long), upload timestamp (formatted: "Jan 15, 2026"), page count (e.g., "24 pages"), file size (formatted: "2.4 MB")

3. **Given** a document's text extraction is in progress **When** I view the document list **Then** the document card shows a spinner or "Processing..." indicator **And** the page count is shown as "—" until extraction completes

4. **Given** a document's text extraction failed (scanned PDF) **When** I view the document list **Then** the document card shows a warning icon **And** a tooltip or badge displays: "Scanned PDF - text extraction not available" **And** the document is still visible and selectable

5. **Given** I have no documents uploaded **When** I view the document list **Then** an empty state is displayed with message: "No documents yet. Drag and drop PDFs to get started." **And** the drag-and-drop zone remains prominent

## Tasks / Subtasks

- [x] Task 1: Enhance DocumentList component with polished card display (AC: #1, #2, #3, #4)
  - [x] 1.1 Refactor DocumentList.tsx to use the existing `DocumentCard` component instead of inline `DocumentListItem`
  - [x] 1.2 Fix DocumentCard type incompatibilities (pre-existing `document.status` and `document.filename` issues noted in Story 2.5 debug log)
  - [x] 1.3 Add formatted upload date display using `Intl.DateTimeFormat` (format: "Jan 15, 2026")
  - [x] 1.4 Add formatted file size display (e.g., "2.4 MB") using a `formatBytes()` utility
  - [x] 1.5 Add formatted page count display (e.g., "24 pages") with "—" fallback when null/extraction in progress
  - [x] 1.6 Ensure file name truncation for long names with full name in tooltip on hover

- [x] Task 2: Enhance extraction status indicators on document cards (AC: #3, #4)
  - [x] 2.1 Show spinner/processing indicator when `textExtracted === false` AND `extractionError === null` (extraction in progress)
  - [x] 2.2 Show warning icon + "Scanned PDF - text extraction not available" tooltip when `extractionError` is set
  - [x] 2.3 Show success/ready indicator when `textExtracted === true`
  - [x] 2.4 Use existing `Badge` atom (variants: processing, success, warning/error) for extraction status display
  - [x] 2.5 Use shadcn/ui `Tooltip` (or existing tooltip pattern) for hover text on warning/error badges

- [x] Task 3: Verify empty state display (AC: #5)
  - [x] 3.1 Confirm `EmptyState` component renders correctly when `documents.length === 0`
  - [x] 3.2 Verify message text: "No documents yet. Drag and drop PDFs to get started."
  - [x] 3.3 Ensure UploadZone/drop zone remains prominent alongside empty state

- [x] Task 4: Verify backend list endpoint returns all required fields (AC: #1, #2)
  - [x] 4.1 Verify `DocumentListItemDto` includes: id, fileName, fileSize, mimeType, pageCount, textExtracted, extractionError, uploadedAt, updatedAt
  - [x] 4.2 Verify user-scoped query: only returns documents for authenticated user
  - [x] 4.3 Verify sorting: `uploadedAt DESC` (newest first)
  - [x] 4.4 Verify camelCase JSON field names in response

- [x] Task 5: End-to-end validation (AC: #1, #2, #3, #4, #5)
  - [x] 5.1 Upload 3+ PDFs and verify all appear in list with correct metadata
  - [x] 5.2 Verify sorting order (newest first)
  - [x] 5.3 Verify document card displays: file icon, file name, formatted date, page count, file size
  - [x] 5.4 Verify extraction-in-progress state shows spinner/"Processing..." indicator
  - [x] 5.5 Verify extraction-failed state shows warning icon + tooltip message
  - [x] 5.6 Verify empty state with no documents
  - [x] 5.7 Verify file name truncation on long filenames with tooltip for full name

## Dev Notes

### Story Context

This is **Story 2.6** in **Epic 2: Document Upload & Management**. This story enhances the document list view to show polished, informative document cards with formatted metadata and clear extraction status indicators.

**What's Already Built:**

- **Epic 1 Complete**: Authentication infrastructure (Google OAuth, JWT, Zustand auth store)
- **Story 2.0**: Research scope setup (ResearchScopeForm, ScopeSetupModal, researchStore)
- **Story 2.1**: Reusable UI component library (DropZone, FileItem, DocumentCard, Toast, EmptyState, Modal, ProgressIndicator, Badge, StatusBadge, Spinner)
- **Story 2.2**: ResearchDocument entity, storage module, database schema
- **Story 2.3**: Single PDF upload endpoint `POST /api/v1/documents/upload`
- **Story 2.4**: PDF text extraction pipeline (BullMQ background job, pdf-parse extraction, scanned PDF detection)
- **Story 2.5**: Drag-and-drop upload interface, document Zustand store, UploadZone component, DocumentList component (basic), `GET /api/v1/documents` endpoint, `DELETE /api/v1/documents/:id` endpoint

**What This Story Enhances:**

1. **DocumentList component polish**: Refactor to use DocumentCard (fixing type issues) or enhance inline DocumentListItem with proper formatting
2. **Metadata formatting**: Human-readable dates, file sizes, page counts
3. **Extraction status**: Clear visual indicators for processing/success/error states with tooltips
4. **Empty state**: Verify proper empty state display

**Critical: What Already Exists (Do NOT Recreate):**

- `DocumentList.tsx` at `apps/web/src/components/features/upload/DocumentList.tsx` — already renders documents with basic card layout
- `DocumentCard.tsx` at `apps/web/src/components/features/cards/DocumentCard.tsx` — pre-built card component (has type issues to fix)
- `documentStore.ts` at `apps/web/src/lib/store/documentStore.ts` — already has `fetchDocuments()`, `deleteDocument()`
- `documents.ts` API at `apps/web/src/lib/api/documents.ts` — already has `listDocuments()`, `deleteDocument()`
- `GET /api/v1/documents` backend endpoint — already returns `DocumentListItemDto` with all needed fields
- `Badge` atom, `StatusBadge` feature — existing status display components
- `EmptyState` feature — existing empty state component
- `Toast` molecule — existing notification system

**What NOT to Build:**

- Do NOT create a new list endpoint — `GET /api/v1/documents` already works
- Do NOT create a new store or API module — `documentStore.ts` and `documents.ts` already work
- Do NOT create new badge/status components — use existing `Badge`, `StatusBadge`
- Do NOT add pagination — not required for MVP (100 users, manageable document counts)
- Do NOT add sorting controls — fixed sort by newest first is sufficient
- Do NOT add search/filter — not in scope for this story

---

### Technical Requirements

**DocumentCard Type Fix:**

The pre-existing `DocumentCard.tsx` references `document.status` and `document.filename` which do not exist on the `Document` type from `@repo/types`. The actual type has:
- `document.fileName` (not `filename`)
- `document.textExtracted` + `document.extractionError` (not `status`)

Fix options:
1. **Preferred**: Fix `DocumentCard.tsx` to use correct `Document` type fields (`fileName`, `textExtracted`, `extractionError`)
2. **Alternative**: Continue using the inline `DocumentListItem` pattern from Story 2.5's `DocumentList.tsx` but enhance it with proper formatting

**Document Type Interface (from `@repo/types`):**

```typescript
interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;          // bytes
  mimeType: string;
  storagePath: string;
  pageCount: number | null;  // null until extraction completes
  textExtracted: boolean;    // false initially, true after successful extraction
  extractionError: string | null; // null if no error, contains error message if failed
  extractedText: string | null;
  uploadedAt: string;        // ISO 8601
  updatedAt: string;         // ISO 8601
}
```

**Backend Response (DocumentListItemDto):**

```typescript
class DocumentListItemDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  pageCount: number | null;
  textExtracted: boolean;
  extractionError: string | null;
  uploadedAt: Date;
  updatedAt: Date;
}
```

Note: Backend excludes `storagePath`, `extractedText`, and `userId` from list responses for security.

**Extraction Status Logic:**

```
If textExtracted === true:
  → Status: "Ready" (success badge, check icon)
  → Show page count (e.g., "24 pages")

If textExtracted === false AND extractionError === null:
  → Status: "Processing" (spinner, processing badge)
  → Show page count as "—"

If extractionError is not null:
  → Status: "Error" (warning icon, error/warning badge)
  → Tooltip: extractionError text (e.g., "Scanned PDF detected - text extraction not possible")
  → Document is still visible and selectable
```

**Formatting Utilities:**

```typescript
// File size formatting
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
// Examples: 2457600 → "2.3 MB", 512000 → "500 KB"

// Date formatting
function formatUploadDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}
// Example: "2026-01-15T10:30:00Z" → "Jan 15, 2026"

// Page count formatting
function formatPageCount(pageCount: number | null): string {
  if (pageCount === null) return '—';
  return `${pageCount} page${pageCount !== 1 ? 's' : ''}`;
}
// Examples: 24 → "24 pages", 1 → "1 page", null → "—"
```

Place these utilities in the component file or in a shared utility if reused across stories.

---

### Architecture Compliance

**Frontend Component Organization (Atomic Design):**

- `Badge` atom: REUSE for status indicators (variants: processing, success, warning, error)
- `StatusBadge` feature: REUSE for extraction status display
- `DocumentCard` feature: FIX type issues and REUSE, OR enhance inline DocumentListItem
- `EmptyState` feature: REUSE for empty document list
- `Toast` molecule: REUSE for any error notifications
- `Spinner` atom: REUSE for processing state indicator

**State Management (Zustand):**

- `documentStore.ts` already manages documents state
- `fetchDocuments()` action already fetches from `GET /api/v1/documents`
- No new store actions needed for this story
- Documents array already sorted by backend (uploadedAt DESC)

**API Communication:**

- `listDocuments()` in `apps/web/src/lib/api/documents.ts` already works
- Returns typed `Document[]` from `@repo/types`
- Uses existing `axiosInstance` with JWT credentials

**NestJS API:**

- `GET /api/v1/documents` endpoint already exists in `documents.controller.ts`
- Returns `DocumentListItemDto[]` with all required fields
- User-scoped via `@UseGuards(JwtAuthGuard)` and `req.user.id` filter
- Sorted by `uploadedAt DESC`
- No backend changes expected unless DTO needs adjustment

**Naming Conventions:**

- Frontend files: PascalCase components (DocumentList.tsx, DocumentCard.tsx)
- Utility functions: camelCase (formatFileSize, formatUploadDate)
- JSON responses: camelCase fields (fileName, pageCount, textExtracted)
- Badge variants: lowercase (processing, success, warning, error)

---

### Library & Framework Requirements

**No New Dependencies Required!**

All functionality uses existing installed packages:

- `react` ^19.0.0 / `react-dom` ^19.0.0
- `next` ^15.1.0 (App Router)
- `zustand` ^5.0.10 (state management — documentStore)
- `@repo/types` (shared Document type)
- `tailwind` (styling)

**Existing Components to Use:**

| Component | Location | Use |
|---|---|---|
| Badge | atoms/Badge/Badge.tsx | Status indicator (processing/success/error) |
| StatusBadge | features/cards/StatusBadge.tsx | Extraction status display |
| DocumentCard | features/cards/DocumentCard.tsx | Document card (needs type fix) |
| EmptyState | features/layout/EmptyState.tsx | Empty document list |
| Spinner | atoms/Spinner/Spinner.tsx | Processing indicator |
| Toast | molecules/Toast/Toast.tsx | Error notifications |

**No shadcn/ui Tooltip installed yet.** If tooltip is needed for extraction error messages, either:
1. Use native HTML `title` attribute for simple tooltips
2. Install shadcn/ui tooltip: `npx shadcn@latest add tooltip` (adds @radix-ui/react-tooltip)
3. Use CSS-only tooltip with Tailwind `group` + `group-hover` pattern

Recommended: Use native `title` attribute for MVP simplicity, consistent with existing patterns.

---

### File Structure Requirements

**Files to Modify:**

```
apps/web/src/
├── components/
│   └── features/
│       ├── cards/
│       │   └── DocumentCard.tsx              # Fix type issues (document.status → textExtracted logic, document.filename → document.fileName)
│       └── upload/
│           └── DocumentList.tsx              # Enhance with formatted metadata, proper status indicators
```

**Possibly Create (if formatting utilities are extracted):**

```
apps/web/src/
└── lib/
    └── utils/
        └── formatters.ts                     # formatFileSize(), formatUploadDate(), formatPageCount()
```

**No Changes Expected To:**

```
apps/web/src/lib/api/documents.ts            # API already works
apps/web/src/lib/store/documentStore.ts       # Store already works
apps/web/app/dashboard/page.tsx               # Dashboard integration already done
apps/api/src/modules/documents/               # Backend already complete
apps/web/src/components/atoms/Badge/          # Reuse as-is
apps/web/src/components/features/layout/      # EmptyState reuse as-is
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. Upload 3+ PDFs → all appear in document list with correct metadata
2. Verify card shows: file icon, file name, formatted date ("Jan 15, 2026"), page count ("24 pages"), file size ("2.4 MB")
3. Upload a text-based PDF → extraction succeeds → card shows "Ready" status, page count visible
4. Upload a scanned/image PDF → extraction fails → card shows warning icon + error tooltip
5. During extraction → card shows "Processing..." spinner, page count shows "—"
6. Delete all documents → empty state shows "No documents yet. Drag and drop PDFs to get started."
7. Long file name → truncated with tooltip showing full name
8. Verify documents sorted newest first

---

### Previous Story Intelligence

**From Story 2.5 - Drag-and-Drop Upload Interface (Previous Story):**

**Key Learnings:**
1. **DocumentCard type issue**: Pre-existing `DocumentCard.tsx` uses `document.status` and `document.filename` which don't exist on the `Document` type. Story 2.5 worked around this by creating an inline `DocumentListItem` in `DocumentList.tsx`. This story should fix the root cause.
2. **DocumentList already exists**: Basic document list with inline cards is already implemented and integrated into the dashboard.
3. **Store pattern**: `documentStore.ts` follows same pattern as `authStore.ts` and `researchStore.ts`.
4. **Backend list endpoint**: Already returns `DocumentListItemDto[]` with `pageCount`, `textExtracted`, `extractionError` fields.
5. **Code review fixes applied**: Delete endpoint added, full-page overlay fixed, batch toast counting fixed, DTOs added.

**From Story 2.4 - PDF Text Extraction Pipeline:**

**Key Learnings:**
1. **Extraction status fields**: `textExtracted` (boolean), `extractionError` (string|null), `pageCount` (number|null)
2. **Async processing**: Extraction runs in BullMQ background job after upload; card may show "Processing" state temporarily
3. **Scanned PDF detection**: Sets `extractionError` to "Scanned PDF detected - text extraction not possible"
4. **Real-time updates**: No WebSocket yet for extraction completion (that's Epic 3). Document list must be refreshed manually or on navigation.

**Patterns to Reuse:**
- Same Zustand store consumption pattern (useDocumentStore hook in components)
- Same component composition pattern (features compose molecules and atoms)
- Same `'use client'` directive for interactive components

---

### Git Intelligence Summary

**Recent Commits:**

1. **c8d9599 - "feat: drag-and-drop upload interface with code review fixes"** (Story 2.5)
   - Created DocumentList.tsx, UploadZone.tsx, documentStore.ts, documents.ts API
   - Modified dashboard/page.tsx, documents.controller.ts, documents.service.ts
   - Added DocumentListItemDto

2. **e18f933 - "fix: pdf-parse v2 API migration and Story 2.4 uncommitted changes"** (Story 2.4 fix)
   - PDF extraction pipeline fixes

3. **4d9a9cd - "feat: pdf text extraction pipeline"** (Story 2.4)
   - BullMQ processing, PDF extraction processor

**Development Patterns:**
- Conventional commits: `feat:` for features, `fix:` for fixes
- Sequential story implementation within epics
- TypeScript strict mode enforced
- Pre-existing DocumentCard type errors are known and documented

**Expected Commit for This Story:**
```
feat: document list view with formatted metadata and status indicators

- Fix DocumentCard type issues (document.status/filename → correct Document type fields)
- Add formatted metadata display (date, file size, page count)
- Add extraction status indicators (processing spinner, ready badge, error warning)
- Add tooltip for extraction errors and long file names
- Verify empty state display
```

---

### Project Structure Notes

- Alignment with unified project structure: All modifications follow established Atomic Design and domain organization
- DocumentCard type fix resolves pre-existing technical debt from Story 2.1
- No new architectural patterns introduced — this story polishes existing components
- No detected conflicts or variances with architecture document

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.6-Document-List-View]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Calm-Confidence]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Progress-Indicators-Everywhere]
- [Source: _bmad-output/implementation-artifacts/2-5-drag-and-drop-upload-interface.md] - Previous story learnings
- [Source: apps/web/src/components/features/upload/DocumentList.tsx] - Current document list component
- [Source: apps/web/src/components/features/cards/DocumentCard.tsx] - Pre-existing card with type issues
- [Source: apps/web/src/components/atoms/Badge/Badge.tsx] - Badge component
- [Source: apps/web/src/components/features/cards/StatusBadge.tsx] - Status badge component
- [Source: apps/web/src/components/features/layout/EmptyState.tsx] - Empty state component
- [Source: apps/web/src/lib/store/documentStore.ts] - Document Zustand store
- [Source: apps/web/src/lib/api/documents.ts] - Document API module
- [Source: apps/api/src/modules/documents/documents.controller.ts] - Backend controller
- [Source: apps/api/src/modules/documents/documents.service.ts] - Backend service
- [Source: apps/api/src/modules/documents/dto/document-response.dto.ts] - Response DTOs
- [Source: packages/types/src/document.ts] - Shared Document type

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- TypeScript type error fixed: Badge component doesn't accept `title` prop — wrapped Badge in `<span>` with title attribute instead
- Replaced deprecated `onKeyPress` with `onKeyDown` in DocumentCard

### Completion Notes List

- Fixed pre-existing DocumentCard type issues: `document.status` → `getExtractionStatus()` using `textExtracted`/`extractionError`; `document.filename` → `document.fileName`
- Removed `isProcessing` prop from DocumentCard — status now derived from document data via `getExtractionStatus()`
- Refactored DocumentList to use DocumentCard component instead of inline DocumentListItem, eliminating code duplication
- Added `formatPageCount()` utility to `utils.ts` — formats null as "—", 1 as "1 page", n as "n pages"
- DocumentCard shows extraction status via icon area (spinner/warning/description), Badge (Processing/Error/Ready), and error text
- Extraction error tooltip implemented via native `title` attribute (MVP approach per dev notes)
- File name truncation via CSS `truncate` class with `title` attribute for full name on hover
- Backend endpoint verified: returns all required DTO fields, user-scoped, sorted DESC
- No new dependencies introduced
- All typechecks and lints pass with no new errors

### Change Log

- 2026-02-07: Story 2.6 implementation — Document list view with formatted metadata and status indicators
- 2026-02-07: Code review fixes — keyboard a11y guard, double padding fix, redundant sort removal, aria-disabled for processing state, task 2.4 description corrected

### File List

- `apps/web/src/components/features/cards/DocumentCard.tsx` — Fixed type issues, extraction status logic, formatted metadata
- `apps/web/src/components/features/upload/DocumentList.tsx` — Refactored to use DocumentCard instead of inline DocumentListItem
- `apps/web/src/lib/utils.ts` — Added `formatPageCount()` utility function
