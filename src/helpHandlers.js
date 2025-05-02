export function showHelpAndExit() {
  console.log(`
  Usage: sumgit [options] [number_of_commits]

  Options:
    --diff              Summarize actual git code diffs instead of commit messages
    --gen               Generate a commit message from the current unstaged git diff
    --commit            Stage and commit with the generated commit message (used with --gen)
    --dry-run           Show the generated commit message and git commands without executing them
    --file <path>       Summarize the unstaged diff of a specific file
    -h, --help          Show this help message

  Examples:
    sumgit 10                         Summarize the last 10 commit messages
    sumgit --diff 5                   Summarize the last 5 commits by their code changes
    sumgit --gen                      Generate a commit message from the current git diff
    sumgit --gen --commit             Auto-commit with generated message
    sumgit --gen --commit --dry-run   Preview the generated commit message and git commands
    sumgit --file src/index.js        Summarize changes in a specific file
  `)
  process.exit(0)
}
