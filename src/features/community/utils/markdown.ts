import DOMPurify from 'dompurify'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const sanitizeHref = (value: string): string => {
  const url = value.trim()
  if (!url) return '#'
  if (url.startsWith('/')) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return '#'
}

const renderInlineMarkdown = (value: string): string => {
  let output = escapeHtml(value)

  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const safeHref = sanitizeHref(href)
    return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
  })

  output = output.replace(/`([^`]+)`/g, '<code>$1</code>')
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return output
}

const renderBlock = (block: string): string => {
  const lines = block
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .filter((line) => line.length > 0)

  if (lines.length === 0) return ''

  if (lines.length === 1) {
    const heading = lines[0].match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      return `<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`
    }
  }

  if (lines.every((line) => /^>\s?/.test(line))) {
    const content = lines
      .map((line) => line.replace(/^>\s?/, ''))
      .map(renderInlineMarkdown)
      .join('<br />')
    return `<blockquote>${content}</blockquote>`
  }

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    const items = lines
      .map((line) => line.replace(/^[-*]\s+/, ''))
      .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
      .join('')
    return `<ul>${items}</ul>`
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line))) {
    const items = lines
      .map((line) => line.replace(/^\d+\.\s+/, ''))
      .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
      .join('')
    return `<ol>${items}</ol>`
  }

  return `<p>${lines.map(renderInlineMarkdown).join('<br />')}</p>`
}

export const renderCommunityMarkdown = (markdown: string): string => {
  const raw = markdown || ''
  const codeBlocks: string[] = []

  const withCodePlaceholders = raw.replace(/```([\s\S]*?)```/g, (_match, code: string) => {
    const token = `@@CODE_BLOCK_${codeBlocks.length}@@`
    codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`)
    return token
  })

  const rendered = withCodePlaceholders
    .split(/\n{2,}/g)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) => {
      const codeMatch = block.match(/^@@CODE_BLOCK_(\d+)@@$/)
      if (!codeMatch) return renderBlock(block)
      const index = Number.parseInt(codeMatch[1], 10)
      return Number.isFinite(index) ? codeBlocks[index] || '' : ''
    })
    .join('\n')

  return DOMPurify.sanitize(rendered)
}
