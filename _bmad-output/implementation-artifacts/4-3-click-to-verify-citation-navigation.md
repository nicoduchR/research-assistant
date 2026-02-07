# Story 4.3: Click-to-Verify Citation Navigation

Status: done

## Story

As a working professional,
I want to click a citation in my literature review and immediately see the source PDF at the exact page,
so that I can verify the AI's claims and ensure academic accuracy.

## Acceptance Criteria

1. **Given** my literature review contains citations, **When** a citation is rendered, **Then** the citation appears as a clickable element (superscript number) with visual affordance (color, underline, cursor pointer) — already implemented in `InlineCitation` component.

2. **Given** I click on a citation, **When** the citation is clicked, **Then** the citation data is retrieved (`documentId`, `pageNumber`), the PDF viewer side panel opens (if not already open), a request is made to `/api/v1/documents/{documentId}/file`, the PDF loads in the viewer, and the viewer automatically navigates to the specified page number.

3. **Given** the citation has a specific page number (e.g., page 12), **When** the PDF loads, **Then** the viewer jumps directly to page 12, page 12 is rendered and visible, and the page indicator shows "Page 12 of N".

4. **Given** the citation has no page number (`null`), **When** I click the citation, **Then** the PDF loads at page 1 and a toast message is displayed: "Page number not available — showing from beginning".

5. **Given** I click multiple different citations, **When** each citation is clicked, **Then** the viewer switches to the correct document and page for each citation, and the previous document is replaced by the new document.

6. **Given** the PDF document is not available, **When** I click a citation referencing a missing document, **Then** an error message appears in the viewer ("Source document not found"), and other citations remain functional.

## Tasks / Subtasks

