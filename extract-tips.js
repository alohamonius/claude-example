#!/usr/bin/env node
import {readFileSync} from 'fs';

const content = readFileSync(process.argv[2] || 'build', 'utf8');

// Two patterns to find:
// 1. Simple inline tips: {id:"...",content:`...`,cooldownSessions:N}
// 2. React createElement tips with id and cooldownSessions

// Pattern 1: Direct content tips
const directTips = [...content.matchAll(/\{id:"([^"]+)",content:`((?:[^`\\]|\\`|\\\\)*?)`[^}]*?cooldownSessions:(\d+)/g)];

// Pattern 2: Tips defined as constants (e.g., var $K5={id:"...",type:"warning",...})
// Find all tip definitions with id and type
const tipDefinitions = [...content.matchAll(/([A-Z]\w*=\{id:"([^"]+)",type:"(?:info|warning))/g)];

console.log(`=== DIRECT CONTENT TIPS (${directTips.length}) ===\n`);
for (const match of directTips) {
  console.log(`ID: ${match[1]}`);
  console.log(`Content: ${match[2]}`);
  console.log(`Cooldown: ${match[3]} sessions`);
  console.log('---\n');
}

console.log(`\n=== TIP DEFINITIONS (${tipDefinitions.length}) ===\n`);
for (const match of tipDefinitions) {
  console.log(`Variable: ${match[1].replace('={', '')}`);
  console.log(`ID: ${match[2]}`);
  console.log(`Type: ${match[3]}`);
  console.log('---\n');
}

// Try to find all tip IDs with cooldownSessions
const allTipIds = [...content.matchAll(/id:"([^"]+)"[^}]*?cooldownSessions:(\d+)/g)];
console.log(`\n=== ALL TIPS WITH COOLDOWN (${allTipIds.length}) ===\n`);
const uniqueIds = new Map();
for (const match of allTipIds) {
  if (!uniqueIds.has(match[1])) {
    uniqueIds.set(match[1], match[2]);
  }
}
for (const [id, cooldown] of uniqueIds) {
  console.log(`${id}: ${cooldown} sessions`);
}
