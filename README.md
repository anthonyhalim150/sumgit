# Sumgit 🧠📦

[![npm version](https://img.shields.io/npm/v/sumgit.svg)](https://www.npmjs.com/package/sumgit)
[![npm downloads](https://img.shields.io/npm/dm/sumgit.svg)](https://www.npmjs.com/package/sumgit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/anthonyhalim150/sumgit/pulls)

**Sumgit** is a powerful CLI tool that uses AI to summarize Git commit messages and diffs, generate new commit messages, and help automate new commits — ideal for cleaner PRs and smarter commit hygiene.

---

## ✨ Features

- 🔍 Summarize commit messages  
  - **Command:** `sumgit` or `sumgit 5`
- 🧠 Summarize actual code diffs  
  - **Command:** `sumgit --diff` or `sumgit --diff 3`
- 📝 Generate commit messages based on current diff  
  - **Command:** `sumgit --gen`
- ✅ Auto-stage and commit with AI-generated message  
  - **Command:** `sumgit --gen --commit`
- 🔎 Preview commit without writing it (dry run)  
  - **Command:** `sumgit --gen --commit --dry-run`
- 📂 Summarize the diff of a specific file  
  - **Command:** `sumgit --file path/to/file.js`
- 🌐 Fully configurable prompt system handled on the client  
  - **Prompts are constructed in CLI and sent directly to backend**

---

## 🚀 Installation

```bash
npm install -g sumgit
```

---

## 🧪 Usage

```bash
sumgit [options] [number_of_commits]
```

### 🔄 Examples

| Command                          | Description                                      |
|----------------------------------|--------------------------------------------------|
| `sumgit`                         | Summarize the last 10 commit messages            |
| `sumgit 5`                       | Summarize the last 5 commit messages             |
| `sumgit --diff`                 | Summarize last 10 commits by code diffs         |
| `sumgit --diff 3`               | Summarize last 3 commits by diffs               |
| `sumgit --gen`                  | Generate a commit message from current `git diff` |
| `sumgit --gen --commit`         | Generate and commit with AI-generated message   |
| `sumgit --gen --commit --dry-run` | Preview the AI commit before executing         |
| `sumgit --file index.js`        | Summarize changes in `index.js`                 |

---

## 📌 Options

- `--diff` – Summarize code diffs instead of commit messages  
- `--gen` – Generate a commit message from current unstaged `git diff`  
- `--commit` – Stage and commit with the generated commit message (requires `--gen`)  
- `--dry-run` – Preview the generated commit message and git commands without committing  
- `--file <path>` – Summarize the unstaged diff of a specific file  
- `-h`, `--help` – Show usage

---

## 🛠️ Requirements

- Node.js 16+
- A Git repository with commits

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Feel free to fork the repo and submit a PR.

---

## 📄 License

MIT © [anthonyhalim150](https://github.com/anthonyhalim150)
