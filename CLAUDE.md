# Claude Code Showcase Project

This is a comprehensive demonstration of Claude Code capabilities with specialized agents and MCP integrations, built on Payload CMS foundation.

## Project Commands

- `pnpm setup` - Install dependencies in demo workspace
- `pnpm dev` - Start development server (runs demo)
- `pnpm build` - Build production bundle
- `pnpm test` - Run all tests (E2E + integration)
- `pnpm lint` - Run ESLint checks

## Specialized Agents Available

### When to Use Each Agent

- **db-specialist** - PostgreSQL operations, schema design, Payload database management
  - Use for: Database schema changes, query optimization, PostgreSQL adapter configuration
- **test-engineer** - E2E testing with Playwright, Vitest integration tests
  - Use for: Creating tests, test automation, CI/CD test setup
- **code-reviewer** - Code quality analysis, security scanning, TypeScript validation
  - Use for: Security audits, code quality checks, TypeScript compliance
- **frontend-dev** - React/Next.js development, Payload UI customization
  - Use for: UI components, Next.js routing, Payload admin customization
- **payload-specialist** - Payload CMS expert for collections, admin, API operations
  - Use for: Collection design, Payload configuration, admin panel customization

## MCP Server Integrations

- **postgres** - Database operations via `@modelcontextprotocol/server-postgres`
- **playwright** - Browser automation via `@modelcontextprotocol/server-playwright`
- **context7** - Advanced code analysis via `@upstash/context7-mcp`

## Agent Delegation Patterns

- For database work: "Use db-specialist to [task]"
- For testing: "Use test-engineer to [task]"
- For code review: "Use code-reviewer to analyze [component]"
- For UI work: "Use frontend-dev to create [component]"
- For Payload CMS: "Use payload-specialist to configure [feature]"

## Project Structure

- `demo/` - Main Payload CMS application (Next.js 15 + PostgreSQL)
- `database/` - Database schema and migrations
- `.claude/` - Agent configurations and settings
- Root workspace manages the entire showcase

## Key Technologies

- Next.js 15 with App Router
- Payload CMS 3.x with PostgreSQL adapter
- TypeScript throughout
- Playwright (E2E) + Vitest (integration testing)
- pnpm workspaces
- this is demo claude project