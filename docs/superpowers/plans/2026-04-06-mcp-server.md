# MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an MCP server (`apps/mcp`) that exposes all 20 API endpoints as MCP tools, plus an API key auth guard on the NestJS API.

**Architecture:** Standalone `apps/mcp` package using `@modelcontextprotocol/sdk` with stdio transport. Communicates with the NestJS API via HTTP fetch. Auth via `X-API-Key` header validated by a new NestJS guard that resolves a user from `MCP_USER_EMAIL`.

**Tech Stack:** `@modelcontextprotocol/sdk` 1.29+, `zod` (for tool input schemas), Node 20+ native `fetch`, TypeScript, `@repo/types`

---

## File Map

### New files (apps/mcp)
- `apps/mcp/package.json` — Package definition with deps
- `apps/mcp/tsconfig.json` — TypeScript config extending root
- `apps/mcp/src/index.ts` — Entry point: create server, register tools, connect stdio
- `apps/mcp/src/api-client.ts` — Fetch wrapper with API key and error handling
- `apps/mcp/src/tools/research-scope.ts` — get_research_scope, set_research_scope
- `apps/mcp/src/tools/documents.ts` — list_documents, upload_document, get_document_analysis, delete_document, discard_citation
- `apps/mcp/src/tools/literature-reviews.ts` — create_literature_review, get_literature_review, update_literature_review, export_bibliography
- `apps/mcp/src/tools/thesis-questions.ts` — bootstrap_thesis_questions, list_thesis_questions, update_thesis_question, generate_thesis_answer, get_thesis_draft, save_thesis_draft
- `apps/mcp/src/tools/keywords.ts` — suggest_keywords, generate_ebsco_queries
- `apps/mcp/src/tools/jobs.ts` — get_job_status

### New files (apps/api - auth)
- `apps/api/src/auth/guards/api-key-auth.guard.ts` — API key guard
- `apps/api/src/auth/guards/combined-auth.guard.ts` — Combined JWT-or-API-key guard

### Modified files
- `apps/api/src/auth/auth.module.ts` — Export new guards
- `apps/api/src/auth/auth.service.ts` — Add `findUserByEmail()` method
- `apps/api/.env` — Add `MCP_API_KEY` and `MCP_USER_EMAIL`
- `apps/api/src/modules/documents/documents.controller.ts` — Swap `JwtAuthGuard` for `CombinedAuthGuard`
- `apps/api/src/modules/research/research.controller.ts` — Same swap
- `apps/api/src/modules/processing/processing.controller.ts` — Same swap
- `apps/api/src/modules/literature-reviews/literature-reviews.controller.ts` — Same swap
- `apps/api/src/modules/thesis-questions/thesis-questions.controller.ts` — Same swap

### Config files
- `.claude/settings.json` — MCP server definition (project-level)

---

## Task 1: API Key Auth Guard

**Files:**
- Create: `apps/api/src/auth/guards/api-key-auth.guard.ts`
- Create: `apps/api/src/auth/guards/combined-auth.guard.ts`
- Modify: `apps/api/src/auth/auth.service.ts`
- Modify: `apps/api/src/auth/auth.module.ts`
- Modify: `apps/api/.env`

- [ ] **Step 1: Add env vars to `.env`**

Add to the end of `apps/api/.env`:

```
# MCP Server Auth
MCP_API_KEY=mcp-dev-key-change-me
MCP_USER_EMAIL=your-google-email@gmail.com
```

- [ ] **Step 2: Add `findUserByEmail()` to AuthService**

In `apps/api/src/auth/auth.service.ts`, add this method to the `AuthService` class:

```typescript
async findUserByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOne({ where: { email } });
}
```

- [ ] **Step 3: Create the API key guard**

Create `apps/api/src/auth/guards/api-key-auth.guard.ts`:

