# Payload CMS Demo Application

See @../CLAUDE.md for overall project structure and agent usage patterns.

## Development Commands
- `pnpm dev` - Start Next.js development server with Payload admin
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run all tests (E2E + integration)
- `pnpm test:e2e` - Run Playwright E2E tests only
- `pnpm test:int` - Run Vitest integration tests only
- `pnpm lint` - Run ESLint checks
- `pnpm generate:types` - Generate Payload TypeScript types
- `pnpm generate:importmap` - Generate import map for admin

## Application Architecture

### Next.js 15 App Router Structure
- `src/app/(frontend)/` - Public frontend pages
- `src/app/(payload)/` - Payload CMS admin and API routes
- `src/app/api/` - Custom API endpoints
- `src/collections/` - Payload collection definitions

### Database Configuration
- PostgreSQL with `@payloadcms/db-postgres` adapter
- Connection managed via `DATABASE_URI` environment variable
- Schema automatically managed by Payload migrations

### Collections
- **Users** (`src/collections/Users.ts`) - Authentication and user management
- **Media** (`src/collections/Media.ts`) - File uploads and media library

### Testing Setup
- **E2E Tests**: Playwright in `tests/e2e/` - tests full user workflows
- **Integration Tests**: Vitest in `tests/int/` - tests API endpoints and database operations
- Test configuration in `playwright.config.ts` and `vitest.config.mts`

## Environment Variables Required
- `DATABASE_URI` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Secret key for Payload operations
- `NODE_OPTIONS="--no-deprecation --max-old-space-size=8000"` - Node.js optimization

## Development Workflow
1. Start with database operations using **db-specialist**
2. Use **payload-specialist** for collection and admin customization
3. Apply **frontend-dev** for UI components and Next.js features
4. Implement tests with **test-engineer**
5. Review code quality with **code-reviewer**

## Common Tasks
- Adding new collections: Use **payload-specialist**
- Database schema changes: Use **db-specialist** 
- UI customization: Use **frontend-dev**
- Writing tests: Use **test-engineer**
- Security review: Use **code-reviewer**

## Technology Stack
- Next.js 15.4.4 with App Router
- Payload CMS 3.49.1
- React 19.1.0
- TypeScript 5.7.3
- PostgreSQL via Payload adapter
- Playwright 1.54.1 + Vitest 3.2.3