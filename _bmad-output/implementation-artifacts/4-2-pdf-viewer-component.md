# Story 4.2: PDF Viewer Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional pursuing an MBA,
I want to view my PDF documents in a side panel,
so that I can read the source material while reviewing my literature synthesis.

## Acceptance Criteria

1. **Given** I am viewing my literature review **When** the page loads **Then** a collapsible side panel is available (initially hidden or collapsed) **And** the main content area adjusts when the panel opens (split-view layout) **And** on desktop (1024px+), the split is approximately 60/40 (content/viewer)

2. **Given** I open the PDF viewer panel **When** a PDF document is selected **Then** the react-pdf library is used to render the PDF **And** the PDF loads in the side panel **And** a loading spinner is displayed while the PDF loads **And** the first page is displayed by default

3. **Given** the PDF has multiple pages **When** the PDF is rendered **Then** the current page number is displayed (e.g., "Page 3 of 24") **And** the total page count is shown **And** the page renders clearly and is readable

4. **Given** the PDF fails to load **When** the loading error occurs **Then** an error message is displayed: "Unable to load PDF. Please try again." **And** a retry button is available **And** the error is logged with document ID

5. **Given** the side panel is open **When** the viewport is resized **Then** the PDF viewer adjusts responsively **And** the layout remains usable on tablet (768-1023px) with basic support **And** on mobile (<768px), the panel may overlap or stack (minimal support)

## Tasks / Subtasks

