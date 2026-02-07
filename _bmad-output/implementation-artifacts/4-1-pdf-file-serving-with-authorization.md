# Story 4.1: PDF File Serving with Authorization

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to create a secure endpoint for serving PDF files,
so that users can view their documents while ensuring proper access control.

## Acceptance Criteria

1. **Given** a PDF document exists in the filesystem **When** I create the file serving endpoint **Then** a GET endpoint is created at `/api/v1/documents/{documentId}/file` **And** the endpoint requires authentication (JWT validation) **And** the endpoint verifies the document belongs to the authenticated user **And** if authorized, the PDF file is read from `/uploads/{userId}/{documentId}.pdf` **And** the response sets Content-Type header to `application/pdf` **And** the response sets Content-Disposition header to `inline; filename="[original-filename].pdf"` **And** CORS headers are configured to allow the frontend domain

2. **Given** I am authenticated and own the document **When** I request `/api/v1/documents/{documentId}/file` **Then** the API returns 200 status with the PDF binary data **And** the browser can render the PDF inline

3. **Given** I try to access another user's document **When** I request a document I don't own **Then** the API returns 403 status with error "You do not have permission to view this document" **And** no file is served

4. **Given** I am not authenticated **When** I request a document file **Then** the API returns 401 status with error "Authentication required" **And** no file is served

5. **Given** the document ID doesn't exist in the database **When** I request the file **Then** the API returns 404 status with error "Document not found"

6. **Given** the file exists in database but not on filesystem **When** I request the file **Then** the API returns 500 status with error "File not found on server" **And** the error is logged for investigation

## Tasks / Subtasks