- [x] Task 1: Add onClick handler to InlineCitation component (AC: #1, #2)
  - [x] 1.1 Import `usePdfViewerStore` in `LiteratureReviewContent.tsx`
  - [x] 1.2 Pass `openViewer` action and document data to `InlineCitation`
  - [x] 1.3 Add `onClick` handler that calls `openViewer(documentId, documentName, pageNumber ?? 1)`
  - [x] 1.4 Add keyboard support: `onKeyDown` for Enter/Space triggers same action
  - [x] 1.5 Show toast when `pageNumber` is `null` ("Page number not available — showing from beginning")

- [x] Task 2: Implement targetPage navigation in PdfViewer (AC: #3)
  - [x] 2.1 Read `targetPage` from `usePdfViewerStore` in `PdfViewer.tsx`
  - [x] 2.2 In `onLoadSuccess` callback, if `targetPage` is set, call `setPage(targetPage)` to navigate
  - [x] 2.3 Ensure the `<Page pageNumber={currentPage}>` renders the correct page (this already works since `currentPage` drives the render)
  - [x] 2.4 Clear `targetPage` after navigation to prevent re-navigation on re-renders

- [x] Task 3: Handle document switching for multiple citations (AC: #5)
  - [x] 3.1 When `openViewer` is called with a different `documentId`, reset loading/error state and load new document
  - [x] 3.2 When `openViewer` is called with the SAME `documentId` but different page, just update `currentPage` directly (no reload needed)
  - [x] 3.3 Verify `fileSource` memoization in PdfViewer triggers re-fetch only when `documentId` changes

- [x] Task 4: Handle error states for missing documents (AC: #6)
  - [x] 4.1 The existing `onLoadError` handler in PdfViewer already displays error state with retry — verify it works for 404 responses
  - [x] 4.2 Ensure error state is scoped to viewer panel (does not break other citations)

- [x] Task 5: Add targetPage clearing action to pdfViewerStore (AC: #3)
  - [x] 5.1 Add `clearTargetPage` action (or modify `setPage` to also clear `targetPage`)
  - [x] 5.2 Ensure `openViewer` sets `targetPage` when page parameter is provided

- [x] Task 6: Verify typecheck, build, and no regressions (AC: all)
  - [x] 6.1 Run `pnpm typecheck` — all 4 packages pass
  - [x] 6.2 Run `pnpm build` (ignore pre-existing root useSearchParams warning)
  - [x] 6.3 Run `cd apps/api && pnpm run build` — clean
  - [x] 6.4 Verify 83+ existing tests pass with 0 regressions

## Dev Notes

### Architecture & Patterns

**This story connects two existing systems — NO new files needed:**
- The inline citation rendering system (Story 3.4/3.7) in `LiteratureReviewContent.tsx`
- The PDF viewer infrastructure (Story 4.1/4.2) with `pdfViewerStore`, `PdfViewer`, `PdfPanel`

**The `openViewer` action already accepts a `page` parameter** and the store already has a `targetPage` field. The primary work is wiring the click handler and ensuring page navigation works on load.

### Key Files to Modify

| File | Change |
|------|--------|
| `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` | Add onClick to InlineCitation calling `openViewer` |
| `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` | Use `targetPage` in `onLoadSuccess` to navigate after PDF loads |
| `apps/web/src/lib/store/pdfViewerStore.ts` | Add `clearTargetPage` action, ensure same-doc page switching |

### Existing Code Patterns (MUST follow)

**Zustand store selectors** — Use individual selectors, NOT full destructure:
```typescript
// CORRECT
const openViewer = usePdfViewerStore((s) => s.openViewer);
// WRONG — causes unnecessary re-renders
const { openViewer } = usePdfViewerStore();
```

**Material icons** — Already used in PdfPanel close button:
```tsx
<span className="material-symbols-outlined text-[18px]">close</span>
```

**Toast system** — For null page number notification:
```typescript
import { useToastStore } from '@/lib/store/toastStore';
useToastStore.getState().addToast('Page number not available — showing from beginning', 'info');
```

**react-pdf page navigation** — Simply update the `pageNumber` prop on `<Page>`:
```tsx
<Page pageNumber={currentPage} width={containerWidth} />
// Changing currentPage in the store re-renders with new page
```

**Dynamic import for SSR safety** — PdfPanel already uses `next/dynamic` with `{ ssr: false }`. No changes needed.

### InlineCitation Current Implementation (LiteratureReviewContent.tsx)

The `InlineCitation` component already has:
- `cursor-pointer` styling
- `role="button"` and `tabIndex={0}` accessibility attributes
- Tooltip showing document name and page number on hover
- Receives `documentId` and `pageNumber` from parsed citation data (`[uuid:page]` format)

**What's missing:** An `onClick` handler that calls `openViewer(documentId, documentName, pageNumber)`.

### PdfViewer Current Page Rendering

The `PdfViewer.tsx` component renders `<Page pageNumber={currentPage}>` where `currentPage` comes from the store. The `openViewer` action sets `currentPage` to the provided page (or 1 if not provided) and sets `targetPage`.

**What's missing:** After `onLoadSuccess`, if `targetPage` is set, update `currentPage` to `targetPage` and clear `targetPage`. This handles the case where a PDF needs to load first before navigating.

### Same-Document Page Switching

When clicking a second citation from the SAME document but a DIFFERENT page:
- The PDF is already loaded — no need to re-fetch
- Just update `currentPage` in the store
- The `fileSource` memoization (`useMemo` on `documentId`) ensures no unnecessary re-downloads
- Detect this case in `openViewer`: if `documentId` matches current, skip loading state and directly set page

### Project Structure Notes

- All modifications are within existing feature components — no new files
- Component organization: `apps/web/src/components/features/literature-review/` and `apps/web/src/components/features/pdf-viewer/`
- Shared types in `packages/types/src/citation.ts` — `Citation` interface has `documentId` and `pageNumber` fields
- Store pattern: `apps/web/src/lib/store/` directory with camelCase naming

### Previous Story Learnings (from 4.1 & 4.2)

- **Use individual store selectors** — Code review fix from 4.2 (M2)
- **Error state must be cleared on successful load** — Code review fix from 4.2 (M5): `error: null` set in `setTotalPages`
- **Store reset on navigation** — Code review fix from 4.2 (H2): cleanup `useEffect` in page component already handles this
- **ResizeObserver for container width** — Established pattern from 4.2 (M1)
- **Pre-existing Next.js build warning** — `useSearchParams` without Suspense on root `/` page is unrelated, ignore
- **83+ tests passing** — Must verify 0 regressions after changes

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — Citation Traceability System, PDF Viewer Integration]
- [Source: _bmad-output/planning-artifacts/prd.md — FR16, FR17, FR18, FR19, FR20]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Trust Through Transparency, Click-to-Verify UX]
- [Source: _bmad-output/implementation-artifacts/4-1-pdf-file-serving-with-authorization.md — Dev Notes]
- [Source: _bmad-output/implementation-artifacts/4-2-pdf-viewer-component.md — Dev Notes, Code Patterns]
- [Source: apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx — InlineCitation component]
- [Source: apps/web/src/lib/store/pdfViewerStore.ts — openViewer, targetPage]
- [Source: apps/web/src/components/features/pdf-viewer/PdfViewer.tsx — Page rendering]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- **Task 1:** Added `onClick` and `onKeyDown` handlers to `InlineCitation` component. Imported `usePdfViewerStore` (individual selector pattern) and `useToastStore`. When a citation is clicked, `openViewer(documentId, documentName, pageNumber ?? 1)` is called. If `pageNumber` is `null`, an info toast is shown first. `documentId` is now passed as a prop to `InlineCitation`.
- **Task 2:** In `PdfViewer.tsx`, after `onLoadSuccess`, the component reads `targetPage` from the store via `getState()` (avoids stale closures). If set, it calls `setPage(targetPage)` then `clearTargetPage()`. This ensures page navigation happens after PDF load completes.
- **Task 3:** Modified `openViewer` in the store to detect same-document navigation: if `documentId` matches the currently open document, only `currentPage` and `targetPage` are updated (no loading reset, no re-fetch). For different documents, full loading state is reset. `fileSource` memoization on `documentId` ensures no unnecessary re-downloads.
- **Task 4:** Verified existing error handling: `onLoadError` catches 404s and displays error UI with retry button, scoped entirely within the viewer panel. Other citations remain functional.
- **Task 5:** Added `clearTargetPage` action to `pdfViewerStore`. `openViewer` already set `targetPage` when page parameter was provided.
- **Task 6:** `pnpm typecheck` passes clean. `pnpm build` has pre-existing `useSearchParams` error on root `/` page (documented, unrelated). `apps/api` build clean. 83 tests pass with 0 regressions.

### File List

- `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` (modified) — Added onClick/onKeyDown handlers to InlineCitation, imported store hooks, passed documentId prop
- `apps/web/src/lib/store/pdfViewerStore.ts` (modified) — Added clearTargetPage action, retryLoad action with retryCount state, same-document detection in openViewer with race condition guard, page bounds clamping in setPage
- `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` (modified) — Added targetPage navigation in onLoadSuccess callback, differentiated 404 error message ("Source document not found") with fallback message check, clamped targetPage to numPages bounds, added dynamic error display from store, added Document key for retry remount
- `apps/web/src/components/features/pdf-viewer/PdfPanel.tsx` (modified) — Fixed store destructuring to use individual selectors (prevents unnecessary re-renders)

### Change Log

- 2026-02-07: Implemented click-to-verify citation navigation — wired InlineCitation onClick to open PDF viewer at the cited page, added same-document page switching, added targetPage clearing after navigation, added null-page toast notification
- 2026-02-07: Code review fixes (round 1) — (H1) differentiated 404 error as "Source document not found" per AC #6, (M1) fixed PdfPanel store destructuring to individual selectors, (M2) added page bounds clamping in targetPage navigation and same-document path
- 2026-02-07: Code review fixes (round 2) — (H1) fixed broken retry: added retryCount state + retryLoad action + Document key for forced remount, (H2) added empty documentId guard in InlineCitation handleClick, (M1) fixed same-document race condition during initial load — queues targetPage when totalPages is null, (M2) broadened 404 detection to check error message as fallback, removed documentId from console output, (M3) added bounds clamping in setPage action
