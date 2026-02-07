# Story 3.8: Methodology Progress Tracker

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to see where I am in the research methodology stages and what comes next,
so that I know I'm following the right process and don't miss critical steps.

## Acceptance Criteria

1. **Given** I am viewing my literature review **When** the page loads **Then** a "Methodology Progress" section is displayed prominently **And** the progress tracker shows predefined research stages: 1. Literature Search (gathering papers), 2. Literature Review (synthesis and analysis) ← Current stage, 3. Research Design, 4. Data Collection, 5. Data Analysis, 6. Writing & Reporting **And** the current stage is visually highlighted (bold, colored, "You are here" indicator)

2. **Given** I am on the "Literature Review" stage **When** the progress tracker is displayed **Then** the "Next Steps" section shows predefined guidance: "Review and refine your synthesis", "Verify citations by clicking to open source PDFs", "Identify gaps and research questions for your study", "Move to Research Design when literature review is complete" **And** the next steps are static text (no dynamic AI suggestions for MVP)

3. **Given** I complete the literature review **When** I mark the stage as complete (future feature — for now just display) **Then** the tracker remains visible showing my progress **And** the user understands where they are in the overall process

## Tasks / Subtasks

- [x] Task 1: Create MethodologyProgressTracker component (AC: #1, #2)
  - [x] 1.1 Create `apps/web/src/components/features/literature-review/MethodologyProgressTracker.tsx`
  - [x] 1.2 Define the 6 predefined methodology stages as a constant array of `ProgressStep` objects: `{ label: string, description?: string, status: 'pending' | 'current' | 'completed' }`. Stages: "Literature Search" (completed), "Literature Review" (current), "Research Design" (pending), "Data Collection" (pending), "Data Analysis" (pending), "Writing & Reporting" (pending)
  - [x] 1.3 Reuse the existing `ProgressTracker` organism from `apps/web/src/components/organisms/ProgressTracker/ProgressTracker.tsx` — pass the stages array with `orientation="vertical"` for sidebar-style display
  - [x] 1.4 Below the ProgressTracker, render a "Next Steps" card with the 4 predefined guidance items as a styled list (bullet points with checkmark icons or numbered list)
  - [x] 1.5 Add a "You are here" visual indicator on the current stage — the existing ProgressTracker already highlights the `current` status with a pulsing dot and distinct color; add a small text label "Current Stage" underneath the "Literature Review" step label
  - [x] 1.6 Style the component to match the calm, spacious design language: white card background, rounded corners, generous padding, subtle border

- [x] Task 2: Integrate MethodologyProgressTracker into the literature review page (AC: #1, #3)
  - [x] 2.1 Modify `apps/web/app/literature-review/[id]/page.tsx` to import and render `MethodologyProgressTracker`
  - [x] 2.2 Place the tracker in a sidebar layout on desktop (1024px+): main content area takes ~70% width, methodology tracker takes ~30% width in a right sidebar panel. On smaller screens, stack vertically below the review content.
  - [x] 2.3 The tracker should be visible in both view mode and edit mode — it's a reference panel, not dependent on editing state
  - [x] 2.4 Wrap the layout in a responsive container: `flex flex-col lg:flex-row lg:gap-6` with the review content as the primary column and tracker as the secondary column

- [x] Task 3: Verify build, types, and integration (AC: all)
  - [x] 3.1 Run `pnpm typecheck` — all packages pass
  - [x] 3.2 Run `nest build` in apps/api — compiles without errors (no API changes expected)
  - [x] 3.3 Run existing test suite — no regressions
  - [x] 3.4 Verify literature review page loads and displays the methodology tracker alongside the review content
  - [x] 3.5 Verify the ProgressTracker correctly shows "Literature Search" as completed and "Literature Review" as current
  - [x] 3.6 Verify the "Next Steps" guidance items are displayed below the progress tracker
  - [x] 3.7 Verify responsive layout: sidebar on desktop, stacked on mobile/tablet

## Dev Notes

### Story Context

This is **Story 3.8** in **Epic 3: AI-Powered Literature Review Generation**. It adds a methodology progress tracker section to the literature review page, giving users a "you are here" indicator within the overall research methodology. This is a **frontend-only** feature with **no backend changes** — all stages and guidance are static/predefined for MVP.

**Functional Requirements Covered:** FR23 (see current position in research methodology stages), FR24 (view predefined next steps for current stage)

**Critical Dependency Chain:**
- **Depends on:** Story 3.7 (Literature Review Display and Editing — the page where the tracker is displayed) — **STATUS: DONE**
- **Depended on by:** No direct dependents — this is a standalone enhancement to the review page

**What's Already Built (Do NOT Recreate):**

- **ProgressTracker organism** — `apps/web/src/components/organisms/ProgressTracker/ProgressTracker.tsx` with `ProgressStep` interface (`{ label, description?, status }`) and `orientation` prop ('horizontal' | 'vertical'). Already handles completed/current/pending status with visual indicators (check_circle, pulsing radio_button_checked, numbered step), connecting lines, and ARIA accessibility. [Source: `apps/web/src/components/organisms/ProgressTracker/ProgressTracker.tsx`]
- **ProgressIndicator molecule** — `apps/web/src/components/molecules/ProgressIndicator/ProgressIndicator.tsx` — simple progress bar with label and percentage. NOT needed here (ProgressTracker organism is what we need). [Source: `apps/web/src/components/molecules/ProgressIndicator/ProgressIndicator.tsx`]
- **Literature review page** — `apps/web/app/literature-review/[id]/page.tsx` — full implementation from Story 3.7 with view/edit modes, inline citations, back button, toast notifications. The tracker will be ADDED to this page. [Source: `apps/web/app/literature-review/[id]/page.tsx`]
- **LiteratureReviewContent** — `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` — markdown renderer with inline citation parsing. [Source: `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx`]
- **LiteratureReviewEditor** — `apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx` — textarea editor for edit mode. [Source: `apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx`]
- **literatureReviewStore** — `apps/web/src/lib/store/literatureReviewStore.ts` — Zustand store managing review fetch, editing state, saving. [Source: `apps/web/src/lib/store/literatureReviewStore.ts`]
- **UI components** — Button, Card, CardHeader, CardTitle, CardContent, Badge, Spinner all available in `apps/web/src/components/atoms/`. [Source: `apps/web/src/components/atoms/`]
- **Material Icons** — Available via `<span className="material-symbols-outlined">icon_name</span>` pattern used throughout the app. [Source: various components]
- **Header component** — `apps/web/src/components/features/layout/Header.tsx` for page header. [Source: `apps/web/src/components/features/layout/Header.tsx`]
- **Existing Tailwind custom classes** — `gap-md`, `gap-sm`, `gap-lg`, `p-md`, `p-lg`, `text-body`, `text-small`, `text-h3`, `text-text-primary`, `text-text-secondary`, `bg-muted`, `border-border`, `rounded-lg`. [Source: global CSS and Tailwind config]

**What NOT to Build:**

- Do NOT create any database entities or migrations — methodology stages are static, no persistence needed for MVP
- Do NOT create a new Zustand store — no new state management needed (stages are hardcoded constants)
- Do NOT create any backend endpoints — this is entirely frontend
- Do NOT implement stage completion/toggling — per AC#3, just display for now (future feature)
- Do NOT implement dynamic AI-generated next steps — static text only per AC#2
- Do NOT install any new npm packages — all dependencies already installed
- Do NOT modify the LiteratureReviewContent or LiteratureReviewEditor components
- Do NOT modify the literatureReviewStore
- Do NOT modify the ProgressTracker organism component itself — just reuse it as-is

---

### Technical Requirements

**Component Structure:**

The MethodologyProgressTracker is a pure presentational component with no state management, no API calls, and no props (all data is hardcoded for MVP).

```tsx
// apps/web/src/components/features/literature-review/MethodologyProgressTracker.tsx
import { ProgressTracker } from '../../organisms/ProgressTracker/ProgressTracker';
import type { ProgressStep } from '../../organisms/ProgressTracker/ProgressTracker';
import { Card, CardHeader, CardTitle, CardContent } from '../../atoms/Card/Card';

const METHODOLOGY_STAGES: ProgressStep[] = [
  { label: 'Literature Search', description: 'Gathering papers', status: 'completed' },
  { label: 'Literature Review', description: 'Synthesis and analysis', status: 'current' },
  { label: 'Research Design', description: 'Planning methodology', status: 'pending' },
  { label: 'Data Collection', description: 'Gathering data', status: 'pending' },
  { label: 'Data Analysis', description: 'Analyzing results', status: 'pending' },
  { label: 'Writing & Reporting', description: 'Final paper', status: 'pending' },
];

const NEXT_STEPS = [
  'Review and refine your synthesis',
  'Verify citations by clicking to open source PDFs',
  'Identify gaps and research questions for your study',
  'Move to Research Design when literature review is complete',
];
```

**Page Layout Modification:**

The current literature review page uses a single-column layout (`max-w-4xl mx-auto`). Modify to a two-column responsive layout:

```tsx
// Current structure (Story 3.7):
<main className="max-w-4xl mx-auto px-4 py-6">
  {/* Back button, title, content/editor */}
</main>

// New structure (Story 3.8):
<main className="max-w-7xl mx-auto px-4 py-6">
  <div className="flex flex-col lg:flex-row lg:gap-6">
    {/* Primary column: review content (same as before) */}
    <div className="flex-1 max-w-4xl">
      {/* Back button, title, content/editor */}
    </div>
    {/* Secondary column: methodology tracker */}
    <aside className="w-full lg:w-80 lg:flex-shrink-0 mt-6 lg:mt-0">
      <MethodologyProgressTracker />
    </aside>
  </div>
</main>
```

**ProgressTracker Props (from existing component):**

```typescript
interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;  // optional, auto-detected from status
  orientation?: 'horizontal' | 'vertical';  // use 'vertical'
  className?: string;
}

interface ProgressStep {
  label: string;
  description?: string;
  status: 'pending' | 'current' | 'completed';
}
```

The existing ProgressTracker already provides:
- Green check circle for completed steps
- Pulsing blue/primary dot for current step
- Gray numbered circle for pending steps
- Connecting lines between steps with appropriate colors
- Step labels and descriptions
- ARIA progressbar role with value attributes

**"Current Stage" Label:**

Add a small text label below the "Literature Review" step. Since the ProgressTracker is a reused component, add this via a wrapper or a small additional element in the MethodologyProgressTracker component itself (e.g., a Badge with "Current Stage" text positioned after the ProgressTracker).

**Next Steps Styling:**

Use a Card component with a checklist-style layout:

```tsx
<Card className="mt-4">
  <CardHeader>
    <CardTitle className="text-h3 flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">tips_and_updates</span>
      Next Steps
    </CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-3">
      {NEXT_STEPS.map((step, index) => (
        <li key={index} className="flex items-start gap-2 text-body text-text-secondary">
          <span className="material-symbols-outlined text-sm text-primary mt-0.5">arrow_forward</span>
          {step}
        </li>
      ))}
    </ul>
  </CardContent>
</Card>
```

---

### Architecture Compliance

**Frontend Patterns:**
- Component in `src/components/features/literature-review/` directory [Source: architecture.md#Component-Architecture]
- Reuses existing ProgressTracker organism (no duplication) [Source: architecture.md#Components]
- No new Zustand store needed (static data) [Source: architecture.md#State-Management]
- Uses existing atom components: Card, CardHeader, CardTitle, CardContent [Source: architecture.md#Components]
- Responsive layout with `lg:` breakpoint for desktop sidebar [Source: UX spec — Desktop-first design]

**Naming Conventions:**
- Frontend component: PascalCase (`MethodologyProgressTracker.tsx`) [Source: architecture.md#Naming-Patterns]
- Constants: SCREAMING_SNAKE_CASE (`METHODOLOGY_STAGES`, `NEXT_STEPS`) [Source: architecture.md#Naming-Patterns]

**UX Design Compliance:**
- "You are here" methodology progress tracker per UX spec [Source: ux-design-specification.md#Design-Implications]
- Calm, spacious design with generous padding [Source: ux-design-specification.md#Experience-Principles]
- Clear progress indicators eliminate uncertainty [Source: ux-design-specification.md#Emotional-Design-Principles]
- Guided simplicity — tells users what to do next [Source: ux-design-specification.md#Experience-Principles]
- No aggressive timers or overwhelming options [Source: ux-design-specification.md#Anti-Patterns]

---

### Library & Framework Requirements

**No New Package Installations Required.**

All dependencies already installed:

| Package | Location | Usage in This Story |
|---------|----------|---------------------|
| `react` 19.x | apps/web | Component rendering |
| `next` 15.x | apps/web | App Router page modification |
| `tailwindcss` 3.4.x | apps/web | Responsive layout styling |

---

### File Structure Requirements

**Files to Create:**

```
apps/web/src/components/features/literature-review/
└── MethodologyProgressTracker.tsx        # NEW: Methodology stages + next steps display
```

**Files to Modify:**

```
apps/web/app/literature-review/[id]/page.tsx   # MODIFY: Add sidebar layout + MethodologyProgressTracker
```

**No Changes Expected To:**

```
apps/api/                                          # No backend changes at all
apps/web/src/components/organisms/ProgressTracker/ # Reuse as-is, do not modify
apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx  # Unchanged
apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx   # Unchanged
apps/web/src/lib/store/literatureReviewStore.ts    # Unchanged
apps/web/src/lib/store/                            # No new stores
apps/web/src/lib/api/                              # No API changes
packages/types/                                    # No type changes
```

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors (no API changes)
3. Existing test suite passes (no regressions)
4. Literature review page at `/literature-review/{id}` displays the methodology tracker in a right sidebar on desktop (1024px+)
5. On mobile/tablet (<1024px), the methodology tracker stacks below the review content
6. ProgressTracker shows 6 stages with "Literature Search" as completed (green checkmark) and "Literature Review" as current (pulsing indicator)
7. "Research Design", "Data Collection", "Data Analysis", "Writing & Reporting" show as pending (gray)
8. "Next Steps" card displays 4 guidance items below the progress tracker
9. Tracker is visible in both view mode and edit mode
10. Page layout still looks correct with the sidebar — review content is not squished or broken
11. Existing functionality (edit, save, citations, back button, toast) still works correctly

---

### Previous Story Intelligence

**From Story 3.7 - Literature Review Display and Editing (Most Recent):**

**Key Learnings:**
1. **Page structure** — Currently uses `max-w-4xl mx-auto px-4 py-6` as main container. This needs to expand to `max-w-7xl` to accommodate the sidebar layout with the methodology tracker.
2. **View/Edit mode toggle** — Uses `isEditing` state from `literatureReviewStore`. The tracker should be visible regardless of editing state.
3. **Document info mapping** — Page maps documents to `documentInfos` for citation tooltips. This pattern is unrelated to the tracker.
4. **Component imports** — Uses `Header`, `Spinner`, `LiteratureReviewContent`, `LiteratureReviewEditor` from feature components, `useLiteratureReviewStore`, `useDocumentStore`, `useToastStore`.
5. **83 tests passing** — Ensure no regressions after layout change.
6. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored.
7. **XSS prevention** — HTML escaping in markdown renderer was added in code review. Unrelated to this story but demonstrates code quality bar.

**Code Patterns to Follow:**
- Component: Same feature component pattern as LiteratureReviewContent (functional component, TypeScript, Tailwind)
- Page modification: Extend existing page layout without breaking existing functionality
- Card styling: Use Card atoms with consistent className patterns from existing components
- Icons: Use `material-symbols-outlined` span class for Material Icons

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **b91b0ad** — `feat: literature review display and editing with inline citations and code review fixes (story 3.7)` — Created the literature review page this story extends
2. **74e15e0** — `feat: initiate processing and progress display with code review fixes (story 3.6)` — Processing flow and modal
3. **5e6f11a** — `feat: citation traceability and real-time WebSocket progress (stories 3.4 & 3.5)` — Citation entity, WebSocket
4. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` — LiteratureReview entity, AI service
5. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` — Anthropic SDK

**Commit Message Pattern:** `feat: <description> with code review fixes`

**Expected Commit for This Story:**
```
feat: methodology progress tracker on literature review page with code review fixes (story 3.8)
```

---

### Project Structure Notes

- MethodologyProgressTracker goes in `src/components/features/literature-review/` alongside existing LiteratureReviewContent and LiteratureReviewEditor
- The literature review page at `app/literature-review/[id]/page.tsx` is modified to add sidebar layout — this is the ONLY page file that changes
- The ProgressTracker organism is REUSED as-is — do NOT create a new progress tracker component
- No backend changes, no new API endpoints, no new stores, no new types, no new migrations
- This is one of the smallest stories in Epic 3 — purely a frontend UI enhancement with static content

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.8-Methodology-Progress-Tracker] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR23, FR24 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Component architecture, Zustand patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — PascalCase components, SCREAMING_SNAKE_CASE constants
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design-Implications] — "You are here" methodology progress tracker
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Calm confidence, guided simplicity
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Emotional-Design-Principles] — Clear progress indicators, no overwhelming options
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Progress awareness as effortless interaction
- [Source: apps/web/src/components/organisms/ProgressTracker/ProgressTracker.tsx] — Existing ProgressTracker component to reuse
- [Source: apps/web/src/components/atoms/Card/Card.tsx] — Card component for Next Steps section
- [Source: apps/web/app/literature-review/[id]/page.tsx] — Page to modify with sidebar layout
- [Source: apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx] — Existing content component (no changes)
- [Source: apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx] — Existing editor component (no changes)
- [Source: apps/web/src/lib/store/literatureReviewStore.ts] — Existing store (no changes)
- [Source: _bmad-output/implementation-artifacts/3-7-literature-review-display-and-editing.md] — Previous story learnings, page structure, 83 tests

## Change Log

- 2026-02-07: Implemented methodology progress tracker — created MethodologyProgressTracker component with 6 predefined research stages and Next Steps guidance, integrated into literature review page as responsive sidebar layout
- 2026-02-07: Code review fixes — replaced fragile magic-number badge positioning with natural flow "You are here" indicator, fixed loading state layout inconsistency (max-w-4xl → max-w-7xl), added aria-label to sidebar aside element, replaced index-based React key with step text key

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No debug issues encountered. Clean implementation.

### Completion Notes List

- Created MethodologyProgressTracker as a pure presentational component with METHODOLOGY_STAGES (6 stages) and NEXT_STEPS (4 guidance items) constants
- Reused existing ProgressTracker organism with `orientation="vertical"` — no modifications to the organism
- Added "You are here: Literature Review" indicator below the ProgressTracker in natural document flow (no fragile positioning)
- Wrapped progress and next steps in separate Card components matching project design language
- Modified literature review page layout from single-column `max-w-4xl` to two-column `max-w-7xl` with `flex flex-col lg:flex-row lg:gap-6`
- Tracker sidebar is `lg:w-80` with `lg:sticky lg:top-8` for persistent visibility while scrolling
- On mobile/tablet (<1024px), tracker stacks below review content with `mt-6`
- Tracker is visible in both view mode and edit mode — outside the content/editor conditional
- All 83 existing tests pass, `pnpm typecheck` passes across all 4 packages
- No backend changes, no new stores, no new dependencies

### File List

- `apps/web/src/components/features/literature-review/MethodologyProgressTracker.tsx` (NEW)
- `apps/web/app/literature-review/[id]/page.tsx` (MODIFIED)