```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    const expectedKey = this.configService.get<string>('MCP_API_KEY');
    if (!expectedKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    const email = this.configService.get<string>('MCP_USER_EMAIL');
    if (!email) {
      throw new UnauthorizedException('MCP_USER_EMAIL not configured');
    }

    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User not found for email: ${email}`);
    }

    request.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    return true;
  }
}
```

- [ ] **Step 4: Create the combined auth guard**

Create `apps/api/src/auth/guards/combined-auth.guard.ts`:

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from './api-key-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private apiKeyAuthGuard: ApiKeyAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      return this.apiKeyAuthGuard.canActivate(context);
    }

    return this.jwtAuthGuard.canActivate(context) as Promise<boolean>;
  }
}
```

- [ ] **Step 5: Update AuthModule to export new guards**

In `apps/api/src/auth/auth.module.ts`, add imports and providers:

```typescript
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { CombinedAuthGuard } from './guards/combined-auth.guard';
```

Add `JwtAuthGuard`, `ApiKeyAuthGuard`, `CombinedAuthGuard` to both `providers` and `exports` arrays.

Updated module:

```typescript
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        return {
          secret: configService.get<string>('JWT_SECRET') || '',
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, JwtAuthGuard, ApiKeyAuthGuard, CombinedAuthGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, ApiKeyAuthGuard, CombinedAuthGuard],
})
export class AuthModule {}
```

- [ ] **Step 6: Swap guards in all controllers**

In each of these 5 controllers, replace `JwtAuthGuard` with `CombinedAuthGuard`:

**`apps/api/src/modules/documents/documents.controller.ts`:**
- Change import: `import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';`
- Change decorator: `@UseGuards(CombinedAuthGuard)`

**`apps/api/src/modules/research/research.controller.ts`:**
- Change import: `import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';`
- Change decorator: `@UseGuards(CombinedAuthGuard)`

**`apps/api/src/modules/processing/processing.controller.ts`:**
- Change import: `import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';`
- Change decorator: `@UseGuards(CombinedAuthGuard)`

**`apps/api/src/modules/literature-reviews/literature-reviews.controller.ts`:**
- Change import: `import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';`
- Change decorator: `@UseGuards(CombinedAuthGuard)`

**`apps/api/src/modules/thesis-questions/thesis-questions.controller.ts`:**
- Change import: `import { CombinedAuthGuard } from '../../auth/guards/combined-auth.guard';`
- Change decorator: `@UseGuards(CombinedAuthGuard)`

- [ ] **Step 7: Verify API builds**

Run: `npx turbo run build --filter=api`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add apps/api/src/auth/guards/api-key-auth.guard.ts apps/api/src/auth/guards/combined-auth.guard.ts apps/api/src/auth/auth.service.ts apps/api/src/auth/auth.module.ts apps/api/src/modules/documents/documents.controller.ts apps/api/src/modules/research/research.controller.ts apps/api/src/modules/processing/processing.controller.ts apps/api/src/modules/literature-reviews/literature-reviews.controller.ts apps/api/src/modules/thesis-questions/thesis-questions.controller.ts
git commit -m "feat(api): add API key auth guard for MCP server access"
```

Note: Do NOT commit `.env` — it contains secrets. Only add `.env` to `.env.example` if one exists.

---

## Task 2: MCP Package Scaffold

**Files:**
- Create: `apps/mcp/package.json`
- Create: `apps/mcp/tsconfig.json`
- Create: `apps/mcp/src/index.ts` (stub)
- Create: `apps/mcp/src/api-client.ts`

- [ ] **Step 1: Create `apps/mcp/package.json`**

```json
{
  "name": "@repo/mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0",
    "@repo/types": "workspace:*",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.0.0"
  }
}
```

- [ ] **Step 2: Create `apps/mcp/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/mcp/src/api-client.ts`**

```typescript
interface ApiClientConfig {
  baseUrl: string;
  apiKey: string;
}

interface ApiResponse<T> {
  ok: true;
  data: T;
}

interface ApiError {
  ok: false;
  error: string;
  status: number;
}

type ApiResult<T> = ApiResponse<T> | ApiError;

