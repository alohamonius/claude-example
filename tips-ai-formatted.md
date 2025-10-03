# Claude Code Tips & Best Practices

## Getting Started

1. **Start small** - Begin with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits
2. **Plan Mode** - Use Plan Mode to prepare for a complex request before making changes. Press Tab twice to enable
3. **Git worktrees** - Use git worktrees to run multiple Claude sessions in parallel
4. **Terminal setup** - Run `/terminal-setup` to enable convenient terminal integration like Shift + Enter for new line and more

## Input & Communication

5. **Multi-line messages** - Press Shift+Enter to send a multi-line message
6. **Queue messages** - Hit Enter to queue up additional messages while Claude is working
7. **Real-time steering** - Send messages to Claude while it works to steer Claude in real-time

## Memory & Customization

8. **Memory management** - Use `/memory` to view and manage Claude memory
9. **Quick memory** - Want Claude to remember something? Hit `#` to add preferences, tools, and instructions to Claude's memory
10. **Themes** - Use `/theme` to change the color theme
11. **Status line** - Use `/statusline` to set up a custom status line that will display beneath the input box

## Workflow & Organization

12. **Todo lists** - Ask Claude to create a todo list when working on complex tasks to track progress and remain on track
13. **Time travel** - Press Esc twice to rewind the conversation to a previous point in time
14. **Mode cycling** - Shift+Tab to cycle between default mode, auto-accept edit mode, and plan mode

## Integrations

15. **IDE connection** - Connect Claude to your IDE with `/ide`
16. **GitHub integration** - Run `/install-github-app` to tag @claude right from your Github issues and PRs
17. **Permissions** - Use `/permissions` to pre-approve and pre-deny bash, edit, and MCP tools

## Media & Files

18. **Drag & drop** - Did you know you can drag and drop image files into your terminal?
19. **Paste images** - Paste images into Claude Code using Ctrl+V (not Cmd+V!)

## Advanced Features

20. **Custom commands** - Create custom slash commands by adding .md files to `.claude/commands/` in your project or `~/.claude/commands/` for commands that work in any project
21. **Custom agents** - Use `/agents` to create context-efficient experts for specific tasks (e.g., Code Reviewer, Software Architect, Data Scientist)
22. **Opus Plan Mode** - Your default model setting is Opus Plan Mode. Press Tab twice to activate Plan Mode and plan with Claude Opus
