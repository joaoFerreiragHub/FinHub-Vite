import { useRef, useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { renderCommunityMarkdown } from '../utils/markdown'

type MarkdownEditorMode = 'edit' | 'preview'

interface MarkdownEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
  rows?: number
  placeholder?: string
}

const DEFAULT_LINK_URL = 'https://exemplo.com'

export function MarkdownEditor({
  id,
  value,
  onChange,
  maxLength = 10000,
  rows = 8,
  placeholder = 'Escreve o teu conteudo em markdown.',
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [mode, setMode] = useState<MarkdownEditorMode>('edit')

  const updateValue = (nextValue: string, selectionStart?: number, selectionEnd?: number) => {
    onChange(nextValue)
    if (selectionStart === undefined || selectionEnd === undefined) return

    requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  const wrapSelection = (prefix: string, suffix: string, placeholderText: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      onChange(`${value}${prefix}${placeholderText}${suffix}`)
      return
    }

    const start = textarea.selectionStart ?? value.length
    const end = textarea.selectionEnd ?? value.length
    const selectedText = value.slice(start, end)
    const innerText = selectedText || placeholderText
    const replacement = `${prefix}${innerText}${suffix}`
    const nextValue = value.slice(0, start) + replacement + value.slice(end)
    const nextSelectionStart = start + prefix.length
    const nextSelectionEnd = nextSelectionStart + innerText.length

    updateValue(nextValue, nextSelectionStart, nextSelectionEnd)
  }

  const insertLink = () => {
    const textarea = textareaRef.current
    if (!textarea) {
      onChange(`${value}[texto](${DEFAULT_LINK_URL})`)
      return
    }

    const start = textarea.selectionStart ?? value.length
    const end = textarea.selectionEnd ?? value.length
    const selectedText = value.slice(start, end) || 'texto'
    const replacement = `[${selectedText}](${DEFAULT_LINK_URL})`
    const nextValue = value.slice(0, start) + replacement + value.slice(end)
    const urlStart = start + selectedText.length + 3
    const urlEnd = urlStart + DEFAULT_LINK_URL.length

    updateValue(nextValue, urlStart, urlEnd)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => wrapSelection('**', '**', 'texto')}
            title="Negrito"
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => wrapSelection('*', '*', 'texto')}
            title="Italico"
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => wrapSelection('`', '`', 'codigo')}
            title="Codigo inline"
          >
            {'</>'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={insertLink} title="Link">
            Link
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === 'edit' ? 'default' : 'outline'}
            onClick={() => setMode('edit')}
          >
            Editar
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === 'preview' ? 'default' : 'outline'}
            onClick={() => setMode('preview')}
          >
            Preview
          </Button>
        </div>
      </div>

      {mode === 'edit' ? (
        <Textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          rows={rows}
          placeholder={placeholder}
          className="bg-background text-foreground border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring"
        />
      ) : (
        <div className="min-h-[200px] rounded-md border border-input bg-background px-3 py-2">
          {value.trim() ? (
            <div
              className="prose prose-neutral max-w-none text-foreground dark:prose-invert prose-headings:mb-3 prose-p:my-2 prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-3"
              dangerouslySetInnerHTML={{ __html: renderCommunityMarkdown(value) }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              O preview aparece aqui assim que comecares a escrever.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
