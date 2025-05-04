import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const addImage = () => {
    const url = window.prompt('Cola aqui a URL da imagem:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="space-y-2">
      {/* Toolbar simples */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded italic">I</button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded underline">U</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• Lista</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. Lista</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="px-2 py-1 border rounded">❝ Citação</button>
        <button onClick={addImage} className="px-2 py-1 border rounded">🖼 Imagem</button>
      </div>

      {/* Editor */}
      <div className="border rounded-md min-h-[200px] bg-white dark:bg-zinc-900 p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
