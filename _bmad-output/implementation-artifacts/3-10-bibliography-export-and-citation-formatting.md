# Story 3.10: Bibliography Export and Citation Formatting

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to export my bibliography in standard academic formats,
so that I can easily cite sources in my academic paper with proper formatting.

## Acceptance Criteria

1. **Given** I have a completed literature review with citations **When** I view the literature review page **Then** a "Bibliography" section is displayed below the review content **And** all cited documents are listed in the bibliography **And** each entry includes: author, title, year, publication source (if available) **And** citations are numbered to match the in-text citation markers

2. **Given** I want to export the bibliography **When** I click an "Export Bibliography" button **Then** a format selection dropdown/modal is shown **And** available formats include: APA, MLA, Chicago, BibTeX **And** each format option shows a brief description or example

3. **Given** I select APA format **When** I click "Export as APA" **Then** the bibliography is formatted according to APA 7th edition style **And** a downloadable text file is generated: `bibliography-apa-{reviewId}.txt` **And** the file contains all citations in proper APA format **And** citations are alphabetically sorted by author last name

4. **Given** I select MLA format **When** I click "Export as MLA" **Then** the bibliography is formatted according to MLA 9th edition style **And** a downloadable text file is generated: `bibliography-mla-{reviewId}.txt` **And** the file contains all citations in proper MLA format **And** citations are alphabetically sorted by author last name

5. **Given** I select Chicago format **When** I click "Export as Chicago" **Then** the bibliography is formatted according to Chicago 17th edition style **And** a downloadable text file is generated: `bibliography-chicago-{reviewId}.txt` **And** the file contains all citations in proper Chicago format **And** citations are alphabetically sorted by author last name

6. **Given** I select BibTeX format **When** I click "Export as BibTeX" **Then** a .bib file is generated: `bibliography-{reviewId}.bib` **And** each entry has a unique citation key (e.g., author_year_title_abbreviated) **And** all required BibTeX fields are populated (author, title, year, etc.) **And** the file can be imported directly into LaTeX or reference managers

7. **Given** document metadata is incomplete (e.g., missing author) **When** generating bibliography entries **Then** available fields are included with proper formatting **And** missing fields are noted with "[No author]" or "[Unknown year]" **And** a warning is displayed: "Some citations have incomplete metadata. Please verify manually." **And** the export still succeeds with partial information

8. **Given** I copy bibliography to clipboard **When** I click "Copy to Clipboard" next to a format option **Then** the formatted bibliography is copied to the system clipboard **And** a success toast appears: "Bibliography copied to clipboard" **And** I can paste it directly into my document editor

## Tasks / Subtasks

