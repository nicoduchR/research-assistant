# Story 4.4: PDF Viewer Controls and Navigation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional pursuing an MBA,
I want to navigate through pages, scroll, and close the PDF viewer,
so that I can explore the source document and verify multiple claims efficiently.

## Acceptance Criteria

1. **Given** a PDF is loaded in the viewer, **When** the viewer is displayed, **Then** navigation controls are visible: "Previous Page" button, page number input, "Next Page" button **And** a "Close" button (X icon) is visible in the panel header **And** the controls are positioned clearly (top of panel or overlay on PDF).

2. **Given** I click the "Next Page" button, **When** I am on page 5 of 24, **Then** the viewer navigates to page 6 **And** the page indicator updates to "Page 6 of 24" **And** the next page renders smoothly.

3. **Given** I click the "Previous Page" button, **When** I am on page 6, **Then** the viewer navigates to page 5 **And** the page indicator updates accordingly.

4. **Given** I am on the first page, **When** I click "Previous Page", **Then** the button is disabled or the action does nothing **And** I remain on page 1.

5. **Given** I am on the last page, **When** I click "Next Page", **Then** the button is disabled or the action does nothing **And** I remain on the last page.

6. **Given** I type a page number in the input field, **When** I enter "15" and press Enter, **Then** the viewer navigates to page 15 **And** page 15 is rendered **And** the page indicator updates to "Page 15 of 24".

7. **Given** I enter an invalid page number (e.g., 0, 99, "abc"), **When** I attempt to navigate, **Then** an error message appears: "Invalid page number" **And** the viewer remains on the current page **And** the input field is cleared or reset.

8. **Given** I want to scroll through the PDF, **When** I use the mouse scroll wheel or trackpad, **Then** the PDF content scrolls vertically within the panel **And** long pages can be fully read by scrolling **And** the scroll behavior is smooth and natural.

9. **Given** I want to close the PDF viewer, **When** I click the "Close" button (X icon), **Then** the side panel closes or collapses **And** the main content area expands to full width **And** the literature review remains visible and usable **And** the PDF state is cleared (ready for next citation click).

10. **Given** I want to adjust the PDF view (optional for MVP), **When** zoom controls are available, **Then** I can zoom in/out to adjust text size **And** the zoom level persists while navigating pages **And** a reset button returns to default zoom.

## Tasks / Subtasks

