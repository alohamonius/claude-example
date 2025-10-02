---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(gh:*)
description: Commit changes and create pull request
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -5`

## Your task

Based on the above changes and our conversation history:

1. Stage all changes with `git add .`
2. Create a descriptive commit message that summarizes what we accomplished in this session
3. Commit the changes
4. Push the changes to the remote branch
5. Create a pull request using `gh pr create` with:
   - A clear title summarizing the changes
   - A detailed description of what was implemented/fixed
   - Reference any relevant issues if applicable

Make sure to review the changes before committing and provide a comprehensive PR description.