- [x] Task 1: Add bibliographic metadata fields to ResearchDocument entity (AC: #1, #7)
  - [x] 1.1 Add nullable JSONB column `bibliographic_metadata` to ResearchDocument entity — stores structured metadata: `{ authors?: Array<{ given: string; family: string }>; title?: string; year?: number; journal?: string; volume?: string; issue?: string; pages?: string; doi?: string; publisher?: string; url?: string; type?: 'article-journal' | 'book' | 'webpage' | 'misc' }`
  - [x] 1.2 Generate TypeORM migration for the new column: `pnpm --filter api migration:generate -- -n AddBibliographicMetadataToResearchDocument`
  - [x] 1.3 Run migration (or rely on AUTO_RUN_MIGRATIONS=true on app start)

- [x] Task 2: Implement DOI extraction and CrossRef metadata enrichment (AC: #1, #7)
  - [x] 2.1 Create `apps/api/src/modules/documents/bibliography-metadata.service.ts` — service with methods: `extractDoi(text: string): string | null` (regex: `/\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/`) and `enrichFromCrossRef(doi: string): Promise<BibliographicMetadata | null>` (GET `https://api.crossref.org/works/{doi}` with polite `User-Agent` header)
  - [x] 2.2 Add `extractMetadataFromPdf(pdfInfo: { title?: string; author?: string; creationDate?: string }, extractedText: string): Promise<BibliographicMetadata>` — combines pdf-parse info fields with DOI lookup. Parse authors from PDF `info.Author` field (splitting by `,`, `;`, `and`). Extract year from `info.CreationDate` or text. Always try DOI enrichment first (most reliable).
  - [x] 2.3 Update `pdf-extraction.processor.ts` to call `bibliographyMetadataService.extractMetadataFromPdf()` after text extraction and save result to `document.bibliographicMetadata`. Wrap in try-catch — metadata extraction failure must NOT fail the PDF extraction job.
  - [x] 2.4 Register `BibliographyMetadataService` in `DocumentsModule` providers. Inject `HttpModule` for CrossRef API calls (use `@nestjs/axios`).

- [x] Task 3: Install citation-js and create bibliography formatting service (AC: #2, #3, #4, #5, #6)
  - [x] 3.1 Install `citation-js` in apps/api: `pnpm --filter api add citation-js`. Create type declaration `apps/api/src/types/citation-js.d.ts` for TypeScript compatibility.
  - [x] 3.2 Create `apps/api/src/modules/literature-reviews/bibliography-export.service.ts` with method `formatBibliography(citations: CitationWithMetadata[], format: 'apa' | 'mla' | 'chicago' | 'bibtex'): string`. Converts citation metadata to CSL-JSON, uses citation-js to format.
  - [x] 3.3 Implement `buildCslJsonEntries(citations: CitationWithMetadata[]): CSLEntry[]` — maps each unique document's bibliographic metadata to CSL-JSON format: `{ type, title, author: [{family, given}], issued: {'date-parts': [[year]]}, 'container-title', volume, issue, page, DOI }`. Deduplicate by documentId (multiple citations from same document = one bibliography entry).
  - [x] 3.4 Implement `generateBibtexKeys(entries: CSLEntry[]): Map<string, string>` — generates unique citation keys using `authoryearfirstword` pattern with disambiguation suffixes (a, b, c...).
  - [x] 3.5 Implement `handleIncompleteMetadata(entries: CSLEntry[]): { entries: CSLEntry[]; warnings: string[] }` — fills missing fields with placeholders (`[No author]`, `[Unknown year]`) and collects warning messages.
  - [x] 3.6 Register `BibliographyExportService` in `LiteratureReviewsModule` providers.

- [x] Task 4: Add bibliography export API endpoint (AC: #2, #3, #4, #5, #6, #7)
  - [x] 4.1 Create `apps/api/src/modules/literature-reviews/dto/export-bibliography.dto.ts` with validation: `format: 'apa' | 'mla' | 'chicago' | 'bibtex'` (required, IsEnum)
  - [x] 4.2 Add method to `LiteratureReviewsService`: `exportBibliography(reviewId: string, userId: string, format: string): Promise<{ content: string; filename: string; mimeType: string; warnings: string[] }>`. Loads review + citations with document relations, calls `BibliographyExportService.formatBibliography()`, returns formatted content with filename (`bibliography-{format}-{reviewId}.txt` or `.bib` for BibTeX) and mime type.
  - [x] 4.3 Add `GET /api/v1/literature-reviews/:id/bibliography?format=apa` endpoint to controller. Returns JSON: `{ content: string, filename: string, warnings: string[] }`. Uses query parameter for format selection.
  - [x] 4.4 Inject `ResearchDocument` repository into `LiteratureReviewsService` (or use relations) to load bibliographic metadata for cited documents.

- [x] Task 5: Update shared types for bibliography export (AC: #2, #7)
  - [x] 5.1 In `packages/types/src/document.ts`, add `BibliographicMetadata` interface: `{ authors?: Array<{ given: string; family: string }>; title?: string; year?: number; journal?: string; volume?: string; issue?: string; pages?: string; doi?: string; publisher?: string; url?: string; type?: string }` and add optional `bibliographicMetadata?: BibliographicMetadata` to `Document` and `DocumentResponse` interfaces.
  - [x] 5.2 Create `packages/types/src/bibliography.ts` with `BibliographyExportFormat` type (`'apa' | 'mla' | 'chicago' | 'bibtex'`), `BibliographyExportResponse` interface (`{ content: string; filename: string; warnings: string[] }`), and `BibliographyEntry` interface.
  - [x] 5.3 Export new types from `packages/types/src/index.ts`.

- [x] Task 6: Add frontend API client for bibliography export (AC: #2, #3, #4, #5, #6, #8)
  - [x] 6.1 Add `exportBibliography(reviewId: string, format: string): Promise<BibliographyExportResponse>` to `apps/web/src/lib/api/literature-reviews.ts`. Calls `GET /literature-reviews/{id}/bibliography?format={format}`.
  - [x] 6.2 Add `downloadBibliography(content: string, filename: string): void` utility — creates a Blob, generates URL, triggers download via temporary anchor element.
  - [x] 6.3 Add `copyToClipboard(content: string): Promise<boolean>` utility — uses `navigator.clipboard.writeText()` with fallback.

- [x] Task 7: Implement BibliographySection component on literature review page (AC: #1, #2)
  - [x] 7.1 Create `apps/web/src/components/features/literature-review/BibliographySection.tsx` — displays bibliography entries below review content. Takes `citations` and `documents` (with metadata) as props. Groups citations by unique document, formats as numbered list matching in-text citation markers.
  - [x] 7.2 Add "Export Bibliography" button to the section header — opens a dropdown with format options (APA, MLA, Chicago, BibTeX) each with brief description.
  - [x] 7.3 Add "Copy to Clipboard" button next to each format option in the dropdown.
  - [x] 7.4 Integrate `BibliographySection` into the literature review page (`apps/web/app/literature-review/[id]/page.tsx`) below the review content and above the methodology sidebar area.

- [x] Task 8: Implement export and download functionality in frontend (AC: #3, #4, #5, #6, #7, #8)
  - [x] 8.1 When user selects a format and clicks "Download", call `exportBibliography(reviewId, format)` API, then trigger file download with the returned content and filename.
  - [x] 8.2 When user clicks "Copy to Clipboard", call `exportBibliography(reviewId, format)` API, then copy content to clipboard and show success toast: "Bibliography copied to clipboard".
  - [x] 8.3 If response includes warnings (incomplete metadata), display a warning banner below the export dropdown: "Some citations have incomplete metadata. Please verify manually." with collapsible list of specific warnings.
  - [x] 8.4 Show loading state on buttons during API call. Handle errors with toast: "Failed to export bibliography. Please try again."

- [x] Task 9: Update or replace existing export-bibliography page (AC: #2)
  - [x] 9.1 Evaluate the existing static `apps/web/app/export-bibliography/page.tsx`. Since the bibliography section is now embedded in the literature review page, either: (a) redirect this page to the literature review page, or (b) make it functional by accepting a `reviewId` query param and loading data. Recommended: option (a) — redirect to the literature review page where the export functionality now lives.

- [x] Task 10: Verify build, types, and integration (AC: all)
  - [x] 10.1 Run `pnpm typecheck` — all packages pass
  - [x] 10.2 Run `nest build` in apps/api — compiles without errors
  - [x] 10.3 Run existing test suite — no regressions (83+ tests)
  - [ ] 10.4 Manual verification: upload PDFs, trigger processing, verify bibliographic metadata is extracted and stored
  - [ ] 10.5 Manual verification: view literature review, verify Bibliography section appears with entries
  - [ ] 10.6 Manual verification: click "Export as APA" — verify downloaded .txt file with APA formatting
  - [ ] 10.7 Manual verification: click "Export as BibTeX" — verify downloaded .bib file with valid BibTeX entries
  - [ ] 10.8 Manual verification: click "Copy to Clipboard" — verify clipboard contains formatted bibliography and toast appears
  - [ ] 10.9 Manual verification: process PDFs without DOIs — verify placeholder metadata and warning message
  - [ ] 10.10 Verify all existing functionality (upload, processing, display, edit, citations, error handling) still works

## Dev Notes

### Story Context

This is **Story 3.10** in **Epic 3: AI-Powered Literature Review Generation** — the final story in Epic 3. It adds bibliography export functionality so users can cite sources in standard academic formats (APA, MLA, Chicago, BibTeX) with proper formatting.

**Functional Requirements Covered:** This story implements the bibliography and export aspects that support FR11-FR13 (citation traceability) by providing formatted, exportable citation references.

**Design Reference:** Design 07: Bibliography Export (`designs/code/07-export-bibliography.html`)

**Critical Dependency Chain:**
- **Depends on:** Story 3.3 (Literature Review Generation Core — creates reviews with citations), Story 3.4 (Citation Traceability — Citation entity with documentId + pageNumber), Story 3.7 (Literature Review Display — the page where bibliography will appear) — ALL STATUS: DONE
- **Depended on by:** None — this is the last story in Epic 3

**What's Already Built (Do NOT Recreate):**

- **LiteratureReview entity** — `apps/api/src/entities/literature-review.entity.ts` — Fields: id, userId, jobId, title, content, documentIds (JSONB), createdAt, updatedAt. [Source: `apps/api/src/entities/literature-review.entity.ts`]
- **Citation entity** — `apps/api/src/entities/citation.entity.ts` — Fields: id, literatureReviewId, documentId, pageNumber, claimText, positionInReview, isVerified, userNotes, createdAt. Indexes on literatureReviewId and documentId. [Source: `apps/api/src/entities/citation.entity.ts`]
- **ResearchDocument entity** — `apps/api/src/entities/research-document.entity.ts` — Fields: id, userId, fileName, fileSize, mimeType, storagePath, pageCount, textExtracted, extractionError, extractedText, uploadedAt, updatedAt. **NOTE: No bibliographic metadata yet — this story adds it.** [Source: `apps/api/src/entities/research-document.entity.ts`]
- **LiteratureReviewsService** — `apps/api/src/modules/literature-reviews/literature-reviews.service.ts` — Has `getReview()` (loads review + citations ordered by position) and `updateReview()`. Returns `LiteratureReview & { citations: Citation[] }`. [Source: `apps/api/src/modules/literature-reviews/literature-reviews.service.ts`]
- **LiteratureReviewsController** — `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` — Has `GET :id` and `PUT :id`. Uses `mapToResponse()` to format output. JWT auth guard. [Source: `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts`]
- **LiteratureReviewsModule** — `apps/api/src/modules/literature-reviews/literature-reviews.module.ts` — Imports TypeOrmModule with LiteratureReview and Citation entities. Provides LiteratureReviewsService. [Source: `apps/api/src/modules/literature-reviews/literature-reviews.module.ts`]
- **pdf-extraction.processor.ts** — `apps/api/src/jobs/pdf-extraction.processor.ts` — BullMQ worker for PDF text extraction. Uses `pdf-parse` to extract text. Already handles scanned PDF detection. Sets textExtracted, extractedText, pageCount, extractionError. **This is where bibliographic metadata extraction will be added.** [Source: `apps/api/src/jobs/pdf-extraction.processor.ts`]
- **Literature review page** — `apps/web/app/literature-review/[id]/page.tsx` — Two-column layout: review content (flex-1) + methodology sidebar (lg:w-80). View/edit modes. Fetches review by ID with citations. Has partial result warning banner (from story 3.9). [Source: `apps/web/app/literature-review/[id]/page.tsx`]
- **LiteratureReviewContent** — `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx` — Renders review content with inline citation markers. [Source: `apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx`]
- **Frontend API client** — `apps/web/src/lib/api/literature-reviews.ts` — Has `getLiteratureReview()` and `updateLiteratureReview()`. Interface includes citations array. [Source: `apps/web/src/lib/api/literature-reviews.ts`]
- **Export bibliography page (STATIC)** — `apps/web/app/export-bibliography/page.tsx` — Currently a non-functional static UI component with citation style selection (APA 7th, Harvard, Chicago, MLA 9th, Vancouver, IEEE), file format options (.docx, .bib, .txt), and inclusion settings. Has a preview panel with hardcoded sample data. Download and Copy buttons are non-functional. **This page may be redirected or repurposed since the bibliography functionality will live on the literature review page.** [Source: `apps/web/app/export-bibliography/page.tsx`]
- **Toast system** — `apps/web/src/lib/store/toastStore.ts` + Toast components. Types: success, error, info, warning. Auto-dismiss 5s. [Source: `apps/web/src/lib/store/toastStore.ts`]
- **Card/Badge atoms** — Standard UI atoms for consistent card styling and status badges. [Source: `apps/web/src/components/atoms/`]
- **Material Icons** — Available via `<span className="material-symbols-outlined">icon_name</span>`. [Source: various components]
- **pdf-parse** — Already installed in apps/api (`pdf-parse` v2.4.5). Extracts text and PDF info metadata (Title, Author, CreationDate). [Source: `apps/api/package.json`]
- **Shared types** — `packages/types/src/citation.ts` (Citation, CitationResponse), `packages/types/src/literature-review.ts` (LiteratureReview, LiteratureReviewResponse), `packages/types/src/document.ts` (Document, DocumentResponse). **No bibliography export types yet.** [Source: `packages/types/src/`]
- **ProcessingJob entity** — Has skippedDocuments, processedDocumentCount from story 3.9. [Source: `apps/api/src/entities/processing-job.entity.ts`]

**What NOT to Build:**

- Do NOT implement `.docx` export — the acceptance criteria specify `.txt` and `.bib` only. The existing static page has `.docx` but the epics specification only requires text files and BibTeX.
- Do NOT implement Vancouver or IEEE citation styles — the epics specification only requires APA, MLA, Chicago, and BibTeX.
- Do NOT implement Harvard style — not in the acceptance criteria.
- Do NOT implement "Include AI-generated summaries" option — not in the acceptance criteria for this story.
- Do NOT add GROBID for metadata extraction — CrossRef API via DOI is sufficient for MVP. GROBID adds Docker container complexity.
- Do NOT create a separate bibliography entity/table — bibliography entries are computed on-the-fly from Citation + ResearchDocument metadata.
- Do NOT modify the AI prompt or literature review generation — metadata extraction happens during PDF extraction, not during AI processing.
- Do NOT modify existing citation rendering (inline markers) — the bibliography section is additive.
- Do NOT implement real-time preview updates in the export UI — the static page's preview panel is out of scope. The main feature is download and clipboard copy from the literature review page.

---

### Technical Requirements

**Entity Changes (ResearchDocument):**

Add one new JSONB column to the ResearchDocument entity for structured bibliographic metadata:

```typescript
// apps/api/src/entities/research-document.entity.ts — ADD this column

@Column({ type: 'jsonb', nullable: true, name: 'bibliographic_metadata' })
bibliographicMetadata: {
  authors?: Array<{ given: string; family: string }>;
  title?: string;
  year?: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publisher?: string;
  url?: string;
  type?: string; // CSL type: 'article-journal', 'book', 'webpage', 'misc'
} | null;
```

**Migration:** Generate with `pnpm --filter api migration:generate -- -n AddBibliographicMetadataToResearchDocument`

**DOI Extraction and CrossRef Enrichment:**

```typescript
// apps/api/src/modules/documents/bibliography-metadata.service.ts

@Injectable()
export class BibliographyMetadataService {
  constructor(private readonly httpService: HttpService) {}

  extractDoi(text: string): string | null {
    const match = text.match(/\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/);
    return match ? match[1] : null;
  }

  async enrichFromCrossRef(doi: string): Promise<BibliographicMetadata | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
          headers: { 'User-Agent': 'ResearchAssistant/1.0 (mailto:contact@research-assistant.app)' },
          timeout: 10000,
        }),
      );
      const item = response.data.message;
      return {
        title: item.title?.[0],
        authors: item.author?.map((a: any) => ({ given: a.given, family: a.family })),
        journal: item['container-title']?.[0],
        volume: item.volume,
        issue: item.issue,
        pages: item.page,
        year: item.issued?.['date-parts']?.[0]?.[0],
        doi: item.DOI,
        publisher: item.publisher,
        type: item.type === 'journal-article' ? 'article-journal' : item.type,
      };
    } catch {
      return null;
    }
  }

  async extractMetadataFromPdf(
    pdfInfo: { Title?: string; Author?: string; CreationDate?: string },
    extractedText: string,
  ): Promise<BibliographicMetadata> {
    // 1. Try DOI extraction + CrossRef first (most reliable)
    const doi = this.extractDoi(extractedText);
    if (doi) {
      const crossRefData = await this.enrichFromCrossRef(doi);
      if (crossRefData) return crossRefData;
    }
    // 2. Fall back to PDF info metadata
    return {
      title: pdfInfo.Title || undefined,
      authors: pdfInfo.Author
        ? this.parseAuthorsFromString(pdfInfo.Author)
        : undefined,
      year: pdfInfo.CreationDate
        ? this.parseYearFromDate(pdfInfo.CreationDate)
        : undefined,
      doi: doi || undefined,
      type: 'misc',
    };
  }
}
```

**Bibliography Formatting Service (using citation-js):**

```typescript
// apps/api/src/modules/literature-reviews/bibliography-export.service.ts

import Cite from 'citation-js';

@Injectable()
export class BibliographyExportService {
  formatBibliography(
    documentsWithMetadata: Array<{ id: string; metadata: BibliographicMetadata; fileName: string }>,
    format: 'apa' | 'mla' | 'chicago' | 'bibtex',
  ): { content: string; warnings: string[] } {
    const warnings: string[] = [];

    // Build CSL-JSON entries, one per unique document
    const cslEntries = documentsWithMetadata.map((doc) => {
      const meta = doc.metadata || {};
      if (!meta.authors?.length) warnings.push(`${doc.fileName}: Missing author information`);
      if (!meta.year) warnings.push(`${doc.fileName}: Missing publication year`);

      return {
        id: doc.id,
        type: meta.type || 'article-journal',
        title: meta.title || doc.fileName.replace('.pdf', ''),
        author: meta.authors?.length
          ? meta.authors.map(a => ({ family: a.family, given: a.given }))
          : [{ literal: '[No author]' }],
        issued: meta.year
          ? { 'date-parts': [[meta.year]] }
          : { literal: '[Unknown year]' },
        'container-title': meta.journal,
        volume: meta.volume,
        issue: meta.issue,
        page: meta.pages,
        DOI: meta.doi,
        publisher: meta.publisher,
      };
    });

    if (format === 'bibtex') {
      // Generate BibTeX using citation-js
      const cite = new Cite(cslEntries);
      return { content: cite.format('bibtex'), warnings };
    }

    // Format using CSL templates (apa, mla, chicago)
    const templateMap = { apa: 'apa', mla: 'mla', chicago: 'chicago-note-bibliography' };
    const cite = new Cite(cslEntries);
    const content = cite.format('bibliography', {
      format: 'text',
      template: templateMap[format],
      lang: 'en-US',
    });
    return { content, warnings };
  }
}
```

**New API Endpoint:**

```typescript
// In literature-reviews.controller.ts — ADD this endpoint

@Get(':id/bibliography')
async exportBibliography(
  @Req() req: any,
  @Param('id', ParseUUIDPipe) id: string,
  @Query('format') format: string,
) {
  if (!req.user?.userId) {
    throw new BadRequestException('Invalid authentication token');
  }
  const validFormats = ['apa', 'mla', 'chicago', 'bibtex'];
  if (!validFormats.includes(format)) {
    throw new BadRequestException(`Invalid format. Supported: ${validFormats.join(', ')}`);
  }
  return this.literatureReviewsService.exportBibliography(id, req.user.userId, format);
}
```

**Frontend BibliographySection Component:**

```tsx
// apps/web/src/components/features/literature-review/BibliographySection.tsx

// Displays numbered bibliography entries below review content
// Has "Export Bibliography" dropdown with format options:
//   - APA 7th Edition — "Author-date format, commonly used in social sciences"
//   - MLA 9th Edition — "Author-page format, commonly used in humanities"
//   - Chicago 17th — "Notes-bibliography format, widely accepted in academia"
//   - BibTeX — "LaTeX/reference manager format (.bib file)"
// Each option has: "Download" and "Copy to Clipboard" buttons
// Warning banner appears if any entries have incomplete metadata
```

**Frontend Download and Clipboard Utilities:**

```typescript
// Add to apps/web/src/lib/api/literature-reviews.ts

export const exportBibliography = async (
  reviewId: string,
  format: string,
): Promise<{ content: string; filename: string; warnings: string[] }> => {
  const response = await apiClient.get(
    `/literature-reviews/${reviewId}/bibliography`,
    { params: { format } },
  );
  return response.data;
};

// In a utils file or inline
export const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
};
```

---

### Architecture Compliance

**Backend Patterns:**
- TypeORM migration for schema changes (JSONB column) [Source: architecture.md#Data-Architecture]
- JSONB column for flexible bibliographic metadata storage [Source: architecture.md#Data-Architecture]
- NestJS service pattern — new services injected via module providers [Source: architecture.md#Backend-Module-Boundaries]
- RESTful API with URL-based versioning (`/api/v1/`) [Source: architecture.md#API-Versioning]
- JWT auth guard on all endpoints [Source: architecture.md#Authentication-Security]
- Query parameter for format selection (not path parameter — aligns with GET semantics) [Source: architecture.md#API-Endpoints]
- Standardized error responses via existing exception filter [Source: architecture.md#Error-Handling]
- kebab-case backend files [Source: architecture.md#File-Naming]
- snake_case DB columns → camelCase TypeScript properties [Source: architecture.md#Naming-Patterns]

**Frontend Patterns:**
- PascalCase component files (BibliographySection.tsx) [Source: architecture.md#File-Naming]
- Feature components in `src/components/features/literature-review/` [Source: architecture.md#Component-Architecture]
- API client in `src/lib/api/` with axios [Source: architecture.md#API-Client]
- Toast notifications for success/error feedback [Source: architecture.md#Error-Handling]
- Existing Card/Badge atoms for consistent UI [Source: architecture.md#Components]
- camelCase JSON fields in API responses [Source: architecture.md#JSON-Fields]

**API Contract:**
- GET endpoint returns JSON (not file stream) — frontend generates the download [Source: architecture.md#API-Responses]
- Response format: `{ content, filename, warnings }` — direct data, no wrapper [Source: architecture.md#API-Responses]
- Dates as ISO 8601 strings [Source: architecture.md#Format-Patterns]

**UX Design Compliance:**
- Bibliography section below review content (matches Design 07 concept) [Source: ux-design-specification.md, epics.md#Story-3.10]
- Calm, spacious design — no aggressive styling [Source: ux-design-specification.md#Experience-Principles]
- Clear action buttons with descriptions [Source: ux-design-specification.md#Guided-Simplicity]
- Warning about incomplete metadata — transparent, not panic-inducing [Source: ux-design-specification.md#Trust-Through-Transparency]
- Toast for clipboard success — brief, non-intrusive feedback [Source: ux-design-specification.md#Emotional-Design-Principles]

---

### Library & Framework Requirements

**New Package Installation Required:**

| Package | Location | Purpose |
|---------|----------|---------|
| `citation-js` | apps/api | Bibliography formatting engine — converts CSL-JSON to APA, MLA, Chicago, BibTeX output. Wraps citeproc-js. |
| `@nestjs/axios` | apps/api | HttpModule for CrossRef API calls. **Check if already installed** — if not, add it. |

**Existing Packages Used:**

| Package | Location | Usage in This Story |
|---------|----------|---------------------|
| `pdf-parse` v2.4.5 | apps/api | Already extracts PDF info metadata (Title, Author, CreationDate) — will access these fields |
| `typeorm` | apps/api | Migration generation, entity column addition |
| `react` 19.x | apps/web | Component rendering |
| `next` 15.x | apps/web | Page modifications |
| `tailwindcss` | apps/web | Bibliography section and export UI styling |

**citation-js Notes:**
- citation-js does NOT ship TypeScript types — create a declaration file (`citation-js.d.ts`)
- Built-in templates: `apa`, `vancouver`, `harvard1`
- For MLA and Chicago: need to register CSL style XML files. Download from [CSL Style Repository](https://github.com/citation-style-language/styles): `modern-language-association.csl` and `chicago-note-bibliography.csl`. Store in `apps/api/src/assets/csl-styles/`.
- Load and register styles at service initialization:

```typescript
import { plugins } from '@citation-js/core';
import * as fs from 'fs';
import * as path from 'path';

// In constructor or onModuleInit:
const mlaXml = fs.readFileSync(path.join(__dirname, '../assets/csl-styles/modern-language-association.csl'), 'utf-8');
const chicagoXml = fs.readFileSync(path.join(__dirname, '../assets/csl-styles/chicago-note-bibliography.csl'), 'utf-8');
plugins.config.get('@csl').templates.add('mla', mlaXml);
plugins.config.get('@csl').templates.add('chicago-note-bibliography', chicagoXml);
```

**CrossRef API Notes:**
- Free, no API key required for polite usage
- Rate limit: ~50 requests/second with polite `User-Agent` header including contact email
- Endpoint: `https://api.crossref.org/works/{doi}`
- Returns comprehensive metadata: title, authors, journal, volume, issue, pages, publisher, dates
- Timeout: use 10 second timeout — external API can be slow

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/migrations/XXXXXXXXX-AddBibliographicMetadataToResearchDocument.ts   # NEW: Migration for metadata column
apps/api/src/modules/documents/bibliography-metadata.service.ts                     # NEW: DOI extraction + CrossRef enrichment
apps/api/src/modules/literature-reviews/bibliography-export.service.ts              # NEW: citation-js formatting service
apps/api/src/modules/literature-reviews/dto/export-bibliography.dto.ts              # NEW: Export request DTO (optional, can validate inline)
apps/api/src/types/citation-js.d.ts                                                 # NEW: TypeScript declarations for citation-js
apps/api/src/assets/csl-styles/modern-language-association.csl                      # NEW: MLA CSL style XML
apps/api/src/assets/csl-styles/chicago-note-bibliography.csl                        # NEW: Chicago CSL style XML
packages/types/src/bibliography.ts                                                  # NEW: Bibliography export types
apps/web/src/components/features/literature-review/BibliographySection.tsx          # NEW: Bibliography display + export component
```

**Files to Modify:**

```
apps/api/src/entities/research-document.entity.ts                                   # MODIFY: Add bibliographicMetadata column
apps/api/src/jobs/pdf-extraction.processor.ts                                       # MODIFY: Add metadata extraction after text extraction
apps/api/src/modules/documents/documents.module.ts                                  # MODIFY: Register BibliographyMetadataService, import HttpModule
apps/api/src/modules/literature-reviews/literature-reviews.module.ts                # MODIFY: Register BibliographyExportService, import ResearchDocument entity
apps/api/src/modules/literature-reviews/literature-reviews.service.ts               # MODIFY: Add exportBibliography() method
apps/api/src/modules/literature-reviews/literature-reviews.controller.ts            # MODIFY: Add GET :id/bibliography endpoint
packages/types/src/document.ts                                                      # MODIFY: Add BibliographicMetadata interface, extend Document types
packages/types/src/index.ts                                                         # MODIFY: Export new bibliography types
apps/web/src/lib/api/literature-reviews.ts                                          # MODIFY: Add exportBibliography(), downloadAsFile(), copyToClipboard()
apps/web/app/literature-review/[id]/page.tsx                                        # MODIFY: Add BibliographySection component
```

**No Changes Expected To:**

```
apps/api/src/entities/literature-review.entity.ts           # No changes — bibliography is computed, not stored
apps/api/src/entities/citation.entity.ts                    # No changes — uses existing citation data
apps/api/src/entities/processing-job.entity.ts              # No changes
apps/api/src/jobs/literature-processing.processor.ts        # No changes — metadata extraction is at PDF extraction time
apps/api/src/modules/ai/ai.service.ts                       # No changes
apps/api/src/gateways/processing.gateway.ts                 # No changes
apps/web/src/lib/store/processingStore.ts                   # No changes
apps/web/src/components/features/processing/ProcessingProgressModal.tsx   # No changes
apps/web/src/components/features/literature-review/LiteratureReviewContent.tsx  # No changes
apps/web/src/components/features/literature-review/LiteratureReviewEditor.tsx   # No changes
apps/web/src/components/features/literature-review/MethodologyProgressTracker.tsx  # No changes
```

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages (apps/api, apps/web, packages/types)
2. `nest build` in apps/api compiles without errors
3. Existing test suite passes (no regressions) — 83+ tests as of Story 3.9
4. **Metadata extraction scenario:** Upload a PDF with a DOI. After extraction completes, check the document record — `bibliographicMetadata` should be populated with author, title, year, journal from CrossRef.
5. **Metadata fallback scenario:** Upload a PDF without a DOI. Verify `bibliographicMetadata` is populated from PDF info fields (title, author from file metadata).
6. **Bibliography section display:** View a completed literature review. Verify the "Bibliography" section appears below the review content with numbered entries.
7. **APA export:** Click "Export as APA" → verify `.txt` file downloads with APA 7th edition formatting. Check author-date format, sentence case titles, sorted alphabetically.
8. **MLA export:** Click "Export as MLA" → verify `.txt` file downloads with MLA 9th edition formatting. Check quotation marks on article titles, hanging indents.
9. **Chicago export:** Click "Export as Chicago" → verify `.txt` file downloads with Chicago 17th edition notes-bibliography formatting.
10. **BibTeX export:** Click "Export as BibTeX" → verify `.bib` file downloads with valid BibTeX entries. Check citation keys follow `authoryearfirstword` pattern. Test import into a reference manager or LaTeX.
11. **Copy to clipboard:** Click "Copy to Clipboard" for any format → verify clipboard contains formatted text, success toast appears.
12. **Incomplete metadata warning:** Upload PDFs with poor metadata (no DOI, no embedded title). Export bibliography. Verify warning message: "Some citations have incomplete metadata. Please verify manually."
13. **Happy path regression:** Full flow — upload PDFs, process, view review, export bibliography, verify all previous functionality (edit, save, citations, methodology tracker, error handling) still works.

---

### Previous Story Intelligence

**From Story 3.9 - Error Handling and Partial Results (Most Recent):**

**Key Learnings:**
1. **Literature review page layout** — Uses `max-w-7xl` with two-column layout (review content flex-1 + sidebar lg:w-80). The bibliography section goes in the primary content column BELOW the review content (after LiteratureReviewContent/Editor, before the page ends). Same column as the partial result warning banner.
2. **83+ tests passing** — Ensure no regressions after changes.
3. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored.
4. **Card styling patterns** — White card with rounded corners, generous padding, subtle border. Use same pattern for bibliography section.
5. **Material Icons** — Use `material-symbols-outlined` spans for icons like `download`, `content_copy`, `format_quote`, `warning`.
6. **Toast system** — Use `useToastStore().addToast({ type: 'success', message: '...' })` for clipboard feedback.
7. **Migration CLI has ESM compatibility issue** — AUTO_RUN_MIGRATIONS=true handles migration on app start instead.
8. **ProcessingJob entity** — Now has `skippedDocuments` and `processedDocumentCount` JSONB fields. No interference with this story.

**From Story 3.7 - Literature Review Display and Editing:**
1. **LiteratureReviewContent** — Renders markdown-like content with inline citation markers `[1]`, `[2]`. Citations appear as superscript clickable elements.
2. **literatureReviewStore** — Zustand store managing review state: `review`, `citations`, `isEditing`, `isSaving`. Fetches via API client.
3. **Two-column layout** — Main content area + methodology sidebar. Bibliography section fits in the main content area.

**From Story 3.4 - Citation Traceability System:**
1. **Citation data structure** — Each citation has `documentId`, `pageNumber`, `claimText`, `positionInReview`. Multiple citations can reference the same document.
2. **Citation numbering** — Ordered by `positionInReview`. Bibliography entries should deduplicate by document (one entry per unique document, regardless of how many citations reference it).

**Code Patterns to Follow:**
- Entity: Same TypeORM column decorator patterns as existing entities (JSONB nullable)
- Service: NestJS `@Injectable()` with dependency injection via constructor
- Controller: Same guard pattern (`@UseGuards(JwtAuthGuard)`), same `mapToResponse()` pattern
- Module: Import `TypeOrmModule.forFeature([...])` for new entity access
- Components: Same Card/Button patterns, Tailwind styling, Material Icons
- API client: Same axios instance pattern with typed responses

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **b562058** — `feat: error handling and partial results with code review fixes (story 3.9)` — Added skippedDocuments tracking, partial results UI
2. **836a51a** — `feat: methodology progress tracker on literature review page with code review fixes (story 3.8)` — Added methodology sidebar
3. **b91b0ad** — `feat: literature review display and editing with inline citations and code review fixes (story 3.7)` — Created literature review page
4. **74e15e0** — `feat: initiate processing and progress display with code review fixes (story 3.6)` — ProcessingProgressModal, processingStore
5. **5e6f11a** — `feat: citation traceability and real-time WebSocket progress (stories 3.4 & 3.5)` — Citation entity, WebSocket gateway

**Commit Message Pattern:** `feat: <description> with code review fixes (story X.Y)`

**Expected Commit for This Story:**
```
feat: bibliography export and citation formatting with code review fixes (story 3.10)
```

**Files Changed in Recent Commits (Relevant to This Story):**
- `apps/api/src/entities/research-document.entity.ts` — Created in story 2.2, will be MODIFIED (add bibliographicMetadata)
- `apps/api/src/jobs/pdf-extraction.processor.ts` — Created in story 2.4, will be MODIFIED (add metadata extraction)
- `apps/api/src/modules/literature-reviews/literature-reviews.service.ts` — Created in story 3.3, will be MODIFIED (add export method)
- `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` — Created in story 3.3, will be MODIFIED (add export endpoint)
- `apps/web/app/literature-review/[id]/page.tsx` — Modified in stories 3.7, 3.8, 3.9, will be MODIFIED again (add BibliographySection)
- `apps/web/src/lib/api/literature-reviews.ts` — Created in story 3.7, will be MODIFIED (add export functions)
- `packages/types/src/document.ts` — Created in story 2.2, will be MODIFIED (add BibliographicMetadata)

---

### Latest Tech Information

**citation-js (v0.7.x, actively maintained as of 2026):**
- Modular package: `citation-js` (wrapper) bundles `@citation-js/core` + plugins for BibTeX, CSL, DOI
- Built-in CSL templates: `apa` (APA 7th), `vancouver`, `harvard1`
- For MLA and Chicago: register external CSL XML templates via `plugins.config.get('@csl').templates.add(name, xml)`
- CSL templates available at: https://github.com/citation-style-language/styles
- Output formats: `'text'` (plain text), `'html'` (HTML with tags), `'rtf'` (RTF)
- BibTeX output: `cite.format('bibtex')` — generates valid `.bib` content
- TypeScript: No built-in types — create declaration file
- Node.js compatible — works in NestJS backend

**CrossRef API (Free, current as of 2026):**
- Endpoint: `https://api.crossref.org/works/{doi}`
- No API key required for polite usage (include `User-Agent` header with contact email)
- Rate limit: ~50 requests/second with polite header
- Returns comprehensive CSL-JSON compatible metadata
- Common response fields: `title`, `author`, `container-title` (journal), `volume`, `issue`, `page`, `issued`, `DOI`, `publisher`, `type`
- Timeout: can be slow (5-15 seconds) — use 10 second timeout

**pdf-parse (v2.4.5, already installed):**
- `result.info` contains: `Title`, `Author`, `Subject`, `Keywords`, `Creator`, `Producer`, `CreationDate`, `ModDate`
- Author field format varies widely — may be "Smith, John" or "John Smith" or "Smith, J.; Doe, R."
- CreationDate format: "D:20260115123045" (PDF date format)
- Some PDFs have empty or unhelpful metadata — CrossRef via DOI is much more reliable

**BibTeX Best Practices:**
- Citation keys: `authoryearfirstword` pattern (lowercase, no spaces, ASCII only)
- Author format: `{LastName, FirstName and LastName, FirstName}`
- Page ranges: double dash `112--145`
- Forbidden characters in keys: `" " @ ' , \ # } { ~ %`
- String values in `{curly braces}` (preferred) or `"double quotes"`

---

### Project Structure Notes

- New JSONB column on ResearchDocument is nullable — backward compatible with existing documents that have no metadata
- Bibliographic metadata extraction runs during PDF extraction (not during AI processing) — this means existing documents won't have metadata until re-uploaded or a backfill is run. For existing documents without metadata, the bibliography export uses filename as fallback.
- citation-js CSL style files need to be bundled with the NestJS build. Store in `src/assets/` and configure `nest-cli.json` to copy assets.
- No new Zustand store needed — bibliography export is stateless (call API, download/copy). Use local component state for loading/error states.
- The existing static `export-bibliography` page at `apps/web/app/export-bibliography/page.tsx` should be evaluated — recommend redirecting to the literature review page or removing if the bibliography functionality is now embedded in the review page.
- Total estimated files: ~10 new + ~10 modified = ~20 files total

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.10-Bibliography-Export-and-Citation-Formatting] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR11-FR13 citation traceability
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture] — TypeORM migrations, JSONB columns
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — RESTful endpoints, error handling
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Component patterns, API client
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — snake_case DB, camelCase TypeScript, PascalCase components, kebab-case backend files
- [Source: _bmad-output/planning-artifacts/prd.md#Citation-Traceability] — FR11-FR15 requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Calm confidence, trust through transparency
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Citation verification as trust builder
- [Source: designs/code/07-export-bibliography.html] — Visual design specification for bibliography export
- [Source: apps/api/src/entities/research-document.entity.ts] — ResearchDocument entity to modify
- [Source: apps/api/src/entities/citation.entity.ts] — Citation entity (read-only reference)
- [Source: apps/api/src/entities/literature-review.entity.ts] — LiteratureReview entity (read-only reference)
- [Source: apps/api/src/jobs/pdf-extraction.processor.ts] — PDF extraction processor to modify
- [Source: apps/api/src/modules/literature-reviews/literature-reviews.service.ts] — Service to extend
- [Source: apps/api/src/modules/literature-reviews/literature-reviews.controller.ts] — Controller to extend
- [Source: apps/web/app/literature-review/[id]/page.tsx] — Page to add bibliography section
- [Source: apps/web/src/lib/api/literature-reviews.ts] — API client to extend
- [Source: apps/web/app/export-bibliography/page.tsx] — Existing static export page (evaluate for removal/redirect)
- [Source: packages/types/src/citation.ts] — Citation types (read-only reference)
- [Source: packages/types/src/document.ts] — Document types to extend
- [Source: packages/types/src/literature-review.ts] — LiteratureReview types (read-only reference)
- [Source: _bmad-output/implementation-artifacts/3-9-error-handling-and-partial-results.md] — Previous story learnings
- [Source: https://api.crossref.org] — CrossRef API for DOI metadata enrichment
- [Source: https://github.com/citation-style-language/styles] — CSL style templates for MLA/Chicago
- [Source: https://citation.js.org] — citation-js documentation

## Change Log

- 2026-02-07: Implemented all 10 tasks for bibliography export and citation formatting (Story 3.10)
- 2026-02-07: Code review fixes — H1: BibliographySection now displays author/title/year/journal from bibliographic metadata (AC #1). H2: Fixed CSL style path (was one `..` short, MLA/Chicago would silently fail). M1: Controller now uses ExportBibliographyDto with ValidationPipe instead of inline validation. M2: Frontend uses BibliographyExportResponse from @repo/types instead of duplicate local definition. M3: Warning state always updated (fixes stale warnings). M4: Dropdown closes on outside click. Also added bibliographicMetadata to documents list API response.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- All 3 typechecks pass (packages/types, apps/api, apps/web)
- `nest build` compiles without errors, CSL assets copied to dist
- 83 tests pass, zero regressions

### Completion Notes List

- **Task 1:** Added `bibliographic_metadata` JSONB nullable column to ResearchDocument entity with TypeORM migration (1739100000000)
- **Task 2:** Created BibliographyMetadataService with DOI extraction (regex), CrossRef API enrichment (with polite User-Agent, 10s timeout), and PDF info fallback. Integrated into pdf-extraction.processor.ts with non-blocking try-catch. Installed `@nestjs/axios` and `axios`. Registered service and HttpModule in ProcessingModule.
- **Task 3:** Installed `citation-js` v0.7.22. Created TypeScript declaration file. Downloaded MLA and Chicago CSL style templates from GitHub CSL repository. Created BibliographyExportService that loads CSL styles on module init, builds CSL-JSON entries from document metadata, and formats via citation-js for APA/MLA/Chicago/BibTeX output. Configured nest-cli.json to copy assets. Incomplete metadata handled with `[No author]`/`[Unknown year]` placeholders and warning collection. BibTeX key generation delegated to citation-js (built-in). Registered in LiteratureReviewsModule.
- **Task 4:** Created ExportBibliographyDto with IsEnum validation. Added `exportBibliography()` method to LiteratureReviewsService — loads review, citations, documents with metadata, deduplicates by documentId, calls formatter, returns `{ content, filename, warnings }`. Added `GET :id/bibliography?format=` endpoint to controller with format validation. Injected ResearchDocument repository.
- **Task 5:** Added BibliographicMetadata interface to packages/types/src/document.ts and optional field to Document interface. Created packages/types/src/bibliography.ts with BibliographyExportFormat, BibliographyExportResponse, BibliographyEntry. Exported from index.ts.
- **Task 6:** Added exportBibliography(), downloadAsFile(), copyToClipboard() to frontend API client.
- **Task 7:** Created BibliographySection component with numbered bibliography entries, Export dropdown (4 formats with descriptions), Download and Copy to Clipboard buttons per format, loading states, incomplete metadata warning banner. Integrated into literature review page below content card.
- **Task 8:** All export/download/clipboard functionality implemented within BibliographySection component — download triggers Blob-based file download, copy uses navigator.clipboard API, warnings displayed in collapsible banner, loading spinners on buttons, error toast on failure.
- **Task 9:** Replaced static export-bibliography page with redirect to dashboard (bibliography now lives on lit review page).
- **Task 10:** pnpm typecheck passes all 3 packages, nest build succeeds with CSL assets, 83 tests pass with zero regressions. Manual verification subtasks left for user.

### File List

**New Files:**
- apps/api/src/migrations/1739100000000-AddBibliographicMetadataToResearchDocument.ts
- apps/api/src/modules/documents/bibliography-metadata.service.ts
- apps/api/src/modules/literature-reviews/bibliography-export.service.ts
- apps/api/src/modules/literature-reviews/dto/export-bibliography.dto.ts
- apps/api/src/types/citation-js.d.ts
- apps/api/src/assets/csl-styles/modern-language-association.csl
- apps/api/src/assets/csl-styles/chicago-fullnote-bibliography.csl
- packages/types/src/bibliography.ts
- apps/web/src/components/features/literature-review/BibliographySection.tsx

**Modified Files:**
- apps/api/src/entities/research-document.entity.ts
- apps/api/src/jobs/pdf-extraction.processor.ts
- apps/api/src/modules/processing/processing.module.ts
- apps/api/src/modules/documents/documents.service.ts (review fix: added bibliographicMetadata to list select)
- apps/api/src/modules/documents/documents.controller.ts (review fix: added bibliographicMetadata to list response)
- apps/api/src/modules/literature-reviews/literature-reviews.module.ts
- apps/api/src/modules/literature-reviews/literature-reviews.service.ts
- apps/api/src/modules/literature-reviews/literature-reviews.controller.ts (review fix: uses ExportBibliographyDto)
- apps/api/src/modules/literature-reviews/bibliography-export.service.ts (review fix: CSL path corrected)
- apps/api/nest-cli.json
- apps/api/package.json
- packages/types/src/document.ts
- packages/types/src/index.ts
- apps/web/src/lib/api/literature-reviews.ts (review fix: uses @repo/types instead of duplicate interface)
- apps/web/app/literature-review/[id]/page.tsx (review fix: passes bibliographicMetadata)
- apps/web/src/components/features/literature-review/BibliographySection.tsx (review fix: displays metadata, click-outside, stale warnings)
- apps/web/app/export-bibliography/page.tsx
