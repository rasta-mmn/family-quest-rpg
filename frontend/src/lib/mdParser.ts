import { load } from 'js-yaml'

export type ParsedMd<T = Record<string, unknown>> = {
  data: T
  body: string
}

/** Parse Markdown file with YAML frontmatter between --- fences. */
export function parseMarkdown<T = Record<string, unknown>>(text: string): ParsedMd<T> {
  if (!text.startsWith('---')) {
    return { data: {} as T, body: text }
  }
  const end = text.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {} as T, body: text }
  }
  const raw = text.slice(3, end).trim()
  const body = text.slice(end + 4).replace(/^\n/, '')
  const data = (load(raw) ?? {}) as T
  return { data, body }
}
