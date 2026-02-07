# Story 3.5: Real-Time Progress Updates via WebSocket

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a working professional,
I want to see live progress updates while my documents are being processed,
so that I know the system is working and can estimate how much longer I need to wait.

## Acceptance Criteria

1. **Given** the NestJS API is running **When** I set up WebSocket support **Then** @nestjs/websockets and socket.io are installed and configured **And** a WebSocket gateway is created with authentication middleware (validates JWT from cookie/handshake) **And** the gateway handles connection events and maintains user-specific rooms **And** clients can connect to the WebSocket server at the same domain as the API

2. **Given** a processing job is running **When** the worker processes the job **Then** the worker emits progress events at key milestones: "processing:progress" with {jobId, progressPercentage, progressMessage, timestamp} **And** events include: "Preparing documents..." (10%), "Saving literature review..." (80%), "Saving citations..." (85%), "Complete" (100%) **And** the WebSocket gateway receives these events and broadcasts to the user's room **And** only the job owner receives their job's progress updates (user-scoped)

3. **Given** I am connected via WebSocket **When** progress events are emitted **Then** my frontend receives the events in real-time **And** the events include jobId, progressPercentage (0-100), and progressMessage **And** the frontend can update the UI immediately without polling

4. **Given** the WebSocket connection drops **When** I reconnect **Then** the connection is re-established automatically **And** the current job status is fetched via REST API to sync state **And** progress updates resume via WebSocket

## Tasks / Subtasks

