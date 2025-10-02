---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(git branch:*), Bash(git checkout:*), Bash(git log:*), Bash(git diff:*), Bash(gh:*)
description: Commit changes and create pull request with proper branch workflow
---

## Context

- Current branch: !`git branch --show-current`
- Base branch detection: !`git branch -r | grep -E 'origin/(main|master)' | head -1 | sed 's|origin/||'`
- Git status: !`git status`
- Staged and unstaged changes: !`git diff HEAD`
- Recent commits on current branch: !`git log --oneline -5`
- Unpushed commits (if on feature branch): !`git log origin/main..HEAD --oneline 2>/dev/null || git log origin/master..HEAD --oneline 2>/dev/null || echo "No unpushed commits or base branch not found"`

## Your task

Implement a smart git workflow with two scenarios:

### Scenario A: Currently on base branch (main/master)
**NEVER push directly to base branch!**

1. Analyze the unstaged changes using `git diff` and `git status`
2. Generate a descriptive feature branch name based on the changes (e.g., `feature/add-user-auth`, `fix/api-timeout`, `refactor/database-queries`)
3. Create and checkout the new feature branch: `git checkout -b <branch-name>`
4. Stage all changes: `git add .`
5. Create a descriptive commit message summarizing the changes
6. Commit the changes
7. Push to the new feature branch: `git push -u origin <branch-name>`
8. Create PR to base branch using `gh pr create`

### Scenario B: Already on a feature branch
1. Check for unpushed commits using `git log origin/<base>..HEAD`
2. Stage any remaining unstaged changes: `git add .`
3. If there are staged changes, create a commit with a descriptive message
4. Push to the current feature branch: `git push -u origin <current-branch>`
5. Create PR including ALL unpushed commits:
   - Analyze ALL commits that will be included in the PR (not just the latest)
   - Generate a comprehensive title reflecting the overall changes
   - Create detailed description covering all commits and their purposes

### PR Creation Requirements
- Title: Clear, concise summary of all changes
- Description:
  - Summary section with bullet points of key changes
  - List all commits being included
  - Test plan if applicable
  - Reference any relevant issues

**Important**: Always determine the base branch dynamically (check for main or master) and never push directly to it.
