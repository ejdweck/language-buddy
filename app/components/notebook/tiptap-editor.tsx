import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import type { TiptapContent } from '~/types/notebook'

interface TiptapEditorProps {
  initialContent?: TiptapContent
  onChange?: (content: TiptapContent) => void
}

export function TiptapEditor({ initialContent, onChange }: TiptapEditorProps) {
  console.log('TiptapEditor render with ID:', initialContent);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'Start writing...' }]
      }]
    },
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      onChange?.(content as TiptapContent);
    },
    immediatelyRender: false,
  });

  // Update content when initialContent changes
  useEffect(() => {
    if (editor && initialContent && !editor.isDestroyed) {
      console.log('Setting editor content for:', initialContent);
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <EditorContent editor={editor} />
    </div>
  );
} 