# Changelog

## v1.0.4 – Better commit

### 🧹 Improvements
- Increased prompt limit to handle large diffs (up to 100k chars)
- Filters out noisy files like `package-lock.json`, lockfiles, and build logs
- Truncates overly large diffs per file to avoid context overflow
- Graceful fallback if AI only returns title

## v1.0.3 - Added AI Commit Title + Description Support

### ✨ New Features
- `--gen --commit` now generates:
  - A one-line **commit title**
  - A multi-line **commit description**
- Auto-commits with full message: `"title\n\ndescription"`

### 🛠️ Internal Changes
- Updated `summarize.js` to use structured prompt
- Backend now returns `{ title, description }` instead of a single summary
- CLI parses and commits using structured message

### ✅ Example
```bash
sumgit --gen --commit
```

## v1.0.0 - Initial Release

### ✨ Features
- Summarize the last N commit messages using AI
- Summarize recent code diffs via `--diff`
- Generate commit messages with `--gen`
- Auto-commit with `--gen --commit`
- Summarize diffs of individual files with `--file <path>`