function getConfig(): ApiClientConfig {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API_BASE_URL environment variable is required');
  }
  const apiKey = process.env.MCP_API_KEY;
  if (!apiKey) {
    throw new Error('MCP_API_KEY environment variable is required');
  }
  return { baseUrl, apiKey };
}

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: body, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPost<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPut<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiPatch<T>(path: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiDelete<T>(path: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': apiKey,
      },
    });
    if (response.status === 204) {
      return { ok: true, data: null as T };
    }
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export async function apiUpload<T>(path: string, filePath: string): Promise<ApiResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  const fs = await import('node:fs');
  const nodePath = await import('node:path');

  if (!fs.existsSync(filePath)) {
    return { ok: false, error: `File not found: ${filePath}`, status: 0 };
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = nodePath.basename(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, fileName);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text, status: response.status };
    }
    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `API unreachable: ${err instanceof Error ? err.message : String(err)}`, status: 0 };
  }
}

export function toToolResult(result: ApiResult<unknown>): { content: Array<{ type: 'text'; text: string }>; isError?: boolean } {
  if (result.ok) {
    return {
      content: [{ type: 'text', text: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2) }],
    };
  }
  return {
    content: [{ type: 'text', text: `Error (${result.status}): ${result.error}` }],
    isError: true,
  };
}
```

- [ ] **Step 4: Create stub `apps/mcp/src/index.ts`**

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'research-assistant',
  version: '0.1.0',
});

// Tools will be registered here in subsequent tasks

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});

export { server };
```

- [ ] **Step 5: Install dependencies**

Run: `cd apps/mcp && pnpm install`
Expected: Dependencies installed, `node_modules` created.

- [ ] **Step 6: Build and verify**

Run: `cd apps/mcp && pnpm build`
Expected: TypeScript compiles to `dist/` with no errors.

- [ ] **Step 7: Commit**

```bash
git add apps/mcp/
git commit -m "feat(mcp): scaffold MCP server package with api-client"
```

---

## Task 3: Research Scope Tools

**Files:**
- Create: `apps/mcp/src/tools/research-scope.ts`
- Modify: `apps/mcp/src/index.ts`

- [ ] **Step 1: Create `apps/mcp/src/tools/research-scope.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, toToolResult } from '../api-client.js';

export function registerResearchScopeTools(server: McpServer): void {
  server.tool(
    'get_research_scope',
    'Get the current research scope (title, problematique, objectives). Returns null if none exists.',
    async () => {
      const result = await apiGet('/research-scopes');
      return toToolResult(result);
    },
  );

  server.tool(
    'set_research_scope',
    'Create or update the research scope. The problematique must be at least 50 characters.',
    {
      title: z.string().describe('Research title (max 200 chars)'),
      problematique: z.string().describe('Research question/problematique (50-2000 chars)'),
      objectives: z.string().optional().describe('Research objectives (max 1000 chars)'),
    },
    async (args) => {
      const result = await apiPost('/research-scopes', {
        title: args.title,
        problematique: args.problematique,
        objectives: args.objectives,
      });
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 2: Register in `apps/mcp/src/index.ts`**

Update `apps/mcp/src/index.ts` — add import and call after server creation:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResearchScopeTools } from './tools/research-scope.js';

const server = new McpServer({
  name: 'research-assistant',
  version: '0.1.0',
});

registerResearchScopeTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Build and verify**

Run: `cd apps/mcp && pnpm build`
Expected: Compiles with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mcp/src/tools/research-scope.ts apps/mcp/src/index.ts
git commit -m "feat(mcp): add research scope tools"
```

---

## Task 4: Document Tools

**Files:**
- Create: `apps/mcp/src/tools/documents.ts`
- Modify: `apps/mcp/src/index.ts`

