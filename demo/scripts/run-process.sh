#!/bin/bash

# Process article: insert to database and move to processed folder
cd /Users/macbook/git-public/ai/claude-code-setup/demo

# Run the TypeScript script
npx tsx scripts/process-article.ts "$1"
