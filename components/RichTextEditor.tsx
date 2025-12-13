import React, { useState, useEffect } from 'react';
import { Save, Check, Bold, Italic, List, ListOrdered, Heading2, Heading3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RichTextEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const applyFormatting = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    if (!selected) return;

    let formatted = '';
    switch (format) {
      case 'bold':
        formatted = `**${selected}**`;
        break;
      case 'italic':
        formatted = `*${selected}*`;
        break;
      case 'h2':
        formatted = `## ${selected}`;
        break;
      case 'h3':
        formatted = `### ${selected}`;
        break;
      case 'ul':
        formatted = `• ${selected}`;
        break;
      case 'ol':
        formatted = `1. ${selected}`;
        break;
    }

    const newContent = content.substring(0, start) + formatted + content.substring(end);
    setContent(newContent);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-bible-200 flex items-center gap-2 shrink-0 bg-bible-50">
        <button
          onClick={() => applyFormatting('bold')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4 text-bible-600" />
        </button>
        <button
          onClick={() => applyFormatting('italic')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4 text-bible-600" />
        </button>
        <div className="w-px h-4 bg-bible-200" />
        <button
          onClick={() => applyFormatting('h2')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4 text-bible-600" />
        </button>
        <button
          onClick={() => applyFormatting('h3')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4 text-bible-600" />
        </button>
        <div className="w-px h-4 bg-bible-200" />
        <button
          onClick={() => applyFormatting('ul')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4 text-bible-600" />
        </button>
        <button
          onClick={() => applyFormatting('ol')}
          className="p-2 hover:bg-bible-100 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4 text-bible-600" />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full resize-none border border-bible-200 rounded-md bg-white text-bible-900 text-sm placeholder:text-bible-400 focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900 p-3 leading-relaxed font-mono"
          placeholder="Write your sermon notes here... Use **bold**, *italic*, ## headings, • bullets, 1. numbers"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-bible-100 flex items-center justify-between shrink-0">
        <span className="text-xs text-bible-400">{content.length} characters</span>
        <Button 
          size="sm" 
          variant={isSaved ? "secondary" : "primary"}
          onClick={handleSave}
        >
          {isSaved ? <Check className="h-3.5 w-3.5 mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
};