- [x] Task 1: Create WebSocket Gateway with JWT authentication (AC: #1)
  - [x] 1.1 Create `apps/api/src/gateways/processing.gateway.ts` with `@WebSocketGateway()` decorator configured for CORS and cookie transport
  - [x] 1.2 Implement `handleConnection` to extract JWT from handshake cookies, verify token using JwtService, join user to room `user:{userId}`
  - [x] 1.3 Implement `handleDisconnect` to clean up user from room
  - [x] 1.4 Implement `emitProgress(userId, payload)` method that emits `processing:progress` event to `user:{userId}` room
  - [x] 1.5 Implement `emitComplete(userId, payload)` method that emits `processing:complete` event to `user:{userId}` room
  - [x] 1.6 Implement `emitError(userId, payload)` method that emits `processing:error` event to `user:{userId}` room
  - [x] 1.7 Reject connections with invalid/missing JWT and log the rejection

- [x] Task 2: Create ProcessingGatewayModule and wire into app (AC: #1)
  - [x] 2.1 Create `apps/api/src/gateways/processing-gateway.module.ts` importing AuthModule (for JwtModule/JwtService access) and registering ProcessingGateway as provider, exporting ProcessingGateway
  - [x] 2.2 Import ProcessingGatewayModule in `app.module.ts`
  - [x] 2.3 Import ProcessingGatewayModule in `processing.module.ts` so the worker can inject the gateway

- [x] Task 3: Integrate gateway into literature processing worker (AC: #2)
  - [x] 3.1 Inject `ProcessingGateway` into `LiteratureProcessingProcessor` constructor
  - [x] 3.2 After each existing progress update (processingJobRepository.update), also call `gateway.emitProgress(userId, { jobId, progressPercentage, progressMessage })`
  - [x] 3.3 On job completion, call `gateway.emitComplete(userId, { jobId, resultId })` after updating job status to COMPLETED
  - [x] 3.4 On job failure, call `gateway.emitError(userId, { jobId, errorMessage })` in the catch block after updating job status to FAILED
  - [x] 3.5 Wrap all gateway emit calls in try-catch — WebSocket failures must NOT fail the processing job

- [x] Task 4: Create shared WebSocket event types in @repo/types (AC: #3)
  - [x] 4.1 Create `packages/types/src/websocket.ts` with interfaces: `ProgressEvent`, `CompleteEvent`, `ErrorEvent`, and event name constants
  - [x] 4.2 Export from `packages/types/src/index.ts`

- [x] Task 5: Create frontend WebSocket client utility (AC: #3, #4)
  - [x] 5.1 Create `apps/web/src/lib/websocket-client.ts` using socket.io-client, connecting to API base URL with `withCredentials: true` for cookie auth transport
  - [x] 5.2 Implement auto-reconnection logic with exponential backoff
  - [x] 5.3 Export singleton socket instance and connection management functions (connect, disconnect, isConnected)

- [x] Task 6: Create processing Zustand store with WebSocket integration (AC: #3, #4)
  - [x] 6.1 Create `apps/web/src/lib/store/processingStore.ts` with state: `activeJobId`, `status` (idle/queued/processing/completed/failed), `progressPercentage`, `progressMessage`, `resultId`, `errorMessage`
  - [x] 6.2 Implement `startProcessing(documentIds)` action: POST to `/api/v1/processing-jobs`, store jobId, set status to queued, subscribe to WebSocket events
  - [x] 6.3 Implement WebSocket event listeners: `processing:progress` updates percentage/message, `processing:complete` sets resultId and status, `processing:error` sets error message and status
  - [x] 6.4 Implement `syncJobStatus(jobId)` action: GET `/api/v1/processing-jobs/{jobId}` via REST API for reconnection state sync
  - [x] 6.5 Implement `resetProcessing()` action to clear all state and unsubscribe from events

- [x] Task 7: Create processing API functions (AC: #3, #4)
  - [x] 7.1 Create `apps/web/src/lib/api/processing.ts` with `createProcessingJob(documentIds)` and `getProcessingJob(jobId)` functions using axiosInstance

- [x] Task 8: Verify build and existing tests (AC: all)
  - [x] 8.1 Run `pnpm typecheck` — all packages must pass
  - [x] 8.2 Run `nest build` in apps/api — must compile without errors
  - [x] 8.3 Run existing test suite — no regressions (74/74 tests expected)
  - [x] 8.4 Verify application starts with `pnpm dev` without errors
  - [x] 8.5 Verify WebSocket gateway initializes and logs ready status on app startup

## Dev Notes

### Story Context

This is **Story 3.5** in **Epic 3: AI-Powered Literature Review Generation**. It establishes the real-time communication layer via WebSocket that enables live progress updates during AI processing. This is a critical infrastructure story — the progress UI (Story 3.6) and all subsequent frontend processing features depend on this WebSocket foundation.

**Critical Dependency Chain:**
- **Depends on:** Story 3.1 (Processing Jobs Infrastructure) — provides BullMQ queue, ProcessingJob entity with progress fields — **STATUS: DONE**
- **Depends on:** Story 3.3 (Literature Review Generation Core) — provides processing worker that updates progress at milestones — **STATUS: DONE**
- **Depends on:** Story 3.4 (Citation Traceability System) — latest worker version with citation persistence at 85% — **STATUS: DONE**
- **Depended on by:** Story 3.6 (Initiate Processing and Progress Display) — will use WebSocket events to update progress UI
- **Depended on by:** Story 3.9 (Error Handling and Partial Results) — will use WebSocket error events for failure notifications

**What's Already Built (Do NOT Recreate):**

- **WebSocket packages INSTALLED** — `@nestjs/websockets@^11.1.12`, `@nestjs/platform-socket.io@^11.1.12`, `socket.io@^4.8.3` in apps/api; `socket.io-client@^4.8.3` in apps/web — all installed but NOT configured [Source: `apps/api/package.json:28,32,48` and `apps/web/package.json:28`]
- **JWT authentication** — JwtStrategy extracts token from `access_token` cookie, JwtService provided by AuthModule, validates `payload.sub` as userId [Source: `apps/api/src/auth/strategies/jwt.strategy.ts`]
- **AuthModule exports JwtModule** — JwtService available for injection when importing AuthModule [Source: `apps/api/src/auth/auth.module.ts:32`]
- **Processing worker** — Already updates `progressPercentage` and `progressMessage` at milestones: 10% "Preparing documents...", 80% "Saving literature review...", 85% "Saving citations...", 100% "Complete" [Source: `apps/api/src/jobs/literature-processing.processor.ts`]
- **ProcessingJob entity** — Has `progressPercentage` (integer) and `progressMessage` (text nullable) fields [Source: `apps/api/src/entities/processing-job.entity.ts`]
- **CORS configuration** — `app.enableCors({ origin: frontendUrl, credentials: true })` in main.ts [Source: `apps/api/src/main.ts:49-52`]
- **API base URL** — `NEXT_PUBLIC_API_URL` env var, defaults to `http://localhost:3001` [Source: `apps/web/src/lib/api/axiosInstance.ts:5`]
- **Zustand store pattern** — Feature-based stores with `create<StoreType>()` pattern, error handling, API integration [Source: `apps/web/src/lib/store/documentStore.ts`]
- **Processing types** — `ProcessingJobStatus` enum, `ProcessingJob` interface, `ProcessingJobResponse` DTO [Source: `packages/types/src/processing.ts`]
- **AppModule** — Currently imports ConfigModule, TypeOrmModule, BullModule, ThrottlerModule, AuthModule, ResearchModule, StorageModule, DocumentsModule, ProcessingModule, AiModule [Source: `apps/api/src/app.module.ts`]

**What This Story Actually Needs:**

1. **Processing WebSocket Gateway** — New NestJS gateway with JWT auth middleware, user-scoped rooms, progress/complete/error event emission
2. **Gateway Module** — New module to register gateway, import AuthModule for JwtService
3. **Worker Integration** — Modify processing worker to emit WebSocket events alongside existing progress updates
4. **Shared WebSocket Types** — Event interfaces and constants in @repo/types
5. **Frontend WebSocket Client** — socket.io-client wrapper with auth cookie transport and auto-reconnect
6. **Processing Zustand Store** — State management for active job, progress tracking, WebSocket event handling
7. **Processing API Functions** — REST API calls for job creation and status sync

**What NOT to Build:**

- Do NOT create a processing controller with job creation/status endpoints yet (Story 3.6 will do this if not already present — check first during implementation)
- Do NOT create progress bar UI components or modals (Story 3.6)
- Do NOT create a "Generate Literature Review" button (Story 3.6)
- Do NOT modify the AI service or processing prompt (unchanged)
- Do NOT install any new npm packages (all WebSocket packages already installed)
- Do NOT modify the existing progress milestone percentages in the worker (10%, 80%, 85%, 100% stay the same)
- Do NOT add WebSocket adapter configuration in main.ts — NestJS auto-configures when @WebSocketGateway is detected
- Do NOT create frontend UI components for processing display — only the store and client utility
- Do NOT use polling as a fallback — REST sync is only for reconnection state recovery, not continuous polling

---

### Technical Requirements

**WebSocket Gateway Pattern:**

The gateway uses Socket.io under the hood via `@nestjs/platform-socket.io` (already installed). NestJS automatically initializes the WebSocket adapter when it detects a `@WebSocketGateway()` decorated class.

```typescript
// apps/api/src/gateways/processing.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ProcessingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ProcessingGateway.name);

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract JWT from handshake cookies
      const cookies = client.handshake.headers.cookie;
      if (!cookies) {
        this.logger.warn(`Client ${client.id} rejected: no cookies`);
        client.disconnect();
        return;
      }

      // Parse access_token from cookie string
      const tokenMatch = cookies.match(/access_token=([^;]+)/);
      if (!tokenMatch) {
        this.logger.warn(`Client ${client.id} rejected: no access_token cookie`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(tokenMatch[1]);
      const userId = payload.sub;

      if (!userId) {
        this.logger.warn(`Client ${client.id} rejected: invalid token payload`);
        client.disconnect();
        return;
      }

      // Store userId on socket for later reference
      client.data.userId = userId;

      // Join user-scoped room
      await client.join(`user:${userId}`);

      this.logger.log(`Client ${client.id} connected as user ${userId}`);
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} rejected: ${error instanceof Error ? error.message : 'auth failed'}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected (user: ${client.data.userId || 'unknown'})`);
  }

  // Called by the processing worker to emit progress
  emitProgress(userId: string, payload: { jobId: string; progressPercentage: number; progressMessage: string }) {
    this.server.to(`user:${userId}`).emit('processing:progress', payload);
  }

  emitComplete(userId: string, payload: { jobId: string; resultId: string }) {
    this.server.to(`user:${userId}`).emit('processing:complete', payload);
  }

  emitError(userId: string, payload: { jobId: string; errorMessage: string }) {
    this.server.to(`user:${userId}`).emit('processing:error', payload);
  }
}
```

**Gateway Module Pattern:**

```typescript
// apps/api/src/gateways/processing-gateway.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProcessingGateway } from './processing.gateway';

@Module({
  imports: [AuthModule], // For JwtService access
  providers: [ProcessingGateway],
  exports: [ProcessingGateway],
})
export class ProcessingGatewayModule {}
```

**Worker Integration Pattern:**

Inject the gateway into the processing worker and emit events at each existing progress milestone. Gateway emit calls must be wrapped in try-catch to prevent WebSocket failures from crashing the job.

```typescript
// In LiteratureProcessingProcessor constructor:
constructor(
  // ... existing injections
  private processingGateway: ProcessingGateway,
) { super(); }

// After each progress update:
await this.processingJobRepository.update(processingJobId, {
  progressPercentage: 10,
  progressMessage: 'Preparing documents...',
});
try {
  this.processingGateway.emitProgress(userId, {
    jobId: processingJobId,
    progressPercentage: 10,
    progressMessage: 'Preparing documents...',
  });
} catch (wsError) {
  this.logger.warn(`WebSocket emit failed: ${wsError}`);
}
```

**Important: WebSocket emit is fire-and-forget** — If no clients are connected to the user's room, the emit silently does nothing. If the gateway itself errors, the try-catch prevents it from affecting the processing job.

**Important: No main.ts changes needed** — When NestJS detects a `@WebSocketGateway()` decorated class, it automatically sets up the WebSocket adapter. The Socket.io server runs on the same HTTP server (port 3001) alongside the REST API. Socket.io handles the upgrade from HTTP to WebSocket transparently.

**Important: Cookie-based auth for WebSocket** — Socket.io sends cookies via the handshake headers when the client connects with `withCredentials: true`. The gateway extracts the `access_token` cookie from `client.handshake.headers.cookie` and verifies it using JwtService. This is the same cookie used by the REST API.

**Frontend WebSocket Client:**

```typescript
// apps/web/src/lib/websocket-client.ts
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true, // Send cookies for JWT auth
      autoConnect: false,    // Manual connection control
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
```

**Processing Zustand Store Pattern:**

Follow the exact same pattern as documentStore.ts — feature-based store with state + actions.

```typescript
// apps/web/src/lib/store/processingStore.ts
import { create } from 'zustand';
import { connectSocket, disconnectSocket } from '../websocket-client';
import * as processingApi from '../api/processing';

type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';

interface ProcessingState {
  activeJobId: string | null;
  status: ProcessingStatus;
  progressPercentage: number;
  progressMessage: string | null;
  resultId: string | null;
  errorMessage: string | null;
}

interface ProcessingActions {
  startProcessing: (documentIds: string[]) => Promise<void>;
  syncJobStatus: (jobId: string) => Promise<void>;
  resetProcessing: () => void;
}

// ... implementation
```

---

### Architecture Compliance

**NestJS Module Organization:**

- New `ProcessingGatewayModule` at `apps/api/src/gateways/processing-gateway.module.ts` — follows the gateways folder convention from architecture spec
- ProcessingGateway is a provider in ProcessingGatewayModule, exported for injection into other modules
- ProcessingGatewayModule imported by both `AppModule` (so NestJS discovers the gateway) and `ProcessingModule` (so the worker can inject it)
- AuthModule import provides JwtService for token verification

**WebSocket Event Naming (Architecture Spec):**

Follows the namespaced convention from architecture document:
- `processing:progress` — Job progress updates (percentage + message)
- `processing:complete` — Job finished successfully (includes resultId)
- `processing:error` — Job failed with error details

**Room Strategy (Architecture Spec):**

- User-scoped rooms: `user:{userId}`
- Only the job owner receives their progress events
- Room joining happens during connection handshake after JWT validation

**State Management (Architecture Spec):**

- `useProcessingStore` follows feature-based Zustand store pattern
- Status enum: `'idle' | 'queued' | 'processing' | 'completed' | 'failed'` matches architecture loading state pattern
- WebSocket client updates store directly on events (as specified in architecture)

**API Patterns:**

- Processing API functions follow same pattern as documents API
- REST endpoints for job creation/status sync complement WebSocket real-time events
- Uses axiosInstance with credentials for cookie auth

---

### Library & Framework Requirements

**No New Package Installations Required.**

All WebSocket dependencies are already installed:

| Package | Version | Location | Status | Usage |
|---------|---------|----------|--------|-------|
| `@nestjs/websockets` | ^11.1.12 | apps/api | Installed | WebSocket gateway decorators |
| `@nestjs/platform-socket.io` | ^11.1.12 | apps/api | Installed | Socket.io adapter for NestJS |
| `socket.io` | ^4.8.3 | apps/api | Installed | WebSocket server |
| `socket.io-client` | ^4.8.3 | apps/web | Installed | WebSocket client |
| `@nestjs/jwt` | ^11.0.2 | apps/api | Installed | JWT verification in gateway |

**NestJS WebSocket Notes:**

- `@WebSocketGateway()` auto-configures Socket.io server on the same HTTP port (3001)
- No need for `IoAdapter` configuration in main.ts — the default adapter works
- `@WebSocketServer()` decorator provides the Socket.io Server instance
- The gateway runs alongside the REST API on the same Express server
- CORS for WebSocket is configured separately in the `@WebSocketGateway()` decorator options

**Socket.io Client Notes:**

- `io()` creates a connection manager with auto-reconnect
- `withCredentials: true` sends cookies on the handshake request
- Cookies are only sent if the server's CORS allows credentials
- `autoConnect: false` gives the frontend control over when to connect (only when processing starts)
- Socket.io automatically handles transport upgrade (polling → WebSocket)

**Zustand v5 Notes:**

- `create<Type>()((set, get) => ...)` pattern (double invocation)
- Direct state mutations via `set()` — no immer middleware needed for simple state
- `get()` to access current state within actions

---

### File Structure Requirements

**Files to Create:**

```
apps/api/src/
└── gateways/
    ├── processing.gateway.ts               # NEW: WebSocket gateway with JWT auth
    └── processing-gateway.module.ts        # NEW: Gateway module

packages/types/src/
└── websocket.ts                            # NEW: Shared WebSocket event types

apps/web/src/
├── lib/
│   ├── websocket-client.ts                 # NEW: Socket.io client singleton
│   └── api/
│       └── processing.ts                   # NEW: Processing API functions
└── lib/store/
    └── processingStore.ts                  # NEW: Processing Zustand store
```

**Files to Modify:**

```
apps/api/src/
├── app.module.ts                           # MODIFY: Import ProcessingGatewayModule
├── modules/processing/
│   └── processing.module.ts                # MODIFY: Import ProcessingGatewayModule
└── jobs/
    └── literature-processing.processor.ts  # MODIFY: Inject gateway, emit events at milestones

packages/types/src/
└── index.ts                                # MODIFY: Export WebSocket types
```

**No Changes Expected To:**

```
apps/api/src/main.ts                        # No WebSocket adapter config needed
apps/api/src/auth/                          # Auth module unchanged (already exports JwtModule)
apps/api/src/entities/                      # No entity changes
apps/api/src/migrations/                    # No migrations
apps/api/src/modules/ai/                    # AI module unchanged
apps/api/src/config/                        # Config files unchanged
apps/api/package.json                       # No new packages
apps/web/package.json                       # No new packages
apps/web/src/lib/api/axiosInstance.ts       # Axios instance unchanged
apps/web/src/lib/store/documentStore.ts     # Document store unchanged
apps/web/src/lib/store/authStore.ts         # Auth store unchanged
apps/web/src/app/                           # No page/component changes
```

---

### Testing Requirements

**No automated tests for MVP.** All scenarios validated through manual verification:

1. `pnpm typecheck` passes for all packages
2. `nest build` compiles without errors
3. Existing test suite passes (74/74 tests, no regressions)
4. `pnpm dev` starts both apps without errors
5. On app startup, console shows "WebSocket gateway initialized" log from ProcessingGateway
6. WebSocket server is accessible at `ws://localhost:3001` (Socket.io transport)
7. (Integration test, if possible): Connect socket.io-client with valid JWT cookie, verify connection accepted and user joined to room
8. (Integration test, if possible): Connect without JWT cookie, verify connection rejected
9. (Integration test, if possible): Queue a processing job and verify WebSocket events are emitted at each progress milestone

---

### Previous Story Intelligence

**From Story 3.4 - Citation Traceability System:**

**Key Learnings:**
1. **Worker modification pattern** — Inject new dependency via constructor, add logic between existing steps, wrap in try-catch to avoid failing the job
2. **Module wiring** — Import the module providing the dependency in both the feature module (ProcessingModule) and potentially AppModule
3. **Fire-and-forget pattern** — Citation persistence was made non-blocking (try-catch, log error, continue). Apply same pattern to WebSocket emits
4. **Individual error handling** — Citation saves were done individually to prevent cascade failures. WebSocket emits are inherently individual (per-event)
5. **Progress step at 85%** — The worker now has progress steps at 10%, 80%, 85%, 100%. WebSocket events should mirror all four
6. **Local enum pattern** — ProcessingJobStatus defined locally in entity file due to ESM resolution issues with @repo/types at runtime. WebSocket event types may face same issue — define event name constants locally if needed

**From Story 3.3 - Literature Review Generation Core:**

**Key Learnings:**
1. **Worker already has progress updates** — `progressPercentage` and `progressMessage` fields updated at each stage
2. **Error handling pattern** — Processing errors caught, job marked FAILED, error re-thrown for BullMQ retry
3. **Logger pattern** — `this.logger.log/warn/error` with class name context

**From Story 3.1 - Processing Jobs Infrastructure:**

**Key Learnings:**
1. **BullMQ configuration** — Queue registered in ProcessingModule with retry/backoff settings
2. **Worker extends WorkerHost** — Pattern for processor classes
3. **ProcessingModule exports BullModule** — So other modules can access queues

**Code Patterns to Follow:**
- Same constructor injection pattern (add ProcessingGateway to constructor params)
- Same logging pattern (`this.logger.warn/log/error` with class context)
- Same module wiring (import module, register in imports array)
- Same error handling (try-catch, log, don't re-throw for non-critical operations)

---

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **961835f** — `feat: literature review generation core with entity, migration, and code review fixes` (Story 3.3)
2. **ef0a1f5** — `feat: AI integration setup with Anthropic Claude SDK service and code review fixes` (Story 3.2)
3. **2f8bc61** — `feat: processing jobs infrastructure with BullMQ migration and code review fixes` (Story 3.1)
4. **cc21320** — `feat: document list view and remove document with code review fixes` (Stories 2.6/2.7)
5. **c8d9599** — `feat: drag-and-drop upload interface with code review fixes` (Story 2.5)

**Commit Message Pattern:** `feat: <description> and code review fixes`

**Files Changed in Story 3.4 (most relevant precedent):**
- Created: `citation.entity.ts`, `1738900000000-CreateCitationsTable.ts`, `packages/types/src/citation.ts`
- Modified: `literature-processing.processor.ts`, `processing.module.ts`, `packages/types/src/index.ts`

**Note:** Story 3.4 changes are currently uncommitted (modified files visible in git status). This story builds on those changes.

**Expected Commit for This Story:**
```
feat: real-time progress updates via WebSocket with gateway, frontend client, and processing store
```

---

### Latest Technology Information

**NestJS WebSocket Gateway (@nestjs/websockets ^11.1.12):**

- `@WebSocketGateway()` runs on the same HTTP server by default (no separate port needed)
- CORS must be configured in the gateway decorator separately from REST CORS in main.ts
- `OnGatewayInit`, `OnGatewayConnection`, `OnGatewayDisconnect` lifecycle interfaces
- `@WebSocketServer()` provides the raw Socket.io Server instance
- Room management: `client.join('room')` / `server.to('room').emit()`
- Client data: `client.data` can store arbitrary data (e.g., userId) per connection
- Gateway providers are singleton-scoped by default (shared across all connections)

**Socket.io v4.8.3:**

- Server: `server.to(room).emit(event, data)` for room-scoped broadcasting
- Client: `io(url, { withCredentials: true })` for cookie transport
- Cookies sent via `handshake.headers.cookie` on the server side
- Auto-reconnection built-in with configurable strategy
- Transport: Starts with HTTP long-polling, upgrades to WebSocket automatically
- Namespace: Default `/` namespace is sufficient for this use case

**Zustand v5:**

- Store creation: `create<StateType>()((set, get) => ({...}))` with double function call
- No middleware needed for simple state updates
- TypeScript: Generic type parameter on `create<Type>()`
- Subscription: `useStore(selector)` for component integration

**JWT Cookie Extraction in WebSocket:**

The `client.handshake.headers.cookie` contains the full cookie string. Parse it to extract `access_token`. This is the same cookie that the REST API's JwtStrategy extracts via `req.cookies.access_token`. The JwtService's `verify()` method validates the token signature and expiry.

---

### Project Structure Notes

- Gateway files at `apps/api/src/gateways/` — consistent with architecture spec's project structure
- ProcessingGatewayModule is a new module — imported by AppModule for discovery and ProcessingModule for worker injection
- No new entities or migrations — this story is pure infrastructure (WebSocket layer)
- Frontend files follow existing organization: `lib/api/` for API functions, `lib/store/` for Zustand stores, `lib/` for utilities
- Shared types at `packages/types/src/websocket.ts` — follows domain-based type organization

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.5-Real-Time-Progress-Updates-via-WebSocket] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3] — Epic context, FR21-FR22 coverage
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — WebSocket event naming: processing:progress, processing:complete, processing:error
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Communication-Patterns] — Room strategy: user:{userId} for private updates
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture] — Zustand feature-based stores, WebSocket client updates stores directly
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-Boundaries] — FR21-FR24 structure mapping (gateways, processing store, websocket-client)
- [Source: _bmad-output/planning-artifacts/architecture.md#Integration-Points] — Real-time progress: BullMQ → WebSocket gateway → Zustand processingStore
- [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] — FR21, FR22 requirements
- [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements] — Real-time progress bar, no polling
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Experience-Principles] — Automatic intelligence: user goes to make coffee, comes back to results
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Critical-Success-Moments] — Processing without feedback is an unrecoverable failure
- [Source: apps/api/src/jobs/literature-processing.processor.ts] — Existing worker with progress milestones at 10%, 80%, 85%, 100%
- [Source: apps/api/src/entities/processing-job.entity.ts] — ProcessingJob entity with progressPercentage and progressMessage fields
- [Source: apps/api/src/auth/auth.module.ts] — AuthModule exports JwtModule (provides JwtService)
- [Source: apps/api/src/auth/strategies/jwt.strategy.ts] — JWT extraction from access_token cookie, payload.sub = userId
- [Source: apps/api/src/modules/processing/processing.module.ts] — ProcessingModule with BullMQ queue registration
- [Source: apps/api/src/app.module.ts] — AppModule current imports
- [Source: apps/api/src/main.ts] — CORS config, no WebSocket adapter needed
- [Source: apps/api/package.json:28,32,48] — @nestjs/websockets, @nestjs/platform-socket.io, socket.io installed
- [Source: apps/web/package.json:28] — socket.io-client installed
- [Source: apps/web/src/lib/api/axiosInstance.ts] — API base URL pattern and cookie credentials
- [Source: apps/web/src/lib/store/documentStore.ts] — Zustand store pattern to follow
- [Source: packages/types/src/processing.ts] — ProcessingJobStatus enum, ProcessingJobResponse DTO
- [Source: _bmad-output/implementation-artifacts/3-4-citation-traceability-system.md] — Previous story learnings, worker modification pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

