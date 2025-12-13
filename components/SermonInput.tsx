import React, { useState } from 'react';
import { BookOpen, ArrowRight, Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Language } from '@/types';

interface SermonInputProps {
  onSubmit: (scripture: string, language: Language) => void;
}

export const SermonInput: React.FC<SermonInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState<Language>('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value, language);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 bg-bible-50">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center animate-fade-in">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-bible-900 flex items-center justify-center mb-6">
          <BookOpen className="h-6 w-6 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-bible-900 mb-2">
          New Sermon
        </h1>
        <p className="text-sm text-bible-500 mb-8 max-w-sm">
          Enter a scripture passage to begin your research with AI-powered commentary, illustrations, and outlines.
        </p>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <input
              type="text"
              className="w-full h-11 rounded-lg border border-bible-200 bg-white px-4 text-sm text-bible-900 placeholder:text-bible-400 focus:outline-none focus:ring-2 focus:ring-bible-900 focus:border-transparent"
              placeholder="Enter a passage (e.g., Psalm 23)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bible-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full h-11 appearance-none rounded-lg border border-bible-200 bg-white pl-10 pr-4 text-sm text-bible-700 focus:outline-none focus:ring-2 focus:ring-bible-900 focus:border-transparent cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="h-11 px-6" 
              disabled={!value.trim()}
            >
              Start
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
        
        {/* Features */}
        <div className="flex items-center gap-4 mt-8 text-xs text-bible-500">
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-bible-400" />
            Commentary
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-bible-400" />
            Illustrations
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-bible-400" />
            Outlines
          </span>
        </div>
      </div>
    </div>
  );
};