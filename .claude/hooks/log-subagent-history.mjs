#!/usr/bin/env node

/**
 * Hook: Log subagent activity history
 * Type: SubagentStop
 * Triggers on: Task tool completion (any subagent)
 * Purpose: Track all subagent activities to persistent history log
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Debug log helper - writes to file instead of stderr
const debugLogPath = path.join(__dirname, '..', 'logs', 'subagent-stop-debug.log')
const debugLog = (msg) => {
  try {
    fs.appendFileSync(debugLogPath, `${msg}\n`, 'utf-8')
  } catch (e) {
    // Ignore if can't write debug log
  }
}

// Read hook input from stdin
let inputData = ''
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  try {
    const hookInput = JSON.parse(inputData)
    const { session_id, transcript_path, stop_hook_active } = hookInput

    // DEBUG: Log what SubagentStop receives
    debugLog(`\n[DEBUG SubagentStop] Fired at ${new Date().toISOString()}`)
    debugLog(`[DEBUG] Full hookInput: ${JSON.stringify(hookInput, null, 2)}`)
    debugLog(`[DEBUG] session_id: ${session_id}`)
    debugLog(`[DEBUG] transcript_path: ${transcript_path}`)
    debugLog(`[DEBUG] stop_hook_active: ${stop_hook_active}`)

    // Prevent infinite loops
    if (stop_hook_active) {
      debugLog(`[DEBUG] Skipping - stop_hook_active is true`)
      return
    }

    if (!transcript_path || !fs.existsSync(transcript_path)) {
      console.error(JSON.stringify({
        systemMessage: '⚠️ Transcript file not found',
        hookSpecificOutput: { error: true }
      }))
      return
    }

    // Parse transcript to extract subagent info
    const transcriptContent = fs.readFileSync(transcript_path, 'utf-8')
    const lines = transcriptContent.trim().split('\n')

    // DEBUG: Show transcript info
    debugLog(`[DEBUG] Transcript lines count: ${lines.length}`)
    debugLog(`[DEBUG] First 500 chars of transcript:\n${transcriptContent.substring(0, 500)}`)
    debugLog(`[DEBUG] Last 500 chars of transcript:\n${transcriptContent.substring(Math.max(0, transcriptContent.length - 500))}`)

    let subagentName = 'unknown'
    let taskDescription = 'completed task'

    // Find the MOST RECENT Task tool use by parsing in REVERSE order
    let found = false
    for (let i = lines.length - 1; i >= 0; i--) {
      if (found) break

      const line = lines[i]
      try {
        const turn = JSON.parse(line)

        if (turn.type === 'assistant' && turn.message?.content) {
          for (const block of turn.message.content) {
            if (block.type === 'tool_use' && block.name === 'Task') {
              subagentName = block.input?.subagent_type || 'unknown'
              taskDescription = block.input?.description || block.input?.prompt?.substring(0, 60) || 'task'
              debugLog(`[DEBUG] Found most recent Task tool use: ${subagentName}`)
              found = true // Stop searching - we found the most recent one
              break
            }
          }
        }
      } catch (e) {
        // Skip malformed lines
        continue
      }
    }

    debugLog(`[DEBUG] Final subagent name determined: ${subagentName}`)

    // Create history entry - simplified STOP event
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] STOP | Agent: ${subagentName} | Session: ${session_id}\n`

    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '..', 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Append to agent-specific log file
    const agentLogPath = path.join(logsDir, `${subagentName}.log`)
    fs.appendFileSync(agentLogPath, logEntry, 'utf-8')

    // Output success message
    const response = {
      systemMessage: `⏹️ Subagent stopped: ${subagentName}`,
      hookSpecificOutput: {
        logged: true,
        agent: subagentName,
        phase: 'STOP',
        session: session_id
      }
    }

    console.log(JSON.stringify(response))

  } catch (error) {
    console.error(JSON.stringify({
      systemMessage: `Hook error: ${error.message}`,
      hookSpecificOutput: { error: true, message: error.message }
    }))
  }
})