- [ ] **Step 1: Create `apps/mcp/src/tools/documents.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiDelete, apiUpload, toToolResult } from '../api-client.js';

export function registerDocumentTools(server: McpServer): void {
  server.tool(
    'list_documents',
    'List all uploaded documents with their extraction and analysis status, file size, page count, and bibliographic metadata.',
    async () => {
      const result = await apiGet('/documents');
      return toToolResult(result);
    },
  );

  server.tool(
    'upload_document',
    'Upload a PDF document from a local file path. The file will be extracted and can then be analyzed.',
    {
      filePath: z.string().describe('Absolute path to the PDF file on the local filesystem'),
    },
    async (args) => {
      const result = await apiUpload('/documents/upload', args.filePath);
      return toToolResult(result);
    },
  );

  server.tool(
    'get_document_analysis',
    'Get the AI analysis of a document, including summary, methodology assessment, relevance score (1-10), and key citations.',
    {
      documentId: z.string().uuid().describe('UUID of the document'),
    },
    async (args) => {
      const result = await apiGet(`/documents/${args.documentId}/analysis`);
      return toToolResult(result);
    },
  );

  server.tool(
    'delete_document',
    'Delete a document and its associated analysis.',
    {
      documentId: z.string().uuid().describe('UUID of the document to delete'),
    },
    async (args) => {
      const result = await apiDelete(`/documents/${args.documentId}`);
      return toToolResult(result);
    },
  );

  server.tool(
    'discard_citation',
    'Remove a specific citation from a document analysis by its index.',
    {
      documentId: z.string().uuid().describe('UUID of the document'),
      citationIndex: z.number().int().min(0).describe('Zero-based index of the citation to remove'),
    },
    async (args) => {
      const result = await apiDelete(`/documents/${args.documentId}/analysis/citations/${args.citationIndex}`);
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 2: Register in `apps/mcp/src/index.ts`**

Add import and call:

```typescript
import { registerDocumentTools } from './tools/documents.js';
// ... after registerResearchScopeTools(server);
registerDocumentTools(server);
```

- [ ] **Step 3: Build and verify**

Run: `cd apps/mcp && pnpm build`
Expected: Compiles with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mcp/src/tools/documents.ts apps/mcp/src/index.ts
git commit -m "feat(mcp): add document tools"
```

---

## Task 5: Literature Review Tools

**Files:**
- Create: `apps/mcp/src/tools/literature-reviews.ts`
- Modify: `apps/mcp/src/index.ts`

- [ ] **Step 1: Create `apps/mcp/src/tools/literature-reviews.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, apiPut, toToolResult } from '../api-client.js';

export function registerLiteratureReviewTools(server: McpServer): void {
  server.tool(
    'create_literature_review',
    'Start generating a literature review synthesis from selected documents. Returns a processing job ID that can be polled with get_job_status. Once the job completes, use its resultId with get_literature_review.',
    {
      documentIds: z.array(z.string().uuid()).min(1).describe('Array of document UUIDs to include in the review'),
    },
    async (args) => {
      const result = await apiPost('/processing-jobs', { documentIds: args.documentIds });
      return toToolResult(result);
    },
  );

  server.tool(
    'get_literature_review',
    'Get a literature review with its full content (markdown) and citations.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
    },
    async (args) => {
      const result = await apiGet(`/literature-reviews/${args.reviewId}`);
      return toToolResult(result);
    },
  );

  server.tool(
    'update_literature_review',
    'Update the title or content of a literature review.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
      title: z.string().max(500).optional().describe('New title for the review'),
      content: z.string().optional().describe('New markdown content for the review'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.content !== undefined) body.content = args.content;
      const result = await apiPut(`/literature-reviews/${args.reviewId}`, body);
      return toToolResult(result);
    },
  );

  server.tool(
    'export_bibliography',
    'Export the bibliography of a literature review in a given format.',
    {
      reviewId: z.string().uuid().describe('UUID of the literature review'),
      format: z.enum(['apa', 'mla', 'chicago', 'bibtex']).describe('Bibliography format'),
    },
    async (args) => {
      const result = await apiGet(`/literature-reviews/${args.reviewId}/bibliography?format=${args.format}`);
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 2: Register in `apps/mcp/src/index.ts`**

Add import and call:

```typescript
import { registerLiteratureReviewTools } from './tools/literature-reviews.js';
// ... after registerDocumentTools(server);
registerLiteratureReviewTools(server);
```

- [ ] **Step 3: Build and verify**

Run: `cd apps/mcp && pnpm build`
Expected: Compiles with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mcp/src/tools/literature-reviews.ts apps/mcp/src/index.ts
git commit -m "feat(mcp): add literature review tools"
```

---

## Task 6: Thesis Question Tools

**Files:**
- Create: `apps/mcp/src/tools/thesis-questions.ts`
- Modify: `apps/mcp/src/index.ts`

