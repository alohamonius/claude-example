# Automated SMM → Blog-Admin Workflow

This project demonstrates an automated content pipeline using Claude Code agents and hooks.

## Architecture

```
User Request
    ↓
SMM Agent (researches & writes)
    ↓
Saves JSON to demo/content-generated/articles/
    ↓
[PostToolUse Hook triggers automatically]
    ↓
Blog-Admin Agent (inserts to DB & cleans up)
    ↓
Blog posts in PostgreSQL (viewable in Payload admin)
```

## Agents

### 1. SMM (Social Media Manager)
- **File**: `.claude/agents/smm.md`
- **Tools**: WebSearch, WebFetch, Write, Read, Grep, Glob
- **Purpose**: Research latest news and generate blog posts
- **Output**: JSON files in `demo/content-generated/articles/`

**Usage Example**:
```
"Generate a blog post about recent AI developments in 2025"
```

### 2. Blog-Admin
- **File**: `.claude/agents/blog-admin.md`
- **Tools**: Read, Write, Bash, Glob, Grep, mcp__postgres__*
- **Purpose**: Process article JSON files and insert into database
- **Actions**:
  - Read JSON from articles folder
  - Insert via Payload Local API
  - Move processed files to `demo/content-generated/processed/`

**Automatic Trigger**: Via PostToolUse hook when SMM writes articles
**Manual Trigger**: "Check for new articles and process them"

## Hooks

### SubagentStop Hook
- **File**: `.claude/hooks/log-subagent-history.mjs`
- **Trigger**: When any subagent (Task tool) completes
- **Action**: Logs subagent activity to `.claude/subagent-history.log`
- **Purpose**: Track all subagent activities across sessions
- **Configuration**: `.claude/settings.json`

**Log Format**:
```
[timestamp] Agent: {name} | Task: {description} | Session: {id}
```

**Example Output**:
```
[2025-10-03T14:30:01.234Z] Agent: smm | Task: Generate blog post about AI | Session: abc123
[2025-10-03T14:32:15.567Z] Agent: blog-admin | Task: Insert latest article to DB | Session: abc123
```

### PostToolUse Hook
- **File**: `.claude/hooks/trigger-blog-admin.mjs`
- **Trigger**: When Write tool creates files in `content-generated/articles/`
- **Action**: Automatically invokes blog-admin agent
- **Configuration**: `.claude/settings.json`

## Database Insertion

### Script: `demo/scripts/insert-blog-post.ts`

Handles the actual database insertion using Payload Local API:

```typescript
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const insertBlogPost = async (jsonPath: string) => {
  const payload = await getPayload({ config })
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const result = await payload.create({
    collection: 'blog',
    data: data
  })

  return result.id
}
```

**Manual Usage**:
```bash
cd demo
npx tsx scripts/insert-blog-post.ts content-generated/articles/article_xyz.json
```

## Directory Structure

```
demo/
├── content-generated/
│   ├── articles/        # SMM agent output (pending processing)
│   └── processed/       # Moved here after DB insertion
├── scripts/
│   └── insert-blog-post.ts  # Payload Local API insertion
└── src/
    └── collections/
        └── Blog.ts      # Blog collection schema

.claude/
├── agents/
│   ├── smm.md          # SMM agent definition
│   └── blog-admin.md   # Blog-admin agent definition
├── hooks/
│   └── trigger-blog-admin.js  # PostToolUse hook script
└── settings.json       # Hook configuration
```

## Blog Collection Schema

```typescript
{
  title: string       // Required
  content: string     // Required
  category?: string   // Optional (tech, ai, productivity, business)
  tags?: Array<{ tag: string }>  // Optional keywords
  status?: 'draft' | 'published' // Default: draft
}
```

## End-to-End Example

### Step 1: User Request
```
"Generate 3 blog posts about productivity tips for remote workers"
```

### Step 2: SMM Agent Execution
- Searches web for latest productivity trends
- Reads 2-3 articles for context
- Generates 3 original blog posts
- Saves to:
  - `demo/content-generated/articles/article_20251003_170000.json`
  - `demo/content-generated/articles/article_20251003_170001.json`
  - `demo/content-generated/articles/article_20251003_170002.json`

### Step 3: Hook Triggers (Automatic)
After each file write, the PostToolUse hook:
- Detects file in articles folder
- Outputs system message
- Triggers blog-admin agent

### Step 4: Blog-Admin Processing
For each article:
1. Read JSON file
2. Validate schema
3. Run: `npx tsx scripts/insert-blog-post.ts <path>`
4. On success: Move to `processed/`
5. Report: `✓ Inserted blog post: "10 Tips..." (ID: 42)`

### Step 5: Verification
View in Payload admin: `http://localhost:3000/admin/collections/blog`

Or query PostgreSQL:
```sql
SELECT id, title, category, status FROM blog ORDER BY created_at DESC LIMIT 5;
```

## Manual Testing

### Test SMM Agent Only:
```
[Invoke smm agent]
"Generate a blog post about AI productivity tools in 2025"
```

### Test Blog-Admin Only:
```
[Invoke blog-admin agent]
"Check for new articles and insert them into the database"
```

### Test End-to-End (with hooks):
```
[Let SMM agent work with hooks enabled]
"Create 2 blog posts about machine learning trends"
```
Hook will automatically trigger blog-admin after each article is saved.

## Benefits

1. **Fully Automated**: No manual intervention needed
2. **Separation of Concerns**: SMM focuses on content, Blog-Admin handles database
3. **Error Handling**: Failed files stay in articles/ for retry
4. **Audit Trail**: Processed files moved to processed/ folder
5. **Real-time Research**: SMM uses WebSearch for latest information
6. **Type Safety**: TypeScript throughout the pipeline

## Technologies

- **Claude Code Agents**: SMM, Blog-Admin
- **Claude Code Hooks**: PostToolUse automation
- **Payload CMS**: Database management & admin UI
- **PostgreSQL**: Data storage (port 5433)
- **TypeScript/tsx**: Script execution
- **Web Search**: Real-time content research
