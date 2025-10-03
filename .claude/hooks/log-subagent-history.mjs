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

// Read hook input from stdin
let inputData = ''
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  try {
    const hookInput = JSON.parse(inputData)
    const { session_id, transcript_path, stop_hook_active } = hookInput

    // Prevent infinite loops
    if (stop_hook_active) {
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

    let subagentName = 'unknown'
    let taskDescription = 'completed task'

    // Find the last Task tool use in the transcript
    for (const line of lines) {
      try {
        const turn = JSON.parse(line)

        if (turn.type === 'assistant' && turn.message?.content) {
          for (const block of turn.message.content) {
            if (block.type === 'tool_use' && block.name === 'Task') {
              subagentName = block.input?.subagent_type || 'unknown'
              taskDescription = block.input?.description || block.input?.prompt?.substring(0, 60) || 'task'
            }
          }
        }
      } catch (e) {
        // Skip malformed lines
        continue
      }
    }

    // Create history entry
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] Agent: ${subagentName} | Task: ${taskDescription} | Session: ${session_id}\n`

    // Append to history file
    const historyPath = path.join(__dirname, '..', 'subagent-history.log')
    fs.appendFileSync(historyPath, logEntry, 'utf-8')

    // Output success message
    const response = {
      systemMessage: `📊 Logged subagent activity: ${subagentName} - "${taskDescription}"`,
      hookSpecificOutput: {
        logged: true,
        agent: subagentName,
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
