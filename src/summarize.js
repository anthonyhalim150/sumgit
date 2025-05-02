import { execSync } from 'child_process'
import { summarizeWithAI } from './api.js'
import ora from 'ora'

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
`.slice(0, 4000)

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
  const gitDiff = execSync(`git log -p -n ${limit} --pretty=format:"commit %h %s"`, { stdio: 'pipe' }).toString()
  if (!gitDiff.trim()) throw new Error('No diffs found')

  const prompt = `
Summarize the following code diffs into a clear description of what changed:

${gitDiff}

Summary:
`.slice(0, 4000)

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
`.slice(0, 4000)

  const spinner = ora('Generating commit message from diff...').start()

  try {
    const raw = await summarizeWithAI(prompt)

    const titleMatch = raw.match(/title:\s*(.+)/i)
    const descMatch = raw.match(/description:\s*([\s\S]*)/i)

    const title = titleMatch?.[1]?.trim()
    const description = descMatch?.[1]?.trim()

    if (!title || !description) throw new Error('AI did not return title/description')

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

Explain what changed clearly and concise.

${gitDiff}

Summary:
`.slice(0, 4000)

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
