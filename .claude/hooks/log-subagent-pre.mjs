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

    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '..', 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Append to agent-specific log file
    const agentLogPath = path.join(logsDir, `${subagentName}.log`)
    fs.appendFileSync(agentLogPath, logEntry, 'utf-8')

    // Output success with proper schema
    console.log(JSON.stringify({
      systemMessage: `🚀 Starting subagent: ${subagentName}`,
      hookSpecificOutput: {
        hookEventName: "PreToolUse"
      }
    }))

  } catch (error) {
    console.error(JSON.stringify({
      systemMessage: `PreToolUse hook error: ${error.message}`,
      hookSpecificOutput: { error: true }
    }))
  }
})
