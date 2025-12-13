
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { PenTool, Save, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface SermonEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
}

export const SermonEditor: React.FC<SermonEditorProps> = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false);

  // Sync if initialContent changes (e.g. loading a different sermon)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card 
      title="My Sermon Notes" 
      icon={<PenTool className="h-5 w-5" />}
      className="h-full border-t-4 border-t-bible-800 flex flex-col"
      scrollable={false} // We handle scrolling in textarea
      action={
        <Button 
            size="sm" 
            variant={isSaved ? "secondary" : "primary"}
            onClick={handleSave}
            className="h-8 shadow-sm"
        >
            {isSaved ? <Check className="h-3.5 w-3.5 mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            {isSaved ? "Saved" : "Save Notes"}
        </Button>
      }
    >
      <div className="flex-1 flex flex-col h-full">
        <textarea
            className="flex-1 w-full h-full p-4 resize-none border border-bible-200 rounded-lg bg-bible-50/30 text-bible-900 placeholder:text-bible-300 focus:outline-none focus:ring-2 focus:ring-bible-200 focus:bg-white focus:border-transparent transition-all font-serif text-base leading-relaxed"
            placeholder="Write your sermon notes here... Copy and paste insights from the left panels to build your message log."
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-2 text-xs text-bible-400 flex justify-between px-1">
            <span>{content.length} characters</span>
            <span>Last saved locally</span>
        </div>
      </div>
    </Card>
  );
};
