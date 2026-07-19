const REPO = import.meta.env.VITE_GITHUB_REPO || 'rasta-mmn/family-quest-rpg'
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main'

/** Path relative to docs/ (e.g. config/game-config.md). */
export function docsUrl(docPath: string): string {
  const clean = docPath.replace(/^\/+/, '').replace(/^docs\//, '')
  if (import.meta.env.DEV) {
    return `/docs/${clean}`
  }
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/docs/${clean}`
}

/** Asset path as stored in YAML (docs/assets/...). */
export function assetUrl(assetPath: string): string {
  if (!assetPath) return ''
  if (assetPath.startsWith('http')) return assetPath
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
