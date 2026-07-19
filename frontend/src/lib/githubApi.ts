const REPO = import.meta.env.VITE_GITHUB_REPO || 'rasta-mmn/family-quest-rpg'
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main'
const TOKEN_KEY = 'fq-github-token'

/** Path relative to docs/ (e.g. config/game-config.md). */
export function docsUrl(docPath: string): string {
  const clean = docPath.replace(/^\/+/, '').replace(/^docs\//, '')
  if (import.meta.env.DEV) {
    return `/docs/${clean}`
  }
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/docs/${clean}`
}

/** Asset path as stored in YAML (docs/assets/...), or data:/blob: from UI upload. */
export function assetUrl(assetPath: string): string {
  if (!assetPath) return ''
  if (
    assetPath.startsWith('http') ||
    assetPath.startsWith('data:') ||
    assetPath.startsWith('blob:')
  ) {
    return assetPath
  }
  const clean = assetPath.replace(/^\/+/, '').replace(/^docs\//, '')
  if (import.meta.env.DEV) {
    return `/docs/${clean}`
  }
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/docs/${clean}`
}

export async function fetchDoc(docPath: string): Promise<string> {
  const url = docsUrl(docPath)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to read ${docPath}: ${res.status}`)
  }
  return res.text()
}

/** ADM: download generated month markdown for manual commit. */
export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function githubRepoLabel(): string {
  return `${REPO}@${BRANCH}`
}

export function getGithubToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setGithubToken(token: string): void {
  const t = token.trim()
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

function repoPath(docPath: string): string {
  const clean = docPath.replace(/^\/+/, '').replace(/^docs\//, '')
  return `docs/${clean}`
}

async function getFileSha(path: string, token: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (res.status === 404) return undefined
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub GET ${path}: ${res.status} ${body}`)
  }
  const data = (await res.json()) as { sha?: string }
  return data.sha
}

/** Write/update a text file under docs/ via Contents API. Token in localStorage. */
export async function putDoc(
  docPath: string,
  content: string,
  message: string,
): Promise<void> {
  const token = getGithubToken()
  if (!token) throw new Error('GitHub token missing — set it in Admin')
  const path = repoPath(docPath)
  const sha = await getFileSha(path, token)
  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
  }
  if (sha) body.sha = sha
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub PUT ${path}: ${res.status} ${err}`)
  }
}

/** Write binary (e.g. JPEG) from data URL or raw base64. */
export async function putBinaryFromDataUrl(
  docPath: string,
  dataUrl: string,
  message: string,
): Promise<void> {
  const token = getGithubToken()
  if (!token) throw new Error('GitHub token missing — set it in Admin')
  const path = repoPath(docPath)
  const sha = await getFileSha(path, token)
  const b64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
  const body: Record<string, string> = {
    message,
    content: b64,
    branch: BRANCH,
  }
  if (sha) body.sha = sha
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub PUT ${path}: ${res.status} ${err}`)
  }
}

export function hasGithubToken(): boolean {
  return !!getGithubToken()
}