- [ ] **Step 1: Create `apps/mcp/src/tools/thesis-questions.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, apiPatch, apiPut, toToolResult } from '../api-client.js';

export function registerThesisQuestionTools(server: McpServer): void {
  server.tool(
    'bootstrap_thesis_questions',
    'Generate thesis questions from the current research scope. Requires a research scope to be set first. Returns ~20 structured questions organized by section.',
    async () => {
      const result = await apiPost('/thesis-questions/bootstrap');
      return toToolResult(result);
    },
  );

  server.tool(
    'list_thesis_questions',
    'List all thesis questions with their status (a_traiter, en_cours, brouillon, validee), section, and code.',
    async () => {
      const result = await apiGet('/thesis-questions');
      return toToolResult(result);
    },
  );

  server.tool(
    'update_thesis_question',
    'Update a thesis question status, title, or question text.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
      status: z.enum(['a_traiter', 'en_cours', 'brouillon', 'validee']).optional().describe('New status'),
      title: z.string().max(255).optional().describe('New title'),
      questionText: z.string().max(5000).optional().describe('New question text'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.status !== undefined) body.status = args.status;
      if (args.title !== undefined) body.title = args.title;
      if (args.questionText !== undefined) body.questionText = args.questionText;
      const result = await apiPatch(`/thesis-questions/${args.questionId}`, body);
      return toToolResult(result);
    },
  );

  server.tool(
    'generate_thesis_answer',
    'Generate an AI answer for a thesis question using all analyzed documents as corpus. Returns an answer draft with evidence rows, confidence score, and research gaps. This is a long-running operation.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiPost(`/thesis-questions/${args.questionId}/generate-answer`);
      return toToolResult(result);
    },
  );

  server.tool(
    'get_thesis_draft',
    'Get the generated answer draft for a thesis question, including markdown answer, evidence rows with source references, gaps, and confidence score.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiGet(`/thesis-questions/${args.questionId}/draft`);
      return toToolResult(result);
    },
  );

  server.tool(
    'save_thesis_draft',
    'Save or update an answer draft for a thesis question.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
      answerMarkdown: z.string().optional().describe('Markdown content of the answer'),
      gaps: z.array(z.string()).optional().describe('Array of unresolved research gaps'),
      confidenceScore: z.number().int().min(0).max(100).optional().describe('Confidence score 0-100'),
      status: z.enum(['a_traiter', 'en_cours', 'brouillon', 'validee']).optional().describe('New status for the question'),
    },
    async (args) => {
      const body: Record<string, unknown> = {};
      if (args.answerMarkdown !== undefined) body.answerMarkdown = args.answerMarkdown;
      if (args.gaps !== undefined) body.gaps = args.gaps;
      if (args.confidenceScore !== undefined) body.confidenceScore = args.confidenceScore;
      if (args.status !== undefined) body.status = args.status;
      const result = await apiPut(`/thesis-questions/${args.questionId}/draft`, body);
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 2: Register in `apps/mcp/src/index.ts`**

Add import and call:

```typescript
import { registerThesisQuestionTools } from './tools/thesis-questions.js';
// ... after registerLiteratureReviewTools(server);
registerThesisQuestionTools(server);
```

- [ ] **Step 3: Build and verify**

Run: `cd apps/mcp && pnpm build`
Expected: Compiles with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mcp/src/tools/thesis-questions.ts apps/mcp/src/index.ts
git commit -m "feat(mcp): add thesis question tools"
```

---

## Task 7: Keyword & Job Tools

**Files:**
- Create: `apps/mcp/src/tools/keywords.ts`
- Create: `apps/mcp/src/tools/jobs.ts`
- Modify: `apps/mcp/src/index.ts`

