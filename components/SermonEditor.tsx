
import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SermonEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
}

export const SermonEditor: React.FC<SermonEditorProps> = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full resize-none border border-bible-200 rounded-md bg-white text-bible-900 text-sm placeholder:text-bible-400 focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900 p-3 leading-relaxed"
          placeholder="Write your sermon notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
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
