#!/usr/bin/env node

/**
 * Hook: Log subagent RESULT
 * Type: PostToolUse
 * Matcher: Task
 * Triggers: After Task tool completes (subagent finished)
 * Purpose: Log success/failure and extract meaningful results
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
    const { tool_input, tool_result, session_id } = hookInput

    // Extract subagent info
    const subagentName = tool_input?.subagent_type || 'unknown'

    // Determine status and extract details from result
    let status = 'UNKNOWN'
    let details = 'No result'

    if (tool_result) {
      const resultText = typeof tool_result === 'string' ? tool_result : JSON.stringify(tool_result)

      // Check for error indicators
      if (resultText.includes('error') || resultText.includes('Error') ||
          resultText.includes('failed') || resultText.includes('Failed')) {
        status = 'ERROR'

        // Extract error message
        const errorMatch = resultText.match(/error[:\s]+([^\n]+)/i) ||
                          resultText.match(/failed[:\s]+([^\n]+)/i)
        if (errorMatch) {
          details = errorMatch[1].substring(0, 100)
        } else {
          details = 'Error occurred (see transcript)'
        }
      }
      // Check for success indicators
      else if (resultText.includes('success') || resultText.includes('Success') ||
               resultText.includes('completed') || resultText.includes('Completed') ||
               resultText.includes('created') || resultText.includes('inserted')) {
        status = 'SUCCESS'

        // Extract meaningful details based on agent type
        if (subagentName === 'smm') {
          // Look for file created
          const fileMatch = resultText.match(/article_\d+_\d+\.json/)
          if (fileMatch) {
            details = `Created ${fileMatch[0]}`
          } else {
            details = 'Article generated'
          }
        } else if (subagentName === 'blog-admin') {
          // Look for database ID and file operations
          const idMatch = resultText.match(/ID[:\s]+(\d+)/i)
          const movedMatch = resultText.includes('moved') || resultText.includes('Moved')

          if (idMatch && movedMatch) {
            details = `Inserted ID:${idMatch[1]}, Moved to processed/`
          } else if (idMatch) {
            details = `Inserted ID:${idMatch[1]}`
          } else if (movedMatch) {
            details = 'Moved file to processed/'
          } else {
            details = 'Processed article'
          }
        } else {
          // Generic success message
          details = resultText.substring(0, 100).trim()
        }
      } else {
        // No clear indicators, check if result exists
        status = 'SUCCESS'
        details = resultText.substring(0, 100).trim()
      }
    }

    // Create log entry
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] POST | Agent: ${subagentName} | Status: ${status} | Details: ${details} | Session: ${session_id}\n`

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
      systemMessage: `✅ Subagent result logged: ${subagentName} - ${status}`,
      hookSpecificOutput: {
        hookEventName: "PostToolUse"
      }
    }))

  } catch (error) {
    console.error(JSON.stringify({
      systemMessage: `PostToolUse hook error: ${error.message}`,
      hookSpecificOutput: { error: true }
    }))
  }
})
