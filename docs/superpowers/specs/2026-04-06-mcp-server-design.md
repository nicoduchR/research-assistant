# MCP Server for Research Assistant

## Overview

Add an MCP (Model Context Protocol) server to the research-assistant monorepo so Claude Code can interact with the application's full API -- upload documents, run analyses, generate literature reviews, manage thesis questions, and everything else the frontend does.

## Architecture

```
Claude Code  <--stdio-->  apps/mcp (MCP Server)  <--HTTP-->  apps/api (NestJS)
                               |
                         packages/types (shared interfaces)
```

- **Transport**: stdio (standard for local MCP servers)
- **API communication**: HTTP via `fetch` to `http://localhost:3001/api/v1/*`
- **Auth**: `X-API-Key` header on every request, validated by a new NestJS guard
- **Config**: API key and base URL passed as env vars via Claude Code MCP settings

The MCP server is a lightweight Node.js process -- just the MCP SDK + fetch. No business logic; it relays everything to the API.

## Authentication: API Key Guard

Minimal addition to the existing NestJS API:

- New env var `MCP_API_KEY` in `.env`
- New env var `MCP_USER_EMAIL` to identify which user the MCP impersonates
- New `ApiKeyGuard` that checks `X-API-Key` in request headers
- Modify the existing `JwtAuthGuard`: if a valid API key is present, bypass JWT and inject the user resolved from `MCP_USER_EMAIL`
- No changes to controllers -- they continue using `req.user` as before

## MCP Tools (20 total)

### Research Scope (2 tools)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `get_research_scope` | `GET /research-scopes` | Get current research scope |
| `set_research_scope` | `POST /research-scopes` | Create or update research scope (title, problematique, objectives) |

### Documents (5 tools)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `list_documents` | `GET /documents` | List all documents with extraction/analysis status |
| `upload_document` | `POST /documents/upload` | Upload a local PDF file (multipart/form-data) |
| `get_document_analysis` | `GET /documents/:id/analysis` | Get AI analysis of a document |
| `delete_document` | `DELETE /documents/:id` | Delete a document |
| `discard_citation` | `DELETE /documents/:id/analysis/citations/:citationIndex` | Remove a citation from an analysis |

### Literature Reviews (4 tools)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `create_literature_review` | `POST /processing-jobs` | Start literature review synthesis from selected document IDs |
| `get_literature_review` | `GET /literature-reviews/:id` | Get a literature review with citations |
| `update_literature_review` | `PUT /literature-reviews/:id` | Edit review content |
| `export_bibliography` | `GET /literature-reviews/:id/bibliography` | Export bibliography (format: bibtex, apa, csl) |

### Thesis Questions (6 tools)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `bootstrap_thesis_questions` | `POST /thesis-questions/bootstrap` | Generate thesis questions from research scope |
| `list_thesis_questions` | `GET /thesis-questions` | List all thesis questions with status |
| `update_thesis_question` | `PATCH /thesis-questions/:id` | Update question status (a_traiter, en_cours, brouillon, validee) |
| `generate_thesis_answer` | `POST /thesis-questions/:id/generate-answer` | Generate AI answer with evidence tracing |
| `get_thesis_draft` | `GET /thesis-questions/:id/draft` | Get generated answer draft |
| `save_thesis_draft` | `PUT /thesis-questions/:id/draft` | Save or update an answer draft |

### Keyword Discovery (2 tools)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `suggest_keywords` | `GET /research-scopes/keyword-suggestions` | Get AI keyword suggestions from corpus |
| `generate_ebsco_queries` | `POST /thesis-questions/:id/ebsco-queries` | Generate EBSCO boolean queries for a question |

### Jobs & Monitoring (1 tool)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `get_job_status` | `GET /processing-jobs/:id` | Check processing job status and progress |

## Package Structure

```
apps/mcp/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Entry point: create MCP server, register tools, connect stdio
│   ├── api-client.ts         # fetch wrapper: X-API-Key header, error handling
│   ├── tools/
│   │   ├── research-scope.ts # get_research_scope, set_research_scope
│   │   ├── documents.ts      # list_documents, upload_document, get_document_analysis, delete_document, discard_citation
│   │   ├── literature-reviews.ts  # create_literature_review, get_literature_review, update_literature_review, export_bibliography
│   │   ├── thesis-questions.ts    # bootstrap, list, update, generate_answer, get_draft, save_draft
│   │   ├── keywords.ts       # suggest_keywords, generate_ebsco_queries
│   │   └── jobs.ts           # get_job_status
│   └── types.ts              # Re-exports from packages/types
```

### Key implementation details

- **`api-client.ts`**: Minimal fetch wrapper that adds `X-API-Key`, `Content-Type: application/json`, and converts HTTP errors into readable MCP error responses.
- **Tool files**: Each exports a `register(server: McpServer)` function that registers tools via `server.tool()`.
- **`index.ts`**: Instantiates `McpServer`, calls all `register()` functions, connects via `StdioServerTransport`.
- **Upload**: `upload_document` reads a local file path and sends it as `multipart/form-data` to the API.
- **Build**: Simple `tsc` to `dist/`, run via `node dist/index.js`.

### Dependencies

- `@modelcontextprotocol/sdk` -- MCP server SDK
- `packages/types` -- shared TypeScript types (workspace dependency)

No other runtime dependencies needed (`fetch` is native in Node 20+).

## Claude Code Configuration

In `.claude/settings.json` (project-level):

```json
{
  "mcpServers": {
    "research-assistant": {
      "command": "node",
      "args": ["apps/mcp/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3001/api/v1",
        "MCP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Error Handling

- HTTP errors from the API are caught and returned as MCP tool errors with human-readable messages
- Network errors (API not running) return a clear "API unreachable" message
- Rate limit errors (429) are surfaced with the retry-after context

## Out of Scope

- WebSocket integration (MCP tools are request/response; for long-running jobs, use `get_job_status` to poll)
- Production/staging deployment (local dev only)
- OAuth flow in the MCP server
- New business logic -- the MCP is a pure relay to the existing API
