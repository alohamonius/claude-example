#!/usr/bin/env node

/**
 * Hook: Trigger blog-admin agent when SMM writes article files
 * Type: PostToolUse
 * Triggers on: Write tool usage in content-generated/articles/
 */

import fs from 'fs'
import path from 'path'

// Read tool use data from stdin
let inputData = ''
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  try {
    const toolUse = JSON.parse(inputData)

    // DEBUG: Log when hook fires
    console.error(`[DEBUG] trigger-blog-admin.mjs fired at ${new Date().toISOString()}`)
    console.error(`[DEBUG] tool_name: ${toolUse.tool_name}`)
    console.error(`[DEBUG] file_path: ${toolUse.tool_input?.file_path}`)

    // Check if this is a Write tool call
    if (toolUse.tool_name === 'Write') {
      const filePath = toolUse.tool_input?.file_path || ''

      // Check if file is in the articles directory
      if (filePath.includes('content-generated/articles/') && filePath.endsWith('.json')) {
        // Output system message to trigger blog-admin
        const response = {
          systemMessage: `📝 New article detected: ${path.basename(filePath)}. Triggering blog-admin agent to process and insert into database.`,
          hookSpecificOutput: {
            trigger_agent: 'blog-admin',
            article_path: filePath,
            action: 'insert_to_db'
          }
        }

        console.log(JSON.stringify(response))
      }
    }
  } catch (error) {
    console.error(JSON.stringify({
      systemMessage: `Hook error: ${error.message}`,
      hookSpecificOutput: { error: true }
    }))
  }
})
