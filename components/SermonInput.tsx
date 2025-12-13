import React, { useState } from 'react';
import { BookOpen, ArrowRight, Languages, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Language } from '../types';

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
    <div className="flex min-h-full flex-col items-center justify-center px-4 relative overflow-hidden bg-bible-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-bible-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center space-y-10 text-center relative z-10 animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-bible-200 shadow-sm text-xs font-semibold text-bible-600 mb-2">
             <Sparkles className="h-3 w-3 text-orange-400" /> AI Research Assistant
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-bible-900 sm:text-6xl leading-tight">
            Research Sermons<br/><span className="text-bible-500">in Seconds.</span>
          </h1>
          <p className="text-bible-500 md:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Synthesize commentaries, find illustrations, and build outlines—all in one beautiful workspace.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-bible-200/50 border border-bible-100 flex flex-col sm:flex-row gap-2">
             <div className="flex-1 relative">
                <input
                type="text"
                className="w-full h-14 rounded-xl border-none bg-transparent px-4 text-lg text-bible-900 placeholder:text-bible-300 focus:ring-0"
                placeholder="Enter a passage (e.g., Psalm 23)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                />
             </div>
             
             <div className="h-px sm:h-auto sm:w-px bg-bible-100 mx-2"></div>

             <div className="relative sm:w-32 shrink-0">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-bible-400">
                    <Languages className="h-4 w-4" />
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="h-14 w-full appearance-none rounded-xl border-none bg-transparent pl-8 pr-8 text-sm font-medium text-bible-700 focus:ring-0 cursor-pointer hover:bg-bible-50 transition-colors"
                >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                </select>
             </div>
             
             <Button 
                type="submit" 
                className="h-14 px-8 rounded-xl text-base font-semibold shadow-none bg-bible-900 hover:bg-bible-800 transition-all shrink-0" 
                disabled={!value.trim()}
             >
                Start <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
          </div>
        </form>
        
        <div className="flex flex-wrap justify-center gap-3 w-full pt-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-bible-100 text-xs font-medium text-bible-600">
                <BookOpen className="h-3.5 w-3.5" /> Theology
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-bible-100 text-xs font-medium text-bible-600">
                <Sparkles className="h-3.5 w-3.5" /> Illustrations
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-bible-100 text-xs font-medium text-bible-600">
                <ArrowRight className="h-3.5 w-3.5" /> Outlines
             </div>
        </div>
      </div>
    </div>
  );
};