- [ ] **Step 1: Create `apps/mcp/src/tools/keywords.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, apiPost, toToolResult } from '../api-client.js';

export function registerKeywordTools(server: McpServer): void {
  server.tool(
    'suggest_keywords',
    'Get AI-generated keyword suggestions for broadening research, based on the current corpus of analyzed documents. Returns 6-10 keywords with EBSCO-compatible search queries.',
    async () => {
      const result = await apiGet('/research-scopes/keyword-suggestions');
      return toToolResult(result);
    },
  );

  server.tool(
    'generate_ebsco_queries',
    'Generate 6-10 EBSCO boolean search queries tailored to a specific thesis question.',
    {
      questionId: z.string().uuid().describe('UUID of the thesis question'),
    },
    async (args) => {
      const result = await apiPost(`/thesis-questions/${args.questionId}/ebsco-queries`);
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 2: Create `apps/mcp/src/tools/jobs.ts`**

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet, toToolResult } from '../api-client.js';

export function registerJobTools(server: McpServer): void {
  server.tool(
    'get_job_status',
    'Check the status and progress of a processing job (literature review generation). Returns status (queued/processing/completed/failed), progress percentage, and resultId when complete.',
    {
      jobId: z.string().uuid().describe('UUID of the processing job'),
    },
    async (args) => {
      const result = await apiGet(`/processing-jobs/${args.jobId}`);
      return toToolResult(result);
    },
  );
}
```

- [ ] **Step 3: Register both in `apps/mcp/src/index.ts`**

Final `apps/mcp/src/index.ts`:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResearchScopeTools } from './tools/research-scope.js';
import { registerDocumentTools } from './tools/documents.js';
import { registerLiteratureReviewTools } from './tools/literature-reviews.js';
import { registerThesisQuestionTools } from './tools/thesis-questions.js';
import { registerKeywordTools } from './tools/keywords.js';
import { registerJobTools } from './tools/jobs.js';

const server = new McpServer({
  name: 'research-assistant',
  version: '0.1.0',
});

registerResearchScopeTools(server);
registerDocumentTools(server);
registerLiteratureReviewTools(server);
registerThesisQuestionTools(server);
registerKeywordTools(server);
registerJobTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
```

- [ ] **Step 4: Build full MCP package**

Run: `cd apps/mcp && pnpm build`
Expected: Compiles with no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/mcp/src/tools/keywords.ts apps/mcp/src/tools/jobs.ts apps/mcp/src/index.ts
git commit -m "feat(mcp): add keyword discovery and job status tools"
```

---

## Task 8: Claude Code MCP Configuration

**Files:**
- Create: `.claude/settings.json` (or update if exists)

- [ ] **Step 1: Check if `.claude/settings.json` exists**

Run: `cat .claude/settings.json 2>/dev/null || echo "NOT_FOUND"`

- [ ] **Step 2: Create or update `.claude/settings.json`**

Add the MCP server config. If the file already exists, merge into it. If not, create:

```json
{
  "mcpServers": {
    "research-assistant": {
      "command": "node",
      "args": ["apps/mcp/dist/index.js"],
      "cwd": "/Users/dcsolutions/Documents/Dev/research-assistant",
      "env": {
        "API_BASE_URL": "http://localhost:3001/api/v1",
        "MCP_API_KEY": "mcp-dev-key-change-me"
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add .claude/settings.json
git commit -m "feat(mcp): add Claude Code MCP server configuration"
```

---

## Task 9: End-to-End Verification

**Files:** None (verification only)

- [ ] **Step 1: Build everything**

Run: `pnpm build`
Expected: All packages build successfully (api, web, mcp).

- [ ] **Step 2: Start the API**

Run: `cd apps/api && pnpm dev` (in a separate terminal)
Expected: API starts on port 3001.

- [ ] **Step 3: Test API key auth with curl**

Run:
```bash
curl -s -H "X-API-Key: mcp-dev-key-change-me" http://localhost:3001/api/v1/research-scopes | head -50
```
Expected: Returns the research scope (or `null` if none exists) — NOT a 401 error.

- [ ] **Step 4: Test MCP server starts**

Run:
```bash
API_BASE_URL=http://localhost:3001/api/v1 MCP_API_KEY=mcp-dev-key-change-me node apps/mcp/dist/index.js &
MCP_PID=$!
sleep 1
kill $MCP_PID 2>/dev/null
```
Expected: Process starts without errors and can be killed cleanly.

- [ ] **Step 5: Verify tool count**

Run: `grep -c 'server.tool(' apps/mcp/src/tools/*.ts`
Expected: Total of 20 tool registrations across all files.
