import { load } from 'js-yaml'

export type ParsedMd<T = Record<string, unknown>> = {
  data: T
  body: string
}

/**
 * Escape raw newlines inside double-quoted YAML scalars so js-yaml accepts
 * older campaign files that stored multiline lore as literal line breaks.
 */
function escapeQuotedNewlines(yaml: string): string {
  let result = ''
  let i = 0
  while (i < yaml.length) {
    const q = yaml.indexOf(': "', i)
    if (q === -1) {
      result += yaml.slice(i)
      break
    }
    result += yaml.slice(i, q + 3)
    i = q + 3
    let buf = ''
    while (i < yaml.length) {
      const c = yaml[i]
      if (c === '\\') {
        buf += c + (yaml[i + 1] ?? '')
        i += 2
        continue
      }
      if (c === '"') {
        result += buf.replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"'
        i += 1
        break
      }
      buf += c
      i += 1
    }
  }
  return result
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
  const raw = escapeQuotedNewlines(text.slice(3, end).trim())
  const body = text.slice(end + 4).replace(/^\n/, '')
  const data = (load(raw) ?? {}) as T
  return { data, body }
}
