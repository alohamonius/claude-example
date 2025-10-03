#!/usr/bin/env node

/**
 * Hook: Log subagent START
 * Type: PreToolUse
 * Matcher: Task
 * Triggers: Before Task tool execution (subagent about to start)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read hook input from stdin
let inputData = ''
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  try {
    const hookInput = JSON.parse(inputData)
    const { tool_input, session_id } = hookInput

    // Extract subagent info from Task tool input
    const subagentName = tool_input?.subagent_type || 'unknown'
    const taskDescription = tool_input?.description || tool_input?.prompt?.substring(0, 60) || 'task'

    // Create log entry
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] PRE | Agent: ${subagentName} | Task: ${taskDescription} | Session: ${session_id}\n`

    // Append to history file
    const historyPath = path.join(__dirname, '..', 'subagent-history.log')
    fs.appendFileSync(historyPath, logEntry, 'utf-8')

    // Output success (optional, for debugging)
    console.log(JSON.stringify({
      systemMessage: `🚀 Starting subagent: ${subagentName}`,
      hookSpecificOutput: { agent: subagentName, phase: 'PRE' }
    }))

  } catch (error) {
    console.error(JSON.stringify({
      systemMessage: `PreToolUse hook error: ${error.message}`,
      hookSpecificOutput: { error: true }
    }))
  }
})
