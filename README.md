# Claude Code Showcase

A comprehensive demonstration of Claude Code capabilities with specialized agents and MCP integrations, built on Payload CMS foundation.

## Architecture

### Specialized Agents
- **db-specialist** - PostgreSQL operations and Payload database management
- **test-engineer** - E2E testing with Playwright and Vitest integration
- **code-reviewer** - Code quality analysis and security scanning
- **frontend-dev** - React/Next.js development and Payload UI customization
- **payload-specialist** - Payload CMS expert for collections and admin

### MCP Integrations
- **PostgreSQL Server** - Database operations and schema management
- **Playwright Server** - Automated testing and browser automation  
- **Context7 Server** - Advanced code analysis, context understanding, and semantic search

## Project Structure

```
claude-code-setup/
├── .claude/
│   ├── agents/           # Specialized agent configurations
│   ├── settings.json     # Tool permissions and restrictions
│   └── mcp-config.json   # MCP server configurations
├── demo/                 # Payload CMS application
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── collections/  # Payload collections
│   │   └── payload.config.ts
│   ├── tests/            # E2E and integration tests
│   └── package.json
├── database/
│   └── schema.sql        # Database schema
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Claude Code CLI

### Setup
1. Install dependencies:
   ```bash
   cd demo && pnpm install
   ```

2. Configure environment:
   ```bash
   # Edit .claude/settings.local.json with your database credentials
   # Add your DATABASE_URI and PAYLOAD_SECRET  
   ```

3. Install MCP servers:
   ```bash
   claude mcp add context7 -- npx -y @upstash/context7-mcp
   claude mcp add postgres -- npx @modelcontextprotocol/server-postgres
   claude mcp add playwright -- npx @modelcontextprotocol/server-playwright
   ```

4. Start Claude Code:
   ```bash
   claude
   ```

## Usage Examples

### Database Operations
```bash
claude "Use db-specialist to analyze the Users collection schema"
```

### Testing
```bash
claude "Use test-engineer to create E2E tests for user authentication"
```

### Code Review
```bash
claude "Use code-reviewer to analyze security vulnerabilities in collections"
```

### Frontend Development
```bash
claude "Use frontend-dev to customize the Payload admin dashboard"
```

### Payload CMS Work
```bash
claude "Use payload-specialist to add a new blog collection with rich text"
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **CMS**: Payload CMS 3.x with PostgreSQL
- **Testing**: Playwright (E2E) + Vitest (Integration)
- **Language**: TypeScript
- **Styling**: CSS Modules + SCSS
- **Database**: PostgreSQL with Payload adapter

## Agent Capabilities

Each agent has specialized knowledge and tool access:

- **Database operations** through PostgreSQL MCP
- **Automated testing** via Playwright MCP  
- **Advanced code analysis** using Context7 MCP with semantic search
- **Secure permission system** with explicit allow/deny rules
- **Environment-specific configurations** via settings hierarchy

## Development Workflow

1. **Planning**: Use Claude Code to understand requirements
2. **Implementation**: Delegate to specialized agents
3. **Testing**: Automated E2E and integration testing
4. **Review**: Code quality and security analysis
5. **Deployment**: Production-ready optimization

## Contributing

This showcase demonstrates Claude Code's capabilities for:
- Multi-agent collaboration
- MCP tool integration
- Full-stack development workflows
- Automated testing and quality assurance