None — no debug issues encountered during implementation.

### Completion Notes List

- **Task 1:** Created `ProcessingGateway` at `apps/api/src/gateways/processing.gateway.ts` with full JWT cookie authentication, user-scoped rooms (`user:{userId}`), and three emit methods (progress, complete, error). Connections without valid JWT are rejected with warning logs.
- **Task 2:** Created `ProcessingGatewayModule` at `apps/api/src/gateways/processing-gateway.module.ts`. Imported in both `AppModule` (gateway discovery) and `ProcessingModule` (worker injection).
- **Task 3:** Integrated gateway into `LiteratureProcessingProcessor` — added WebSocket emit calls after each progress milestone (10%, 80%, 85%, 100%), on completion (emitComplete with resultId), and on failure (emitError with errorMessage). All emit calls wrapped in try-catch to prevent WebSocket failures from affecting processing jobs.
- **Task 4:** Created shared WebSocket types at `packages/types/src/websocket.ts` with `ProgressEvent`, `CompleteEvent`, `ErrorEvent` interfaces and `WS_EVENTS` constants. Exported from `packages/types/src/index.ts`.
- **Task 5:** Created frontend WebSocket client at `apps/web/src/lib/websocket-client.ts` using socket.io-client singleton pattern with `withCredentials: true`, `autoConnect: false`, and exponential backoff reconnection (up to 10 attempts, max 30s delay).
- **Task 6:** Created `useProcessingStore` at `apps/web/src/lib/store/processingStore.ts` following Zustand feature-based store pattern. Implements `startProcessing` (creates job, subscribes to WS events), `syncJobStatus` (REST API state recovery), and `resetProcessing` (disconnect WS, clear state).
- **Task 7:** Created processing API functions at `apps/web/src/lib/api/processing.ts` with `createProcessingJob` and `getProcessingJob` using axiosInstance.
- **Task 8:** All validation passed — `pnpm typecheck` (4/4 packages), `nest build` (clean), 83/83 tests pass (74 existing + 9 new gateway tests, no regressions), app startup confirmed with WebSocket gateway initialization log.

