# Research Assistant API

NestJS backend API for the Research Assistant application.

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 16 (Docker or native installation)
- Redis (for background jobs)

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the `.env` file with your local database credentials:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/research_assistant_dev
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

Start PostgreSQL container:

```bash
docker run -d \
  --name research-assistant-db \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=research_assistant_dev \
  postgres:16
```

#### Option B: Native PostgreSQL

Install PostgreSQL 16:

```bash
# macOS
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb research_assistant_dev
```

### 3. Run Migrations

Generate and run database migrations:

```bash
# Run existing migrations
pnpm migration:run

# Generate new migration (after entity changes)
pnpm migration:generate MigrationName

# Revert last migration
pnpm migration:revert
```

### 4. Start Development Server

```bash
pnpm dev
```

The API will be available at http://localhost:3001

- Health check: http://localhost:3001/api/v1/health
- API documentation: http://localhost:3001/api/v1/docs (when Swagger is configured)

## Database Architecture

### TypeORM Configuration

- **ORM**: TypeORM 0.3.x with NestJS integration
- **Migration Strategy**: TypeORM CLI migrations (version-controlled)
- **Entity Discovery**: Automatic via `autoLoadEntities: true`
- **Schema Sync**: Disabled in production (migrations only)

### Naming Conventions

**Database (snake_case):**
- Tables: `users`, `research_documents`, `processing_jobs`
- Columns: `user_id`, `google_id`, `created_at`
- Foreign Keys: `{table}_id` format
- Indexes: `idx_{table}_{column}` format

**TypeScript (camelCase):**
- Properties mapped via `@Column({ name: 'snake_case' })`
- Example: `@Column({ name: 'google_id' }) googleId: string`

### Migration Workflow

1. Modify entity files in `src/entities/`
2. Generate migration: `pnpm migration:generate DescriptiveName`
3. Review generated SQL in migration file
4. Run migration: `pnpm migration:run`
5. Commit migration file to version control

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov
```

## Project Structure

```
apps/api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.config.ts
│   │   └── typeorm-cli.config.ts
│   ├── entities/         # TypeORM entities
│   │   └── user.entity.ts
│   ├── migrations/       # Database migrations
│   │   └── {timestamp}-CreateUsersTable.ts
│   ├── modules/          # Feature modules
│   ├── app.module.ts     # Root module
│   └── main.ts           # Entry point
├── .env                  # Environment variables (git-ignored)
├── .env.example          # Environment template
└── jest.config.js        # Jest configuration
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm typecheck` - Type check code
- `pnpm migration:generate` - Generate new migration
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:revert` - Revert last migration

## Type Sharing

TypeScript types are shared between frontend and backend via the `@repo/types` package:

```typescript
// Backend entity
import { User } from './entities/user.entity';

// Frontend usage
import { User } from '@repo/types';
```

## Database Connection

The API uses environment variables for database connection:

- `DATABASE_URL` - PostgreSQL connection string (recommended)
- Alternative: Individual vars (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)

**Production**: SSL connections are automatically enabled
**Development**: SSL is disabled for localhost connections

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   docker ps  # For Docker
   brew services list  # For native macOS
   ```

2. Test connection:
   ```bash
   psql -h localhost -U postgres -d research_assistant_dev
   ```

3. Check environment variables in `.env`

### Migration Issues

1. Ensure database is running
2. Verify `DATABASE_URL` is correct
3. Check migration files in `src/migrations/`
4. Review migration logs in console

## License

Private - All Rights Reserved
