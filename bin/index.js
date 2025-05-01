#!/usr/bin/env node

import {
  summarizeCommits,
  summarizeDiffs,
  generateCommitMessageFromDiff,
  summarizeFileDiff
} from '../src/summarize.js'
import { showHelpAndExit } from '../src/helpHandlers.js'
import { execSync } from 'child_process'

const args = process.argv.slice(2)

if (args.includes('-h') || args.includes('--help')) {
  showHelpAndExit()
}

const isGenerateMode = args.includes('--gen')
const shouldAutoCommit = args.includes('--commit')
const isDiffMode = args.includes('--diff')
const fileFlagIndex = args.findIndex(arg => arg === '--file')
const filePath = fileFlagIndex !== -1 ? args[fileFlagIndex + 1] : null
const limitArg = args.find(arg => /^\d+$/.test(arg))
const limit = limitArg ? parseInt(limitArg, 10) : 10

if (filePath) {
  console.log(`Summarizing diff for file: ${filePath}`)
  try {
    const summary = await summarizeFileDiff(filePath)
    console.log('\nSummary:')
    console.log(summary)
  } catch (error) {
    console.error('Error:', error.message || error)
    process.exit(1)
  }
  process.exit(0)
}

if (isGenerateMode) {
  console.log('Generating commit message from current diff...')
  try {
    const message = await generateCommitMessageFromDiff()
    console.log('\nSuggested commit message:')
    console.log(message)

    if (shouldAutoCommit) {
      execSync('git add .', { stdio: 'inherit' })
      execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' })
      console.log('\n✅ Changes committed successfully.')
    }
  } catch (error) {
    console.error('Error:', error.message || error)
    process.exit(1)
  }
  process.exit(0)
}

console.log(`Summarizing last ${limit} commits... (${isDiffMode ? 'Diff Mode' : 'Message Mode'})`)

try {
  const summary = isDiffMode
    ? await summarizeDiffs(limit)
    : await summarizeCommits(limit)

  console.log('\nSummary:')
  console.log(summary)
} catch (error) {
  console.error('Error:', error.message || error)
  process.exit(1)
}