- [x] Task 1: Add file serving method to DocumentsService (AC: #1, #2, #5, #6)
  - [x] 1.1 Add `getDocumentForServing(documentId: string, userId: string): Promise<{ document: ResearchDocument; filePath: string }>` to `apps/api/src/modules/documents/documents.service.ts` — Query document with `where: { id: documentId }`, verify `document.userId === userId` (throw ForbiddenException if mismatch), verify file exists on filesystem using `fs.existsSync()` on `document.storagePath` (throw InternalServerErrorException with logging if missing), return document entity and absolute file path
  - [x] 1.2 Import `ForbiddenException` and `InternalServerErrorException` from `@nestjs/common` if not already imported

- [x] Task 2: Add file serving endpoint to DocumentsController (AC: #1, #2, #3, #4, #5, #6)
  - [x] 2.1 Add `@Get(':id/file')` endpoint to `apps/api/src/modules/documents/documents.controller.ts` — Uses `@Param('id', ParseUUIDPipe) id: string`, calls `documentsService.getDocumentForServing(id, req.user.userId)`, creates `StreamableFile` from `fs.createReadStream(filePath)`, sets response headers: `Content-Type: application/pdf`, `Content-Disposition: inline; filename="${document.fileName}"`, `Content-Length: ${document.fileSize}`
  - [x] 2.2 Import `StreamableFile`, `Res`, `Header` from `@nestjs/common` and `createReadStream` from `fs`. Use `@Res({ passthrough: true })` pattern so NestJS handles response but we can still set headers
  - [x] 2.3 Ensure the endpoint is within the existing `@UseGuards(JwtAuthGuard)` controller-level guard (already applied)

- [x] Task 3: Add frontend API method for PDF file URL (AC: #1, #2)
  - [x] 3.1 Add `getDocumentFileUrl(documentId: string): string` utility to `apps/web/src/lib/api/documents.ts` — Returns the full URL: `${API_BASE_URL}/api/v1/documents/${documentId}/file`. This URL will be passed to react-pdf's Document component with `withCredentials: true`
  - [x] 3.2 Export `API_BASE_URL` from `apps/web/src/lib/api/axiosInstance.ts` if not already exported (needed for constructing the full URL for react-pdf)

- [x] Task 4: Verify build, types, and integration (AC: all)
  - [x] 4.1 Run `pnpm typecheck` — all packages pass
  - [x] 4.2 Run `nest build` in apps/api — compiles without errors
  - [x] 4.3 Run existing test suite — no regressions (83+ tests)
  - [ ] 4.4 Manual verification: request `/api/v1/documents/{id}/file` for an owned document — verify PDF binary data returned with correct headers
  - [ ] 4.5 Manual verification: request another user's document — verify 403 response
  - [ ] 4.6 Manual verification: request non-existent document ID — verify 404 response
  - [ ] 4.7 Manual verification: request without authentication — verify 401 response

## Dev Notes

### Story Context

This is **Story 4.1** in **Epic 4: Citation Verification & PDF Viewer** — the first story in Epic 4. It creates the secure backend endpoint for serving PDF files, which is the foundation for the entire PDF viewer feature (Stories 4.2, 4.3, 4.4).

**Functional Requirements Covered:** FR16 (view PDF documents in side panel) — this story provides the backend file serving mechanism. The frontend viewer is Story 4.2.

**Design Reference:** Design 06: PDF Viewer with Citation Highlight

**Critical Dependency Chain:**
- **Depends on:** Story 2.2 (Document Data Model — ResearchDocument entity with storagePath), Story 2.3 (PDF Upload — files stored at `/uploads/{userId}/{documentId}.pdf`), Story 1.3 (Google OAuth — JWT auth guard) — ALL STATUS: DONE
- **Depended on by:** Story 4.2 (PDF Viewer Component — needs this endpoint to load PDFs), Story 4.3 (Click-to-Verify — triggers loading PDFs via this endpoint), Story 4.4 (PDF Viewer Controls)

**What's Already Built (Do NOT Recreate):**

- **ResearchDocument entity** — `apps/api/src/entities/research-document.entity.ts` — Fields include: id (UUID), userId (UUID FK), fileName (varchar 255), fileSize (bigint), mimeType (varchar 100), storagePath (varchar 500), pageCount (integer nullable), textExtracted (boolean), extractionError (text nullable), extractedText (text nullable), bibliographicMetadata (JSONB nullable), uploadedAt (timestamp), updatedAt (timestamp). [Source: `apps/api/src/entities/research-document.entity.ts`]

- **DocumentsService** — `apps/api/src/modules/documents/documents.service.ts` — Has `uploadDocument(userId, file)`, `listDocuments(userId)` with select fields excluding storagePath/extractedText/userId from list responses, `deleteDocument(documentId, userId)` with user ownership check + file deletion. Uses `StorageService` for path resolution. User scoping pattern: `this.documentRepository.findOne({ where: { id: documentId, userId } })`. [Source: `apps/api/src/modules/documents/documents.service.ts`]

- **DocumentsController** — `apps/api/src/modules/documents/documents.controller.ts` — Has `POST /documents/upload` (with FileInterceptor, 50MB max, rate limited 10/min), `GET /documents` (list), `DELETE /documents/:id`. All protected with `@UseGuards(JwtAuthGuard)` at controller level. User validation pattern: `if (!req.user || !req.user.userId)` throws BadRequestException. Uses `@Req() req: any` to access user. [Source: `apps/api/src/modules/documents/documents.controller.ts`]

- **DocumentsModule** — `apps/api/src/modules/documents/documents.module.ts` — Imports: TypeOrmModule.forFeature([ResearchDocument]), StorageModule, ProcessingModule. Providers: DocumentsService, BibliographyMetadataService. Exports: DocumentsService. [Source: `apps/api/src/modules/documents/documents.module.ts`]

- **StorageService** — `apps/api/src/modules/storage/storage.service.ts` — Has `getStoragePath(userId, documentId)` returning `path.join(uploadBasePath, userId, `${documentId}.pdf`)` and `getAbsoluteStoragePath(userId, documentId)` returning `path.resolve(...)`. Upload base path from `UPLOAD_BASE_PATH` env variable, defaults to `./uploads`. [Source: `apps/api/src/modules/storage/storage.service.ts`]

- **JwtAuthGuard** — `apps/api/src/modules/auth/guards/jwt-auth.guard.ts` — Extends `AuthGuard('jwt')`. JWT extracted from cookie named `access_token` (primary) or Authorization Bearer header (fallback). Attaches `req.user = { userId, email, name }` (userId from JWT sub claim). [Source: `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`]

- **CORS configuration** — `apps/api/src/main.ts` — `app.enableCors({ origin: frontendUrl, credentials: true })` where `frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'`. Already configured for cross-origin with credentials. [Source: `apps/api/src/main.ts`]

- **Frontend API client** — `apps/web/src/lib/api/axiosInstance.ts` — Axios instance with `baseURL: ${API_BASE_URL}/api/v1`, `withCredentials: true`, `timeout: 30000`. JWT sent via httpOnly cookie automatically. Error interceptor auto-logouts on 401. [Source: `apps/web/src/lib/api/axiosInstance.ts`]

- **Frontend documents API** — `apps/web/src/lib/api/documents.ts` — Has `uploadDocument(file, onProgress)`, `listDocuments()`, `deleteDocument(id)`. [Source: `apps/web/src/lib/api/documents.ts`]

- **react-pdf v10.3.0** — Already installed in `apps/web/package.json` along with `pdfjs-dist ^5.4.530`. Ready to use in Story 4.2. [Source: `apps/web/package.json`]

- **Toast system** — `apps/web/src/lib/store/toastStore.ts` + Toast components. Types: success, error, info, warning. Auto-dismiss 5s. [Source: `apps/web/src/lib/store/toastStore.ts`]

- **Shared types** — `packages/types/src/document.ts` — Document interface includes storagePath field (but it's excluded from API list responses for security). [Source: `packages/types/src/document.ts`]

**What NOT to Build:**

- Do NOT build the PDF viewer component — that's Story 4.2
- Do NOT build citation click navigation — that's Story 4.3
- Do NOT build page navigation controls — that's Story 4.4
- Do NOT add a new entity or migration — no schema changes needed
- Do NOT modify the StorageService — use it as-is for path resolution
- Do NOT add range request support (byte-range serving) — not needed for MVP
- Do NOT add PDF thumbnail generation — not in scope
- Do NOT add file caching headers (ETag, Cache-Control) — keep it simple for MVP
- Do NOT create a separate file serving module — add to existing DocumentsController/Service

---

### Technical Requirements

**File Serving Endpoint Pattern:**

```typescript
// In documents.controller.ts — ADD this endpoint

@Get(':id/file')
async getDocumentFile(
  @Req() req: any,
  @Param('id', ParseUUIDPipe) id: string,
  @Res({ passthrough: true }) res: Response,
): Promise<StreamableFile> {
  if (!req.user || !req.user.userId) {
    throw new BadRequestException('Invalid authentication token');
  }
  const { document, filePath } = await this.documentsService.getDocumentForServing(id, req.user.userId);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="${document.fileName}"`,
    'Content-Length': document.fileSize.toString(),
  });

  const fileStream = createReadStream(filePath);
  return new StreamableFile(fileStream);
}
```

**Service Method Pattern:**

```typescript
// In documents.service.ts — ADD this method

async getDocumentForServing(
  documentId: string,
  userId: string,
): Promise<{ document: ResearchDocument; filePath: string }> {
  const document = await this.documentRepository.findOne({
    where: { id: documentId },
  });

  if (!document) {
    throw new NotFoundException('Document not found');
  }

  if (document.userId !== userId) {
    throw new ForbiddenException('You do not have permission to view this document');
  }

  const filePath = document.storagePath;
  if (!existsSync(filePath)) {
    this.logger.error(
      `File not found on filesystem: ${filePath} for document ${documentId}`,
    );
    throw new InternalServerErrorException('File not found on server');
  }

  return { document, filePath };
}
```

**Why separate findOne + userId check instead of `where: { id, userId }`:**

The existing `deleteDocument` uses `where: { id, userId }` which returns 404 for both "not found" and "not owned" — making it impossible to distinguish. For file serving, the acceptance criteria EXPLICITLY require different status codes: 404 for not found, 403 for not owned. So we query by ID only, then check ownership separately.

**Frontend URL Helper:**

```typescript
// In apps/web/src/lib/api/documents.ts — ADD this utility

export const getDocumentFileUrl = (documentId: string): string => {
  return `${API_BASE_URL}/api/v1/documents/${documentId}/file`;
};
```

This URL will be used by react-pdf in Story 4.2:
```typescript
// Future usage (Story 4.2):
<Document
  file={{
    url: getDocumentFileUrl(documentId),
    withCredentials: true,
  }}
/>
```

---

### Architecture Compliance

**Backend Patterns:**
- RESTful API with URL-based versioning (`/api/v1/documents/:id/file`) [Source: architecture.md#API-Versioning]
- JWT auth guard via controller-level `@UseGuards(JwtAuthGuard)` — already applied [Source: architecture.md#Authentication-Security]
- User-scoped document access with ownership verification [Source: architecture.md#Data-Boundaries]
- NestJS `StreamableFile` for efficient file streaming (no full file buffering) [Source: NestJS docs]
- kebab-case backend files (documents.controller.ts, documents.service.ts) [Source: architecture.md#File-Naming]
- Standardized error responses with appropriate HTTP status codes [Source: architecture.md#Error-Handling]
- File serving with authorization middleware pattern [Source: architecture.md#File-Storage]

**API Contract:**
- Endpoint: `GET /api/v1/documents/:id/file` — Serves PDF binary data [Source: architecture.md#API-Boundaries — "GET /api/v1/documents/:id/file — Serve PDF file"]
- Content-Type: `application/pdf` — Browser can render inline [Source: epics.md#Story-4.1 AC#1]
- Content-Disposition: `inline` — PDF renders in browser, not downloaded [Source: epics.md#Story-4.1 AC#1]
- CORS: Already configured with `credentials: true` — httpOnly cookies sent cross-origin [Source: architecture.md#CORS]

**Security:**
- Authentication: JWT validated from httpOnly cookie (existing guard) [Source: architecture.md#Session-Management]
- Authorization: Two-step check — 1) document exists (404), 2) user owns it (403) [Source: epics.md#Story-4.1 AC#3, #5]
- No storagePath leaked in error messages — only log internally [Source: architecture.md#Security]
- File path from DB record, not from user input — prevents path traversal [Source: OWASP]

**Frontend Patterns:**
- API helper returns URL string for react-pdf consumption [Source: architecture.md#Frontend-Architecture]
- `withCredentials: true` for authenticated PDF loading [Source: architecture.md#API-Client]

---

### Library & Framework Requirements

**No New Package Installation Required.**

All needed packages are already installed:

| Package | Location | Usage in This Story |
|---------|----------|---------------------|
| `@nestjs/common` | apps/api | `StreamableFile`, `ParseUUIDPipe`, `ForbiddenException`, `InternalServerErrorException` |
| `fs` (Node.js built-in) | apps/api | `createReadStream`, `existsSync` for file access |
| `typeorm` | apps/api | Repository `findOne` for document lookup |

**No migrations needed** — no schema changes.

**react-pdf & pdfjs-dist Notes (for Story 4.2 context):**
- react-pdf v10.3.0 and pdfjs-dist v5.4.530 are already installed in apps/web
- react-pdf's `Document` component accepts `file={{ url: string, withCredentials: true }}` to load PDFs from authenticated endpoints
- The httpOnly cookie will be sent automatically when `withCredentials: true` is set
- Worker setup critical: `pdfjs.GlobalWorkerOptions.workerSrc` must be set in the same file as the Document component
- For Next.js App Router: component must use `'use client'` directive and be dynamically imported with `ssr: false`

---

### File Structure Requirements

**Files to Create:**

```
(none — all changes are additions to existing files)
```

**Files to Modify:**

```
apps/api/src/modules/documents/documents.service.ts        # MODIFY: Add getDocumentForServing() method
apps/api/src/modules/documents/documents.controller.ts     # MODIFY: Add GET :id/file endpoint
apps/web/src/lib/api/documents.ts                          # MODIFY: Add getDocumentFileUrl() utility
```

**No Changes Expected To:**

```
apps/api/src/entities/research-document.entity.ts          # No changes — entity already has storagePath
apps/api/src/modules/documents/documents.module.ts         # No changes — no new providers needed
apps/api/src/modules/storage/storage.service.ts            # No changes — used as-is
apps/api/src/modules/auth/guards/jwt-auth.guard.ts         # No changes — already applied at controller level
apps/api/src/main.ts                                        # No changes — CORS already configured
apps/api/src/filters/                                       # No changes — using standard NestJS exceptions
packages/types/src/document.ts                              # No changes — no new types needed
```

**Total estimated file changes:** 3 files modified, 0 files created. This is a small, focused story.

---

### Testing Requirements

**No new automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages (apps/api, apps/web, packages/types)
2. `nest build` in apps/api compiles without errors
3. Existing test suite passes (no regressions) — 83+ tests as of Story 3.10
4. **Auth success scenario:** Upload a PDF, then request `GET /api/v1/documents/{id}/file` with valid JWT cookie. Verify: 200 response, `Content-Type: application/pdf`, `Content-Disposition: inline; filename="original-name.pdf"`, PDF binary data in response body
5. **Auth failure scenario (not authenticated):** Request without JWT cookie. Verify: 401 response with "Unauthorized" message
6. **Auth failure scenario (wrong user):** Request a document owned by a different user. Verify: 403 response with "You do not have permission to view this document"
7. **Not found scenario:** Request with non-existent UUID. Verify: 404 response with "Document not found"
8. **File missing scenario:** Delete a PDF file from filesystem but keep DB record. Request the endpoint. Verify: 500 response with "File not found on server" and error logged in backend console
9. **Browser rendering:** Open the endpoint URL directly in browser (with valid session). Verify the PDF renders inline in the browser tab
10. **Cross-origin:** From the frontend app (localhost:3000), use fetch with `credentials: 'include'` to request the endpoint on localhost:3001. Verify CORS headers allow the request

---

### Previous Story Intelligence

**From Story 3.10 - Bibliography Export and Citation Formatting (Most Recent):**

**Key Learnings:**
1. **83+ tests passing** — Ensure no regressions after changes
2. **Pre-existing Next.js build issue** — Root `/` page has useSearchParams without Suspense. This is unrelated and should be ignored.
3. **Migration CLI has ESM compatibility issue** — AUTO_RUN_MIGRATIONS=true handles migration on app start. Not relevant for this story (no migrations).
4. **Material Icons** — Use `material-symbols-outlined` spans for icons
5. **Toast system** — Use `useToastStore().addToast({ type: 'error', message: '...' })` for error feedback
6. **Code review pattern** — Recent stories have had code review fixes for: proper DTO validation, proper use of shared types, path resolution issues

**From Story 2.3 - Single PDF Upload Endpoint (Foundation):**
1. **File storage path** — PDFs stored at `/uploads/{userId}/{documentId}.pdf` via StorageService
2. **storagePath field** — Full path stored in entity: `document.storagePath = storagePath`
3. **File validation** — Upload validates MIME type `application/pdf` with max 50MB
4. **Response DTO pattern** — Controller maps entity to response DTO, excluding internal fields

**From Story 2.7 - Remove Document Functionality:**
1. **Delete pattern** — Uses `this.documentRepository.findOne({ where: { id, userId } })` which returns null for both "not found" and "not authorized" — cannot distinguish 403 vs 404. **Story 4.1 needs distinct error codes**, so use different query pattern.
2. **File deletion** — `fs.unlinkSync(document.storagePath)` pattern shows storagePath is the actual filesystem path

**Code Patterns to Follow:**
- Controller: Same `@Req() req: any` pattern, same user validation
- Service: Same Logger usage, same repository query patterns
- Controller guard: Already applied at class level `@UseGuards(JwtAuthGuard)`
- Error handling: Standard NestJS exceptions (NotFoundException, ForbiddenException, etc.)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **5730429** — `feat: bibliography export and citation formatting with code review fixes (story 3.10)` — Final story in Epic 3
2. **b562058** — `feat: error handling and partial results with code review fixes (story 3.9)` — Added partial results UI
3. **836a51a** — `feat: methodology progress tracker on literature review page with code review fixes (story 3.8)` — Methodology sidebar
4. **b91b0ad** — `feat: literature review display and editing with inline citations and code review fixes (story 3.7)` — Literature review page
5. **74e15e0** — `feat: initiate processing and progress display with code review fixes (story 3.6)` — Processing modal

**Commit Message Pattern:** `feat: <description> with code review fixes (story X.Y)`

**Expected Commit for This Story:**
```
feat: pdf file serving with authorization (story 4.1)
```

**Files Changed in Recent Commits (Relevant to This Story):**
- `apps/api/src/modules/documents/documents.controller.ts` — Modified in story 3.10 (bibliographic metadata in list), will be MODIFIED (add file endpoint)
- `apps/api/src/modules/documents/documents.service.ts` — Modified in story 3.10, will be MODIFIED (add getDocumentForServing)
- `apps/web/src/lib/api/documents.ts` — Created in story 2.5, NOT recently modified, will be MODIFIED (add URL helper)

---

### Latest Tech Information

**NestJS StreamableFile (v10.x, current):**
- `StreamableFile` wraps a readable stream for efficient file serving
- Must use `@Res({ passthrough: true })` to set headers while letting NestJS handle the response
- Do NOT use `@Res()` without `passthrough: true` — it disables NestJS response handling
- Content-Length header is recommended for browsers to show download progress
- `createReadStream` from Node.js `fs` module is the standard approach for large files

**CORS with Credentials for PDF Serving:**
- CORS is already configured: `origin: frontendUrl, credentials: true`
- When serving binary responses (PDFs), CORS headers are automatically included by NestJS CORS middleware
- react-pdf's `Document` component passes `withCredentials: true` in the XHR request, which sends the httpOnly cookie
- No additional CORS configuration needed for the file serving endpoint

**react-pdf File Loading Pattern (for Story 4.2 context):**
```typescript
// react-pdf accepts file as object with url + options
file={{
  url: 'http://localhost:3001/api/v1/documents/{id}/file',
  withCredentials: true,  // Sends cookies cross-origin
}}
```
- `withCredentials: true` is critical — without it, the httpOnly JWT cookie won't be sent
- No Authorization header needed since auth is via cookie
- react-pdf uses XMLHttpRequest internally, which respects `withCredentials`

---

### Project Structure Notes

- This is a minimal story with only 3 files modified — low risk of regressions
- No new dependencies, no migrations, no new files — pure endpoint addition
- The endpoint follows the architecture's predetermined route: `GET /api/v1/documents/:id/file` (documented in architecture.md API Boundaries section)
- Distinct 403 vs 404 responses are important for the frontend (Story 4.2-4.4 will handle these differently in the UI)
- `Content-Disposition: inline` ensures the browser renders the PDF rather than downloading it
- `StreamableFile` ensures memory-efficient serving of potentially large PDFs (up to 50MB)
- StorageService is NOT injected directly in the controller — the service method handles path resolution internally via the entity's `storagePath` field

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1-PDF-File-Serving-with-Authorization] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-4] — Epic context, FR16-FR20 PDF viewer requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Boundaries] — `GET /api/v1/documents/:id/file — Serve PDF file` endpoint defined
- [Source: _bmad-output/planning-artifacts/architecture.md#File-Storage] — File serving with authorization middleware pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-Security] — JWT with httpOnly cookies, auth guards
- [Source: _bmad-output/planning-artifacts/architecture.md#CORS] — CORS configured with credentials for cross-origin cookie sending
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming-Patterns] — kebab-case backend files, camelCase TypeScript
- [Source: _bmad-output/planning-artifacts/prd.md#PDF-Viewer-Verification] — FR16-FR20 requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Citation-Verification] — Click-to-verify as trust mechanism
- [Source: apps/api/src/entities/research-document.entity.ts] — ResearchDocument entity with storagePath
- [Source: apps/api/src/modules/documents/documents.service.ts] — Service to extend with getDocumentForServing
- [Source: apps/api/src/modules/documents/documents.controller.ts] — Controller to extend with file endpoint
- [Source: apps/api/src/modules/storage/storage.service.ts] — StorageService path resolution (reference)
- [Source: apps/api/src/modules/auth/guards/jwt-auth.guard.ts] — JWT auth guard (reference)
- [Source: apps/api/src/main.ts] — CORS configuration (reference)
- [Source: apps/web/src/lib/api/axiosInstance.ts] — Frontend API client configuration
- [Source: apps/web/src/lib/api/documents.ts] — Frontend documents API to extend
- [Source: _bmad-output/implementation-artifacts/3-10-bibliography-export-and-citation-formatting.md] — Previous story learnings
- [Source: _bmad-output/implementation-artifacts/2-3-single-pdf-upload-endpoint.md] — Upload endpoint and storage path patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

(none — clean implementation, no debugging needed)

### Completion Notes List

- Task 1: Added `getDocumentForServing()` method to DocumentsService with two-step authorization: query by ID only (for distinct 404 vs 403), then ownership check, then filesystem existence check with error logging.
- Task 2: Added `GET :id/file` endpoint to DocumentsController using `StreamableFile` with `@Res({ passthrough: true })` pattern. Sets Content-Type, Content-Disposition (inline), and Content-Length headers. Protected by existing controller-level `@UseGuards(JwtAuthGuard)`. UUID validated via `ParseUUIDPipe`.
- Task 3: Exported `API_BASE_URL` from axiosInstance.ts, added `getDocumentFileUrl()` utility to documents.ts for react-pdf consumption in Story 4.2.
- Task 4: All automated checks pass — `pnpm typecheck` (4/4 packages), `nest build` (clean), 83/83 tests pass (0 regressions). Manual verification tasks (4.4-4.7) left for user to verify with running server.

### Change Log

- 2026-02-07: Implemented PDF file serving endpoint with authorization (Story 4.1) — 3 files modified, 0 files created
- 2026-02-07: Code review fixes — H1: RFC 6266 Content-Disposition encoding for non-ASCII filenames, M1+M2: replaced sync existsSync with async fs.access, M3: added ParseUUIDPipe to delete endpoint for consistency

### File List

- apps/api/src/modules/documents/documents.service.ts (modified — added getDocumentForServing method, ForbiddenException import, existsSync import)
- apps/api/src/modules/documents/documents.controller.ts (modified — added GET :id/file endpoint, StreamableFile/ParseUUIDPipe/Res imports, createReadStream/Response imports)
- apps/web/src/lib/api/documents.ts (modified — added getDocumentFileUrl utility, API_BASE_URL import)
- apps/web/src/lib/api/axiosInstance.ts (modified — exported API_BASE_URL)
