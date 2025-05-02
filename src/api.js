import fetch from 'node-fetch'

const API_URL = 'https://sumgit-backend-git-main-anthony-halims-projects.vercel.app/api/summarize'

export async function summarizeWithAI(prompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  })

  if (!response.ok) throw new Error(`Backend error: ${response.status}`)

  const data = await response.json()
  if (data.summary) return data.summary

  throw new Error('No summary returned')
}