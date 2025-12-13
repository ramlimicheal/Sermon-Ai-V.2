import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TaggingSystemProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestedTags?: string[];
}

export const TaggingSystem: React.FC<TaggingSystemProps> = ({ 
  tags, 
  onTagsChange,
  suggestedTags = ['Series', 'Holiday', 'Topical', 'Expository', 'Personal', 'Guest']
}) => {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-bible-600 uppercase tracking-wide">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bible-100 text-bible-700 rounded-full text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-bible-900 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 text-sm border border-bible-200 rounded-md bg-white text-bible-900 placeholder:text-bible-400 focus:outline-none focus:ring-1 focus:ring-bible-900"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddTag(newTag)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {showSuggestions && newTag === '' && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-bible-200 rounded-md shadow-lg z-10">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-3 py-2 text-sm text-bible-700 hover:bg-bible-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
