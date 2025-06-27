import { execSync } from 'child_process'
import { summarizeWithAI } from './api.js'
import ora from 'ora'

const MAX_PROMPT_LENGTH = 100000

const IGNORED_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'composer.lock',
  'Gemfile.lock',
  'Pipfile.lock',
  'poetry.lock',
  'Cargo.lock',
  'mix.lock',
  'go.sum',
  'npm-shrinkwrap.json',
  'gradle.lockfile',
  'Podfile.lock',
  'pubspec.lock',
]

const IGNORED_EXTENSIONS = [
  '.lock',
  '.log',
  '.class',
  '.jar',
  '.war',
  '.zip',
  '.tar',
  '.gz',
  '.7z',
  '.iml',
  '.xml',
  '.gradle',
  '.idea',
  '.swp',
  '.pyc'
]

function shouldIgnoreFile(file) {
  if (IGNORED_FILES.includes(file)) return true
  return IGNORED_EXTENSIONS.some(ext => file.endsWith(ext))
}

export async function summarizeCommits(limit) {
  const gitLog = execSync(`git log -n ${limit} --pretty=format:"%s"`, { stdio: 'pipe' }).toString()
  const commits = gitLog.trim().split('\n').filter(Boolean)
  if (commits.length === 0) throw new Error('No commits found')

  const prompt = `
You are an AI release note writer.

Given the following Git commit messages, write a concise paragraph describing the key changes made.

Requirements:
- Summarize into exactly 4-6 full sentences.
- Focus on major features added, removed, or improved.
- Mention general themes if appropriate.
- Do NOT copy or repeat the commit messages directly.
- Do NOT list bullet points.
- Output only a paragraph, no titles or headers.

Here are the commit messages:

${commits.join('\n')}

Summary:
`.slice(0, MAX_PROMPT_LENGTH)

  const spinner = ora('Summarizing commit messages...').start()

  try {
    const summary = await summarizeWithAI(prompt)
    spinner.succeed('Commit messages summarized.')
    return summary
  } catch (error) {
    spinner.fail('Failed to summarize commit messages.')
    throw error
  }
}

export async function summarizeDiffs(limit) {
  const statOutput = execSync('git diff --numstat', { stdio: 'pipe' }).toString()
  const files = statOutput
    .trim()
    .split('\n')
    .map(line => {
      const [added, deleted, file] = line.trim().split(/\s+/)
      return { file, added: parseInt(added, 10), deleted: parseInt(deleted, 10) }
    })
    .filter(f =>
      f.file &&
      !shouldIgnoreFile(f.file) &&
      f.added + f.deleted > 2 &&
      f.added + f.deleted < 1000
    )

  let promptBody = ''
  for (const { file } of files) {
    const diff = execSync(`git diff -- ${file}`, { stdio: 'pipe' }).toString()
    if (!diff.trim()) continue

    let chunk = `# File: ${file}\n${diff}\n`
    if (chunk.length > 10000) chunk = chunk.slice(0, 10000) + '\n[...truncated]\n'

    if ((promptBody.length + chunk.length) < MAX_PROMPT_LENGTH) {
      promptBody += chunk
    } else {
      break
    }
  }

  const prompt = `
Summarize the following code diffs into a clear description of what changed.

Focus on meaningful functionality and structural changes. Ignore trivial formatting or version bumps.

${promptBody}

Summary:
`

  const spinner = ora('Summarizing code diffs...').start()

  try {
    const summary = await summarizeWithAI(prompt)
    spinner.succeed('Code diffs summarized.')
    return summary
  } catch (error) {
    spinner.fail('Failed to summarize code diffs.')
    throw error
  }
}

export async function generateCommitMessageFromDiff() {
  const gitDiff = execSync(`git diff`, { stdio: 'pipe' }).toString()
  if (!gitDiff.trim()) throw new Error('No unstaged changes found')

  const prompt = `
You are an AI Git commit assistant.

Given this git diff, generate:

Title: a one-line commit title (max 60 chars)
Description: a 2-3 sentence description

Format:
Title: <title>
Description: <description>

Diff:
${gitDiff}
`.slice(0, MAX_PROMPT_LENGTH)

  const spinner = ora('Generating commit message from diff...').start()

  try {
    const raw = await summarizeWithAI(prompt)

    const titleMatch = raw.match(/title:\s*(.+)/i)
    const descMatch = raw.match(/description:\s*([\s\S]*)/i)

    const title = titleMatch?.[1]?.trim()
    const description = descMatch?.[1]?.trim() || ''
    console.log(raw)
    if (!title) throw new Error('AI did not return title')

    spinner.succeed('Commit message generated.')
    return { title, description }
  } catch (error) {
    spinner.fail('Failed to generate commit message.')
    throw error
  }
}

export async function summarizeFileDiff(path) {
  const gitDiff = execSync(`git diff -- ${path}`, { stdio: 'pipe' }).toString()
  if (!gitDiff.trim()) throw new Error(`No unstaged changes found in "${path}"`)

  const prompt = `
Summarize the following git diff for file: ${path}

Explain what changed clearly and concisely.

${gitDiff}

Summary:
`.slice(0, MAX_PROMPT_LENGTH)

  const spinner = ora(`Summarizing changes in ${path}...`).start()

  try {
    const summary = await summarizeWithAI(prompt)
    spinner.succeed(`Summary for ${path} ready.`)
    return summary
  } catch (error) {
    spinner.fail(`Failed to summarize ${path}.`)
    throw error
  }
}