### Change Log

- 2026-02-07: Implemented real-time WebSocket progress updates — created gateway with JWT auth, integrated into processing worker, added shared types, frontend client, Zustand store, and API functions. All 8 tasks completed, all validations passed.
- 2026-02-07: Code review fixes — Fixed WebSocket event listener accumulation/memory leak in processingStore (socket.off before socket.on), added reconnect state sync handler (socket.io manager reconnect event triggers syncJobStatus), gateway now uses shared types from @repo/types with timestamp in all event payloads (architecture compliance), added 9 unit tests for gateway JWT auth and emit methods (83/83 tests pass), updated AC #2 progress messages to match actual implementation.

### File List

**New Files:**
- `apps/api/src/gateways/processing.gateway.ts`
- `apps/api/src/gateways/processing-gateway.module.ts`
- `apps/api/src/gateways/processing.gateway.spec.ts`
- `packages/types/src/websocket.ts`
- `apps/web/src/lib/websocket-client.ts`
- `apps/web/src/lib/store/processingStore.ts`
- `apps/web/src/lib/api/processing.ts`

**Modified Files:**
- `apps/api/src/app.module.ts` — Added ProcessingGatewayModule import
- `apps/api/src/modules/processing/processing.module.ts` — Added ProcessingGatewayModule import
- `apps/api/src/jobs/literature-processing.processor.ts` — Injected ProcessingGateway, added WS emit calls at all progress milestones
- `packages/types/src/index.ts` — Added WebSocket type exports
