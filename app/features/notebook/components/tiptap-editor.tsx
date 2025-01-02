import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    },
    immediatelyRender: false
  })

  return (
    <div className="min-h-[300px] w-full max-w-4xl mx-auto p-4">
      <EditorContent editor={editor} className="min-h-[300px] w-full border rounded-lg p-4" />
    </div>
  )
} 