- [x] Task 1: Create PDF viewer Zustand store (AC: #1, #2, #3, #4)
  - [x] 1.1 Create `apps/web/src/lib/store/pdfViewerStore.ts` with state: `isOpen: boolean`, `documentId: string | null`, `documentName: string | null`, `currentPage: number`, `totalPages: number | null`, `isLoading: boolean`, `error: string | null`, `targetPage: number | null` (for citation navigation in Story 4.3)
  - [x] 1.2 Add actions: `openViewer(documentId: string, documentName: string, page?: number)`, `closeViewer()`, `setPage(page: number)`, `setTotalPages(totalPages: number)`, `setLoading(isLoading: boolean)`, `setError(error: string | null)`, `reset()`
  - [x] 1.3 Export the store as `usePdfViewerStore`

- [x] Task 2: Create the PdfViewer client component (AC: #2, #3, #4)
  - [x] 2.1 Create `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` as a `'use client'` component
  - [x] 2.2 Configure pdf.js worker: `pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();`
  - [x] 2.3 Import required CSS: `import 'react-pdf/dist/Page/AnnotationLayer.css';` and `import 'react-pdf/dist/Page/TextLayer.css';`
  - [x] 2.4 Use react-pdf `Document` component with `file={{ url: getDocumentFileUrl(documentId), withCredentials: true }}` to load PDFs from the authenticated backend endpoint
  - [x] 2.5 Use react-pdf `Page` component with `pageNumber={currentPage}` and `width` prop calculated from container width (use a ref on the container div to measure available width)
  - [x] 2.6 Implement `onLoadSuccess` callback on `Document` to set `totalPages` via the store
  - [x] 2.7 Implement `onLoadError` callback on `Document` to set error state and log `console.error('PDF Load Error for document:', documentId, error)`
  - [x] 2.8 Add loading state: show `Document`'s `loading` prop with a centered spinner while PDF loads
  - [x] 2.9 Add error state: show `Document`'s `error` prop with error message "Unable to load PDF. Please try again." and a retry button that calls `openViewer` again with the same documentId
  - [x] 2.10 Display page indicator: "Page {currentPage} of {totalPages}" below the rendered page

- [x] Task 3: Create the PdfPanel wrapper component (AC: #1, #5)
  - [x] 3.1 Create `apps/web/src/components/features/pdf-viewer/PdfPanel.tsx` as a `'use client'` component
  - [x] 3.2 The panel renders conditionally based on `usePdfViewerStore().isOpen` — when closed, render nothing (return null)
  - [x] 3.3 When open, render a side panel with: header (document name + close button), PdfViewer component, and page indicator
  - [x] 3.4 Add close button (X icon using `material-symbols-outlined`) in panel header that calls `closeViewer()`
  - [x] 3.5 Style the panel: `w-full lg:w-[40%]` with `border-l border-slate-200 dark:border-slate-700`, `bg-white dark:bg-slate-800`, and `overflow-y-auto` for scrolling within the PDF
  - [x] 3.6 Panel header: document name truncated with `truncate` class, close button right-aligned

- [x] Task 4: Create dynamic import wrapper for Next.js SSR compatibility (AC: #2)
  - [x] 4.1 Create `apps/web/src/components/features/pdf-viewer/PdfPanelDynamic.tsx` that uses `next/dynamic` with `{ ssr: false }` to import `PdfPanel` — this prevents react-pdf from running on the server
  - [x] 4.2 Export as `PdfPanelDynamic` for use in the literature review page

- [x] Task 5: Integrate PDF viewer panel into the literature review page (AC: #1, #5)
  - [x] 5.1 Modify `apps/web/app/literature-review/[id]/page.tsx` — import `PdfPanelDynamic` and `usePdfViewerStore`
  - [x] 5.2 Change the main layout from the current `flex-col lg:flex-row lg:gap-6` to a split-view: wrap the existing content (primary column + methodology sidebar) in a `flex-1` container, and add PdfPanelDynamic as a sibling
  - [x] 5.3 When the PDF panel is open, the primary content area should shrink (flex-1 with `min-w-0` to allow shrinking) and the panel takes `lg:w-[40%]`
  - [x] 5.4 When the PDF panel is closed, the layout remains unchanged (full width for content + methodology sidebar as-is)
  - [x] 5.5 Ensure the methodology sidebar remains functional — it may need to move below the content on smaller screens when the PDF panel is open

- [x] Task 6: Verify build, types, and no regressions (AC: all)
  - [x] 6.1 Run `pnpm typecheck` — all packages pass
  - [x] 6.2 Run `pnpm build` in apps/web — compiles without errors (ignore pre-existing useSearchParams Suspense warning)
  - [x] 6.3 Run existing test suite — no regressions (83+ tests)
  - [x] 6.4 Run `nest build` in apps/api — compiles without errors (backend unchanged, but verify)
  - [ ] 6.5 Manual verification: open the literature review page, verify layout is unchanged when panel is closed
  - [ ] 6.6 Manual verification: programmatically call `usePdfViewerStore.getState().openViewer(docId, docName)` from browser console to test panel opens with PDF rendering

## Dev Notes

### Story Context

This is **Story 4.2** in **Epic 4: Citation Verification & PDF Viewer** — the second story. It creates the PDF viewer side panel component that will display PDFs loaded from the backend endpoint created in Story 4.1.

**Functional Requirements Covered:** FR16 (view PDF documents in side panel), partially FR17 (navigate to specific page — basic page display; full navigation controls are Story 4.4)

**Design Reference:** Design 06: PDF Viewer with Citation Highlight

**Critical Dependency Chain:**
- **Depends on:** Story 4.1 (PDF File Serving endpoint — `GET /api/v1/documents/:id/file` — STATUS: DONE), Story 3.7 (Literature Review Display — the page where the PDF panel will be integrated — STATUS: DONE)
- **Depended on by:** Story 4.3 (Click-to-Verify Citation Navigation — will use `openViewer(documentId, documentName, pageNumber)` to trigger PDF loading at specific pages), Story 4.4 (PDF Viewer Controls — will add prev/next buttons, page input, zoom on top of this component)

**What's Already Built (Do NOT Recreate):**

- **PDF file serving endpoint** — `GET /api/v1/documents/:id/file` — Serves PDF binary data with JWT auth, CORS enabled, Content-Type `application/pdf`, Content-Disposition `inline`. Created in Story 4.1. [Source: `apps/api/src/modules/documents/documents.controller.ts`]

- **Frontend URL helper** — `getDocumentFileUrl(documentId)` returns `${API_BASE_URL}/api/v1/documents/${documentId}/file`. Already exists in `apps/web/src/lib/api/documents.ts`. [Source: `apps/web/src/lib/api/documents.ts:32-34`]

- **API_BASE_URL** — Exported from `apps/web/src/lib/api/axiosInstance.ts` as `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'`. [Source: `apps/web/src/lib/api/axiosInstance.ts:5`]

- **react-pdf v10.3.0** — Already installed in `apps/web/package.json` along with `pdfjs-dist ^5.4.530`. No new packages needed. [Source: `apps/web/package.json`]

- **Literature review page** — `apps/web/app/literature-review/[id]/page.tsx` — Full page with header, back button, review title/date, edit button, content with inline citations, partial result warnings, bibliography section, and methodology tracker sidebar. Layout: `flex-col lg:flex-row lg:gap-6` with primary column `flex-1 max-w-4xl` and sidebar `w-full lg:w-80 lg:flex-shrink-0`. [Source: `apps/web/app/literature-review/[id]/page.tsx`]

- **LiteratureReviewContent component** — `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` — Renders review content with inline citation markers (superscript numbers). Citations show tooltips on hover with document name and page number. Citation data includes `documentId` and `pageNumber` — these are the exact values needed for Story 4.3's click-to-verify. [Source: `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx`]

- **InlineCitation component** — Inside `LiteratureReviewContent.tsx` — Renders `<sup>` elements with hover tooltips. Currently has `role="button"` and `cursor-pointer` styling but no click handler. Story 4.3 will add the onClick to call `openViewer(documentId, documentName, pageNumber)`. [Source: `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx:111-138`]

- **Citation data structure** — Each citation has: `id`, `documentId` (UUID), `pageNumber` (number | null), `claimText`, `positionInReview`, `isVerified`, `userNotes`. [Source: `packages/types/src/citation.ts`]

- **Zustand stores** — Located at `apps/web/src/lib/store/`. Existing stores: `authStore.ts`, `documentStore.ts`, `toastStore.ts`, `literatureReviewStore.ts`, `processingStore.ts`. Pattern: `create<StoreType>()((set, get) => ({ ...initialState, actions }))`. [Source: `apps/web/src/lib/store/`]

- **Existing skeleton PDFViewer component** — `apps/web/src/components/organisms/PDFViewer/PDFViewer.tsx` — A UI shell with header (filename + page count), pagination controls (prev/next + page input), zoom controls (in/out/reset), and download button. Contains a placeholder div: "PDF rendering will be implemented with react-pdf library". This component was created in Story 2.1 (UI component library) and includes controls that belong to Story 4.4 (zoom, prev/next, page input). **Do NOT use or modify this skeleton for Story 4.2.** Create new components in `features/pdf-viewer/` as specified — the skeleton has a different architecture (prop-driven, internal state) that doesn't align with the Zustand store pattern needed for cross-component communication (citation → viewer). Story 4.4 may later reference or replace the skeleton. [Source: `apps/web/src/components/organisms/PDFViewer/PDFViewer.tsx`]

- **Toast system** — `useToastStore().addToast(message, type)` with types: success, error, info, warning. [Source: `apps/web/src/lib/store/toastStore.ts`]

- **Custom UI components** — Atoms: `Button` (variants: primary, secondary, destructive, icon; sizes: sm, md, lg). Uses Tailwind CSS custom tokens (e.g., `bg-primary`, `text-primary-foreground`). [Source: `apps/web/src/components/atoms/Button/Button.tsx`]

- **Material icons** — Use `<span className="material-symbols-outlined text-[18px]">icon_name</span>` pattern for icons (e.g., `close`, `arrow_back`). [Source: literature-review page pattern]

**What NOT to Build:**

- Do NOT add citation click handlers — that's Story 4.3 (Click-to-Verify Citation Navigation)
- Do NOT add page navigation controls (prev/next buttons, page input) — that's Story 4.4 (PDF Viewer Controls)
- Do NOT add zoom controls — that's Story 4.4 (optional for MVP)
- Do NOT modify backend code — backend is complete from Story 4.1
- Do NOT create new entities or migrations — no schema changes
- Do NOT add a "Select Document" button or document picker — citation clicks (Story 4.3) will trigger document loading
- Do NOT render all pages simultaneously — render only the current page for performance

---

### Technical Requirements

**react-pdf v10.x Setup for Next.js App Router:**

```typescript
// PdfViewer.tsx — MUST be 'use client'
'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getDocumentFileUrl } from '@/src/lib/api/documents';
import { usePdfViewerStore } from '@/src/lib/store/pdfViewerStore';

// CRITICAL: Configure worker in the same file as Document component
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
```

**File prop for authenticated PDF loading:**

```typescript
// CRITICAL: The file object uses strict equality (===) to detect changes.
// You MUST memoize it with useMemo to prevent infinite re-renders/re-downloads.
const fileSource = useMemo(() => ({
  url: getDocumentFileUrl(documentId),
  withCredentials: true,
}), [documentId]);

<Document
  file={fileSource}
  onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
  onLoadError={(error) => {
    console.error('PDF Load Error for document:', documentId, error);
    setError('Unable to load PDF. Please try again.');
  }}
  loading={<LoadingSpinner />}
  error={<ErrorState onRetry={handleRetry} />}
>
  <Page
    pageNumber={currentPage}
    width={containerWidth}
  />
</Document>
```

**Dynamic import for Next.js SSR compatibility:**

```typescript
// PdfPanelDynamic.tsx
import dynamic from 'next/dynamic';

const PdfPanel = dynamic(
  () => import('./PdfPanel').then((mod) => mod.PdfPanel),
  { ssr: false }
);

export function PdfPanelDynamic() {
  return <PdfPanel />;
}
```

**Why `ssr: false` is required:** react-pdf and pdfjs-dist use browser APIs (Canvas, Web Workers) that don't exist on the server. Next.js App Router pre-renders components on the server by default. Without `ssr: false`, the build will fail with `ReferenceError: window is not defined` or similar errors.

**Container width measurement for responsive Page rendering:**

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState(0);

useEffect(() => {
  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth - 32); // 32px for padding
    }
  };
  updateWidth();
  window.addEventListener('resize', updateWidth);
  return () => window.removeEventListener('resize', updateWidth);
}, []);
```

**Zustand store pattern (following existing codebase conventions):**

```typescript
// pdfViewerStore.ts
import { create } from 'zustand';

interface PdfViewerState {
  isOpen: boolean;
  documentId: string | null;
  documentName: string | null;
  currentPage: number;
  totalPages: number | null;
  isLoading: boolean;
  error: string | null;
  targetPage: number | null; // For Story 4.3 citation navigation
}

interface PdfViewerActions {
  openViewer: (documentId: string, documentName: string, page?: number) => void;
  closeViewer: () => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
```

**Split-view layout integration:**

The current literature review page uses `max-w-7xl mx-auto` for content centering. When the PDF panel opens, we need the layout to expand to use more screen space. The approach:

```tsx
// In literature-review/[id]/page.tsx
const { isOpen } = usePdfViewerStore();

return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    <Header />
    <main className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isOpen ? 'max-w-full' : 'max-w-7xl'}`}>
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Existing content (primary + methodology sidebar) */}
        <div className={`flex-1 min-w-0 ${isOpen ? '' : ''}`}>
          <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="flex-1 max-w-4xl">
              {/* ... existing review content ... */}
            </div>
            <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-6 lg:mt-0">
              <MethodologyProgressTracker />
            </aside>
          </div>
        </div>

        {/* PDF Viewer Panel */}
        <PdfPanelDynamic />
      </div>
    </main>
  </div>
);
```

---

### Architecture Compliance

**Frontend Patterns:**
- PascalCase component files: `PdfViewer.tsx`, `PdfPanel.tsx`, `PdfPanelDynamic.tsx` [Source: architecture.md#Naming-Patterns]
- Feature components in `src/components/features/pdf-viewer/` directory [Source: architecture.md#Component-Boundaries]
- Zustand store at `src/lib/store/pdfViewerStore.ts` following existing store pattern [Source: architecture.md#State-Management]
- `'use client'` directive for interactive components [Source: architecture.md#Frontend-Architecture]
- Dynamic import with `ssr: false` for browser-only libraries [Source: react-pdf docs + Next.js App Router requirements]

**UX Compliance:**
- Desktop-first split-view layout (60/40) [Source: ux-design-specification.md#Platform-Strategy]
- Loading spinner during PDF load [Source: ux-design-specification.md#Experience-Principles — Calm Confidence]
- Error message with retry button [Source: ux-design-specification.md#Experience-Principles — Error Recovery]
- Panel close button to dismiss viewer [Source: epics.md#Story-4.4 AC — close button]
- Responsive behavior: tablet basic support, mobile minimal [Source: ux-design-specification.md#Platform-Strategy]

**API Integration:**
- PDF loaded via `getDocumentFileUrl(documentId)` → `GET /api/v1/documents/:id/file` [Source: architecture.md#API-Boundaries]
- Authentication via httpOnly cookie with `withCredentials: true` [Source: architecture.md#Authentication-Security]
- CORS already configured for cross-origin PDF loading [Source: architecture.md#CORS]

---

### Library & Framework Requirements

**No New Package Installation Required.**

All needed packages are already installed:

| Package | Location | Version | Usage in This Story |
|---------|----------|---------|---------------------|
| `react-pdf` | apps/web | v10.3.0 | `Document`, `Page`, `pdfjs` components |
| `pdfjs-dist` | apps/web | ^5.4.530 | PDF.js worker for rendering |
| `zustand` | apps/web | (existing) | PDF viewer state management |
| `next/dynamic` | apps/web | (built-in) | SSR-safe dynamic import |

**CSS imports required (v10.x paths — NOT the old v9 `/dist/esm/` paths):**
- `import 'react-pdf/dist/Page/AnnotationLayer.css';`
- `import 'react-pdf/dist/Page/TextLayer.css';`

**No migrations needed** — no schema changes.

---

### File Structure Requirements

**Files to Create:**

```
apps/web/src/lib/store/pdfViewerStore.ts                           # NEW: PDF viewer Zustand store
apps/web/src/components/features/pdf-viewer/PdfViewer.tsx           # NEW: Core PDF rendering component
apps/web/src/components/features/pdf-viewer/PdfPanel.tsx            # NEW: Side panel wrapper with header/close
apps/web/src/components/features/pdf-viewer/PdfPanelDynamic.tsx     # NEW: Dynamic import wrapper (ssr: false)
```

**Files to Modify:**

```
apps/web/app/literature-review/[id]/page.tsx                        # MODIFY: Add PdfPanelDynamic and split-view layout
```

**No Changes Expected To:**

```
apps/api/                                                           # No backend changes
packages/types/                                                     # No new types needed
apps/web/src/lib/api/documents.ts                                   # Already has getDocumentFileUrl
apps/web/src/lib/api/axiosInstance.ts                               # Already exports API_BASE_URL
apps/web/src/components/features/literature-review/                 # Do NOT modify citation click behavior (Story 4.3)
```

**Total estimated file changes:** 4 files created, 1 file modified.

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages (apps/api, apps/web, packages/types)
2. `pnpm build` in apps/web compiles without errors (ignore pre-existing useSearchParams Suspense warning on root `/` page)
3. Existing test suite passes (no regressions) — 83+ tests as of Story 4.1
4. **Panel hidden by default:** Navigate to `/literature-review/{id}` — verify the page looks identical to before this story (no visible PDF panel)
5. **Panel opens programmatically:** Open browser console, run `window.__pdfViewerStore = require('@/src/lib/store/pdfViewerStore').usePdfViewerStore; window.__pdfViewerStore.getState().openViewer('VALID-DOC-UUID', 'test.pdf')` — verify side panel appears with PDF loaded
6. **Loading state:** While PDF is loading, verify a spinner is shown in the panel
7. **PDF renders correctly:** Verify the first page of the PDF is visible and readable
8. **Page count displayed:** Verify "Page 1 of N" is shown
9. **Error handling:** Use an invalid document ID — verify "Unable to load PDF" error message appears with retry button
10. **Close button:** Click the X button in panel header — verify panel closes and layout returns to full width
11. **Responsive:** Resize browser to tablet width (768-1023px) — verify layout is still usable
12. **No regressions:** Verify existing edit button, bibliography section, methodology tracker all still work

---

### Previous Story Intelligence

**From Story 4.1 - PDF File Serving with Authorization (Most Recent, Direct Dependency):**

**Key Learnings:**
1. **83+ tests passing** — Ensure no regressions after changes
2. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored.
3. **`getDocumentFileUrl(documentId)`** already exists in `apps/web/src/lib/api/documents.ts` — returns `${API_BASE_URL}/api/v1/documents/${documentId}/file`
4. **`API_BASE_URL`** already exported from `apps/web/src/lib/api/axiosInstance.ts`
5. **File serving with `withCredentials: true`** is the pattern for react-pdf — httpOnly cookie sent automatically
6. **Code review fixes from 4.1:** RFC 6266 Content-Disposition encoding for non-ASCII filenames, replaced sync existsSync with async fs.access, added ParseUUIDPipe to delete endpoint

**From Story 3.7 - Literature Review Display (Page Integration Target):**
1. **Current layout** — `flex-col lg:flex-row lg:gap-6` with primary column `flex-1 max-w-4xl` and methodology sidebar `w-full lg:w-80 lg:flex-shrink-0`
2. **InlineCitation component** — Already has `role="button"`, `cursor-pointer`, `tabIndex={0}` — ready for click handler in Story 4.3
3. **Citation data** — Each citation has `documentId` and `pageNumber` — exactly what `openViewer()` needs
4. **Material icons pattern** — `<span className="material-symbols-outlined text-[18px]">icon_name</span>`

**From Story 3.10 - Bibliography Export:**
1. **Toast system** — `useToastStore().addToast(message, type)` for error feedback

**Code Patterns to Follow:**
- Zustand store: `create<StoreType>()((set, get) => ({ ...initialState, actions }))`
- `'use client'` directive for all interactive components
- Tailwind CSS with dark mode support (`dark:` prefix)
- Material symbols for icons
- Component file naming: PascalCase `.tsx` files

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **295ff8c** — `feat: pdf file serving with authorization with code review fixes (story 4.1)` — Direct dependency
2. **5730429** — `feat: bibliography export and citation formatting with code review fixes (story 3.10)` — Bibliography section
3. **b562058** — `feat: error handling and partial results with code review fixes (story 3.9)` — Partial results UI
4. **836a51a** — `feat: methodology progress tracker on literature review page with code review fixes (story 3.8)` — Methodology sidebar
5. **b91b0ad** — `feat: literature review display and editing with inline citations and code review fixes (story 3.7)` — Literature review page

**Commit Message Pattern:** `feat: <description> with code review fixes (story X.Y)`

**Expected Commit for This Story:**
```
feat: pdf viewer component with code review fixes (story 4.2)
```

**Files Changed in Recent Commits (Relevant to This Story):**
- `apps/web/app/literature-review/[id]/page.tsx` — Modified in stories 3.7-3.10, will be MODIFIED (add split-view layout)
- `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` — Modified in 3.7, NOT modified in this story (Story 4.3 will add click handlers)
- `apps/web/src/lib/api/documents.ts` — Modified in 4.1 (added getDocumentFileUrl), NOT modified in this story

---

### Latest Tech Information

**react-pdf v10.3.0 (current, installed):**

- **ESM-only distribution** — No CJS builds; v10.x uses `/dist/` not `/dist/esm/` or `/dist/cjs/`
- **CSS imports** — `import 'react-pdf/dist/Page/AnnotationLayer.css';` and `import 'react-pdf/dist/Page/TextLayer.css';` (drop the `/esm` segment from v9.x paths)
- **Worker configuration** — Must use `pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();` — configure in the SAME file as the Document component
- **Next.js App Router** — Must use `'use client'` and dynamically import with `{ ssr: false }` to prevent SSR issues
- **File prop** — Accepts `{ url: string, withCredentials: true }` object for authenticated requests (sends httpOnly cookies)
- **Document component** — Props: `file`, `onLoadSuccess({ numPages })`, `onLoadError(error)`, `loading` (React node), `error` (React node), `noData` (React node)
- **Page component** — Props: `pageNumber` (1-indexed), `width` (pixels), `scale`, `renderTextLayer`, `renderAnnotationLayer`
- **Performance** — Only render the visible page (single `<Page>` component), not all pages at once. `numPages` from `onLoadSuccess` tells total count.

**Known pitfalls:**
- Worker must be configured before any `Document` renders
- `file` prop re-renders the Document when it changes — use stable references (memoize if needed)
- CSS imports are required for text selection and link annotations to work properly

---

### Project Structure Notes

- **App directory is `apps/web/app/`** (NOT `apps/web/src/app/`) — Pages/routes live here
- **Components are in `apps/web/src/components/`** — Feature components in `features/` subdirectory
- **Stores are in `apps/web/src/lib/store/`** — Zustand stores following the `create` pattern
- **API clients are in `apps/web/src/lib/api/`** — Axios-based API functions
- The PDF viewer component tree: `PdfPanelDynamic` (dynamic import) → `PdfPanel` (layout/header/close) → `PdfViewer` (react-pdf rendering)
- The `targetPage` field in the store is included for Story 4.3 — when a citation is clicked, `openViewer(docId, docName, pageNumber)` will set both `documentId` and `targetPage`, and the PdfViewer can navigate to that page on load
- This story does NOT make citations clickable — it only creates the viewer infrastructure that citations will use

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2-PDF-Viewer-Component] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-4] — Epic context, FR16-FR20 PDF viewer requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — react-pdf v10.3.0, Zustand stores, component organization
- [Source: _bmad-output/planning-artifacts/architecture.md#Component-Boundaries] — Feature-based component organization
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Boundaries] — `GET /api/v1/documents/:id/file` endpoint
- [Source: _bmad-output/planning-artifacts/architecture.md#CORS] — CORS with credentials for cross-origin PDF loading
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Platform-Strategy] — Desktop-first, split-view layout
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Citation-Verification] — Click-to-verify as trust mechanism
- [Source: apps/web/app/literature-review/[id]/page.tsx] — Literature review page to integrate with
- [Source: apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx] — Citation rendering with documentId + pageNumber
- [Source: apps/web/src/lib/api/documents.ts:32-34] — getDocumentFileUrl utility
- [Source: apps/web/src/lib/api/axiosInstance.ts:5] — API_BASE_URL export
- [Source: apps/web/src/lib/store/literatureReviewStore.ts] — Zustand store pattern to follow
- [Source: packages/types/src/citation.ts] — Citation type with documentId and pageNumber
- [Source: _bmad-output/implementation-artifacts/4-1-pdf-file-serving-with-authorization.md] — Previous story (direct dependency)
- [Source: github.com/wojtekmaj/react-pdf] — react-pdf v10.x documentation and API
- [Source: github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-9.x-to-10.x] — v10 breaking changes

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- TypeCheck: All 4 packages pass (types, utils, api, web)
- Web Build: Compiled successfully in 2.8s; static page generation fails only on pre-existing root `/` page useSearchParams Suspense issue (documented as known/ignored in story)
- Tests: 83/83 pass, 0 failures, no regressions
- API Build: `nest build` compiles without errors

### Completion Notes List

- **Task 1:** Created `pdfViewerStore.ts` Zustand store following existing codebase pattern (`create<StoreType>()((set) => ({...}))`). State includes `isOpen`, `documentId`, `documentName`, `currentPage`, `totalPages`, `isLoading`, `error`, `targetPage` (for Story 4.3). Actions: `openViewer` (resets state and sets loading), `closeViewer` (full reset), `setPage`, `setTotalPages` (also clears loading), `setLoading`, `setError` (also clears loading), `reset`.
- **Task 2:** Created `PdfViewer.tsx` with react-pdf v10.x `Document` + `Page` components. Configured pdf.js worker via `new URL()` pattern. Memoized `fileSource` with `useMemo` to prevent re-renders. Container width measured via ref + resize listener. Loading spinner, error state with retry button, and "Page X of Y" indicator all implemented per AC.
- **Task 3:** Created `PdfPanel.tsx` wrapper with conditional render (null when closed), header with truncated document name + close button (material-symbols-outlined `close` icon), and PdfViewer content area. Styled with `w-full lg:w-[40%]`, border-l, bg-white/dark, overflow-y-auto.
- **Task 4:** Created `PdfPanelDynamic.tsx` using `next/dynamic` with `{ ssr: false }` to prevent react-pdf browser API errors during SSR.
- **Task 5:** Modified literature review page to wrap existing content + methodology sidebar in `flex-1 min-w-0` container, added `PdfPanelDynamic` as sibling. Main container switches from `max-w-7xl` to `max-w-full` when panel is open. Primary column drops `max-w-4xl` constraint when panel is open to allow natural flex shrinking.
- **Task 6:** All automated verifications pass. Manual verification tasks (6.5, 6.6) left for user.

### Senior Developer Review (AI)

**Reviewer:** Nicolas (via Claude Opus 4.6 adversarial review)
**Date:** 2026-02-07
**Outcome:** Approved with fixes applied

**Issues Found:** 2 High, 4 Medium, 2 Low
**Issues Fixed:** 6 (all HIGH + MEDIUM)

**Fixes Applied:**

1. **[H1] PdfPanel missing height constraint** — Added `lg:sticky lg:top-0 lg:h-screen` to PdfPanel outer div so it scrolls independently within viewport instead of pushing page to infinite scroll. (`PdfPanel.tsx:14`)

2. **[H2] PDF viewer store not reset on navigation** — Added `resetPdfViewer()` cleanup in page useEffect to prevent stale PDF panel state when navigating between reviews. (`page.tsx:35,60`)

3. **[M1] Container width via window resize instead of ResizeObserver** — Replaced `window.addEventListener('resize')` with `ResizeObserver` on the container element to detect all layout changes (panel open/close, CSS-driven changes), not just browser window resizes. (`PdfViewer.tsx:27-39`)

4. **[M2] Store destructuring causes unnecessary re-renders** — Changed from `usePdfViewerStore()` full destructure to individual selectors (`usePdfViewerStore((s) => s.field)`) to prevent re-renders on unrelated store changes. Follows existing codebase pattern. (`PdfViewer.tsx:16-22`)

5. **[M3] Error state not cleared on successful load** — Added `error: null` to `setTotalPages` action so error state clears when a PDF loads successfully after a previous error. (`pdfViewerStore.ts:71`)

6. **[M4] Webpack config for pdf.js worker in standalone mode** — Verified: `new URL()` + `import.meta.url` pattern is the documented webpack 5 approach for react-pdf v10.x. Build passes. Runtime verification in standalone mode deferred to manual testing (Task 6.5/6.6).

**Remaining Low Issues (not fixed):**
- [L1] PdfPanelDynamic missing `loading` placeholder during chunk load
- [L2] PdfPanel `border-l` shows on mobile where `border-t` would be more appropriate

### Change Log

- 2026-02-07: Implemented PDF viewer component with Zustand store, react-pdf integration, side panel wrapper, dynamic import for SSR compatibility, and split-view layout integration into literature review page (Story 4.2)
- 2026-02-07: Code review fixes — PdfPanel height constraint, store cleanup on navigation, ResizeObserver, store selectors, error state clearing (6 issues fixed)

### File List

**New Files:**
- `apps/web/src/lib/store/pdfViewerStore.ts` — PDF viewer Zustand store
- `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` — Core PDF rendering component with react-pdf
- `apps/web/src/components/features/pdf-viewer/PdfPanel.tsx` — Side panel wrapper with header and close button
- `apps/web/src/components/features/pdf-viewer/PdfPanelDynamic.tsx` — Dynamic import wrapper (ssr: false)

**Modified Files:**
- `apps/web/app/literature-review/[id]/page.tsx` — Added PdfPanelDynamic import, usePdfViewerStore for split-view layout, wrapped content in flex-1 container
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated 4-2-pdf-viewer-component status