- [x] Task 1: Add page navigation controls to PdfPanel header (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Add a navigation toolbar div between the existing panel header and the PdfViewer content area in `PdfPanel.tsx`
  - [x] 1.2 Add "Previous Page" button using material icon `chevron_left`, calling `setPage(currentPage - 1)` from pdfViewerStore
  - [x] 1.3 Add "Next Page" button using material icon `chevron_right`, calling `setPage(currentPage + 1)` from pdfViewerStore
  - [x] 1.4 Disable "Previous Page" button when `currentPage <= 1`
  - [x] 1.5 Disable "Next Page" button when `currentPage >= totalPages`
  - [x] 1.6 Read `currentPage` and `totalPages` from store via individual selectors

- [x] Task 2: Add page number input field (AC: #6, #7)
  - [x] 2.1 Add a controlled `<input type="number">` between the prev/next buttons, displaying `currentPage`
  - [x] 2.2 On Enter key press or blur, validate and navigate: parse value, check `>= 1 && <= totalPages`, call `setPage(parsedValue)`
  - [x] 2.3 On invalid input (out of range, NaN), show toast "Invalid page number" via `useToastStore.getState().addToast(...)`, and reset input to current page value
  - [x] 2.4 Display `/ {totalPages}` text label next to input

- [x] Task 3: Add zoom controls (AC: #10 — optional for MVP)
  - [x] 3.1 Add `zoom` state to pdfViewerStore: `zoom: number` (default: 100), `setZoom: (zoom: number) => void`
  - [x] 3.2 Add zoom in button (material icon `zoom_in`), incrementing zoom by 25 (max 200)
  - [x] 3.3 Add zoom out button (material icon `zoom_out`), decrementing zoom by 25 (min 50)
  - [x] 3.4 Add zoom reset button displaying current zoom percentage (e.g., "100%"), clicking resets to 100
  - [x] 3.5 In PdfViewer.tsx, use `zoom` from store to scale the `<Page>` width: `width={containerWidth * (zoom / 100)}`
  - [x] 3.6 Ensure zoom persists when navigating pages (stored in Zustand, not local state)
  - [x] 3.7 Reset zoom to 100 in `closeViewer` and `openViewer` (new document) actions

- [x] Task 4: Ensure scroll behavior works correctly (AC: #8)
  - [x] 4.1 Verify `overflow-y-auto` on PdfPanel wrapper allows natural scroll within panel
  - [x] 4.2 Ensure Page component renders at full width so long pages can be scrolled vertically
  - [x] 4.3 Test that mouse scroll/trackpad scroll works within the panel without scrolling the entire page (panel is `lg:h-screen overflow-y-auto`)

- [x] Task 5: Verify close button behavior (AC: #9)
  - [x] 5.1 Verify existing close button in PdfPanel calls `closeViewer()` which resets all state (already implemented in Story 4.2)
  - [x] 5.2 Verify main content area expands to full width when panel closes (already implemented — `isPdfViewerOpen` conditional layout)

- [x] Task 6: Verify typecheck, build, and no regressions (AC: all)
  - [x] 6.1 Run `pnpm typecheck` — all packages pass
  - [x] 6.2 Run `pnpm build` (ignore pre-existing root useSearchParams warning)
  - [x] 6.3 Run `cd apps/api && pnpm run build` — clean (backend unchanged)
  - [x] 6.4 Verify 83+ existing tests pass with 0 regressions

### Review Follow-ups (AI)

- [x] [AI-Review][HIGH] Add frontend test coverage for PDF viewer controls — Set up Jest + React Testing Library in web package. Added 37 tests: pdfViewerStore unit tests (setZoom clamping, setPage clamping, openViewer/closeViewer zoom behavior, same-doc page switching) and PdfPanel component tests (nav buttons, page input validation, zoom controls, close button, edge cases).
- [x] [AI-Review][HIGH] Blended Story 4-3/4-4 changes — Acknowledged as process learning. Changes are functionally correct and tested; retroactive commit separation would be high-effort/low-value. Future stories should be committed before starting the next.

## Dev Notes

### Architecture & Patterns

**This story adds controls to existing PDF viewer components — primarily modifying PdfPanel.tsx and pdfViewerStore.ts. Minimal new files.**

The PDF viewer infrastructure was built in Story 4.2 and wired for citations in Story 4.3. This story adds the user-facing navigation controls (prev/next, page input, zoom) that allow users to freely explore PDFs beyond just citation-driven navigation.

**Key Insight:** The skeleton `PDFViewer` component from Story 2.1 (`apps/web/src/components/organisms/PDFViewer/PDFViewer.tsx`) has a reference UI design for pagination and zoom controls that can inform the visual layout, BUT it uses a different architecture (prop-driven, internal state). The actual implementation MUST use the Zustand store pattern established in Stories 4.2/4.3. **Do NOT import or extend the skeleton component.** Reference its UI layout only.

### Key Files to Modify

| File | Change |
|------|--------|
| `apps/web/src/components/features/pdf-viewer/PdfPanel.tsx` | Add navigation toolbar with prev/next buttons, page input, and zoom controls |
| `apps/web/src/lib/store/pdfViewerStore.ts` | Add `zoom` state field and `setZoom` action; reset zoom in `closeViewer`/`openViewer` |
| `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` | Apply zoom scaling to `<Page width>` prop using store zoom value |

### Existing Code Patterns (MUST follow)

**Zustand store selectors** — Use individual selectors, NOT full destructure:
```typescript
// CORRECT
const currentPage = usePdfViewerStore((s) => s.currentPage);
const totalPages = usePdfViewerStore((s) => s.totalPages);
// WRONG — causes unnecessary re-renders
const { currentPage, totalPages } = usePdfViewerStore();
```

**Material icons** — Use the established pattern:
```tsx
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
<span className="material-symbols-outlined text-[18px]">zoom_in</span>
<span className="material-symbols-outlined text-[18px]">zoom_out</span>
```

**Toast system** — For invalid page number notification:
```typescript
import { useToastStore } from '@/lib/store/toastStore';
useToastStore.getState().addToast('Invalid page number', 'error');
```

**react-pdf Page scaling** — Simply multiply the width by zoom factor:
```tsx
const zoom = usePdfViewerStore((s) => s.zoom);
<Page pageNumber={currentPage} width={containerWidth * (zoom / 100)} />
```

**Button styling** — Follow existing PdfPanel close button pattern (Tailwind utility classes, not atom Button component):
```tsx
<button
  onClick={handleAction}
  disabled={isDisabled}
  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  aria-label="Button label"
>
  <span className="material-symbols-outlined text-[20px]">icon_name</span>
</button>
```

### PdfPanel Current Implementation

The current `PdfPanel.tsx` is minimal:
- **Header:** document name (truncated) + close button (X icon)
- **Body:** `<PdfViewer />` component wrapped in `p-4` div
- **No navigation controls** — this is what we're adding

The navigation toolbar should be inserted between the header and the PdfViewer content:
```
┌──────────────────────────────┐
│ Document Name          [X]   │  ← existing header
├──────────────────────────────┤
│ [<] Page [__] / 24 [>]      │  ← NEW navigation toolbar
│ [-] 100% [+]                 │  ← NEW zoom controls
├──────────────────────────────┤
│                              │
│   PDF content (scrollable)   │  ← existing PdfViewer
│                              │
├──────────────────────────────┤
│ Page 3 of 24                 │  ← existing page indicator (inside PdfViewer)
└──────────────────────────────┘
```

### PdfViewerStore Current State

Current state fields:
- `isOpen`, `documentId`, `documentName`, `currentPage`, `totalPages`, `isLoading`, `error`, `targetPage`

**To add for this story:**
- `zoom: number` (default: 100) — persists across page navigation, resets on close/new document

Current actions:
- `openViewer`, `closeViewer`, `setPage`, `setTotalPages`, `setLoading`, `setError`, `clearTargetPage`, `reset`

**To add for this story:**
- `setZoom: (zoom: number) => void`

**Modify:**
- `closeViewer`: also reset `zoom: 100`
- `openViewer` (different document path): also reset `zoom: 100`
- `openViewer` (same document path): do NOT reset zoom (user wants to stay at current zoom level)

### Page Input Field Behavior

The page input should be a controlled component with the following behavior:
1. Displays `currentPage` from store
2. User can type a new number
3. On Enter or blur: validate → navigate or error toast
4. On invalid: show toast, reset input to current page
5. Input should be `type="number"`, `min={1}`, `max={totalPages}`
6. Width: ~`w-12` (3 digits), centered text

### Scroll Behavior

The current PdfPanel already has `overflow-y-auto` on the outer container and `lg:sticky lg:top-0 lg:h-screen`. This means:
- The panel is viewport-height and scrolls internally
- PDF pages that are taller than the panel height will be scrollable
- Mouse wheel/trackpad scrolling works naturally within the panel
- **No additional work needed** for scroll behavior — just verify it works

### Close Button Behavior

Already implemented in Story 4.2:
- Close button calls `closeViewer()` which resets ALL state to initial
- The page layout conditionally switches from `max-w-full` to `max-w-7xl` when `isPdfViewerOpen` changes
- **No additional work needed** — just verify it still works

### Project Structure Notes

- All modifications within existing feature components — no new files expected
- Component organization: `apps/web/src/components/features/pdf-viewer/`
- Store: `apps/web/src/lib/store/pdfViewerStore.ts`
- The skeleton `organisms/PDFViewer/PDFViewer.tsx` is a reference design only — do NOT modify or import it
- Shared types in `packages/types/src/` — no type changes needed for this story

### Previous Story Learnings (from 4.2 & 4.3)

- **Use individual store selectors** — Code review fix from 4.2 (M2), reinforced in 4.3 (M1): use `usePdfViewerStore((s) => s.field)` not destructuring
- **Error state must be cleared on successful load** — Code review fix from 4.2 (M5): `error: null` set in `setTotalPages`
- **Store reset on navigation** — Code review fix from 4.2 (H2): cleanup `useEffect` in page component handles this
- **ResizeObserver for container width** — Established pattern from 4.2 (M1): use ResizeObserver instead of window resize event
- **Same-document page switching** — From 4.3: when `documentId` matches current, only update `currentPage` (no reload). Navigation controls should use `setPage()` for this path
- **Page bounds clamping** — From 4.3 (M2): always clamp page numbers to `1..totalPages` range
- **Pre-existing Next.js build warning** — `useSearchParams` without Suspense on root `/` page is unrelated, ignore
- **83+ tests passing** — Must verify 0 regressions after changes
- **PdfPanel height constraint** — Code review fix from 4.2 (H1): Panel uses `lg:sticky lg:top-0 lg:h-screen` for independent scrolling

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.4]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, PDF Viewer react-pdf v10.3.0, Zustand State Management]
- [Source: _bmad-output/planning-artifacts/prd.md — FR17, FR19, FR20]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Calm Confidence, Zero-Friction Input, Trust Through Transparency]
- [Source: _bmad-output/implementation-artifacts/4-2-pdf-viewer-component.md — Dev Notes, Skeleton PDFViewer reference, Code Patterns]
- [Source: _bmad-output/implementation-artifacts/4-3-click-to-verify-citation-navigation.md — Dev Notes, Same-doc page switching, Page bounds clamping]
- [Source: apps/web/src/components/features/pdf-viewer/PdfPanel.tsx — Current panel with header + close button]
- [Source: apps/web/src/components/features/pdf-viewer/PdfViewer.tsx — Page rendering with react-pdf]
- [Source: apps/web/src/lib/store/pdfViewerStore.ts — Current store with openViewer, setPage, closeViewer]
- [Source: apps/web/src/components/organisms/PDFViewer/PDFViewer.tsx — UI reference for pagination/zoom layout]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

No debug issues encountered.

### Completion Notes List

- **Task 1 (Page Navigation):** Added navigation toolbar to PdfPanel between header and content. Previous/Next buttons with material icons `chevron_left`/`chevron_right`, disabled at page boundaries. All store selectors use individual selector pattern per project convention.
- **Task 2 (Page Input):** Implemented click-to-edit page input. Displays current page as a clickable button; clicking reveals a `type="number"` input. On Enter/blur, validates range (1..totalPages) and navigates or shows "Invalid page number" error toast via `useToastStore.getState().addToast()`. Escape cancels edit.
- **Task 3 (Zoom Controls):** Added `zoom` state (default: 100) and `setZoom` action to pdfViewerStore. Zoom in/out buttons increment/decrement by 25 (range 50-200). Reset button displays current zoom % and resets to 100. Zoom resets on `closeViewer` and `openViewer` (new document) but persists on same-document page switches. PdfViewer applies zoom via `width={containerWidth * (zoom / 100)}`.
- **Task 4 (Scroll):** Verified existing `overflow-y-auto` on PdfPanel wrapper and `lg:h-screen` constraint enable natural internal scrolling. No changes needed.
- **Task 5 (Close):** Verified existing close button calls `closeViewer()` which now also resets zoom to 100. Layout expansion still works via conditional `isPdfViewerOpen`.
- **Task 6 (Validation):** Typecheck passes (all 4 packages). API build clean. 83/83 tests pass with 0 regressions. Web build has pre-existing `useSearchParams` error on root `/` page (unrelated to this story, documented in Dev Notes).

### Senior Developer Review (AI)

**Reviewer:** Nicolas (via adversarial code review) — 2026-02-07
**Outcome:** Approved (all issues resolved)

**Issues Found:** 3 High, 3 Medium, 2 Low

**Fixed (4):**
- **H1:** Enter + blur double-fire on invalid page input → duplicate toast. Fixed with `isSubmittingRef` guard in `handlePageInputSubmit` and reset when entering edit mode. [PdfPanel.tsx]
- **M1:** `setZoom` accepted any value without bounds validation. Fixed with `Math.max(50, Math.min(200, zoom))` clamping, consistent with `setPage`. [pdfViewerStore.ts]
- **M2:** Stale page input race condition on document switch — blur fired with stale closure totalPages during document navigation. Fixed by reading fresh `totalPages` from store via `getState()` and early-returning when `null`. [PdfPanel.tsx]
- **M3:** Redundant page indicator — "Page X of Y" in both PdfPanel toolbar and PdfViewer bottom. Removed bottom indicator from PdfViewer.tsx; cleaned up unused `totalPages` and `documentName` selectors. [PdfViewer.tsx]

**Resolved in follow-up:**
- **H2:** Added 37 frontend tests (Jest + React Testing Library infrastructure + store unit tests + component tests)
- **H3:** Acknowledged as process learning — changes are correct and tested; future stories should be committed separately

**Not Fixed (LOW — noted only):**
- **L1:** Zoom reset `aria-label` lacks current zoom level for screen readers
- **L2:** Horizontal overflow at high zoom relies on implicit CSS behavior

### Change Log

- 2026-02-07: Added frontend test infrastructure (Jest + RTL) and 37 tests for pdfViewerStore + PdfPanel
- 2026-02-07: Code review fixes applied — H1 double-toast guard, M1 setZoom clamping, M2 stale input race fix, M3 redundant page indicator removed
- 2026-02-07: Implemented PDF viewer controls and navigation (Story 4.4) — page nav, page input, zoom controls, verified scroll and close behavior

### File List

- `apps/web/src/components/features/pdf-viewer/PdfPanel.tsx` (modified) — Added navigation toolbar with prev/next buttons, page input, and zoom controls; review fixes: double-toast guard, stale input race fix
- `apps/web/src/lib/store/pdfViewerStore.ts` (modified) — Added `zoom` state, `setZoom` action with clamping, reset zoom in `closeViewer`/`openViewer`
- `apps/web/src/components/features/pdf-viewer/PdfViewer.tsx` (modified) — Applied zoom scaling to `<Page>` width prop; removed redundant page indicator
- `apps/web/src/lib/store/pdfViewerStore.spec.ts` (new) — 17 unit tests for store: setZoom clamping, setPage clamping, openViewer/closeViewer zoom behavior
- `apps/web/src/components/features/pdf-viewer/PdfPanel.spec.tsx` (new) — 20 component tests: navigation, page input, zoom controls, close button
- `apps/web/jest.config.js` (new) — Jest configuration for web package (ts-jest, jsdom, path aliases)
- `apps/web/tsconfig.test.json` (new) — Test-specific TypeScript config with react-jsx
- `apps/web/package.json` (modified) — Added test scripts and testing devDependencies
