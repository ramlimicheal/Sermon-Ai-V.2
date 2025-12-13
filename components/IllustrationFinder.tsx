import React, { useState } from 'react';
import { findIllustrations } from '../services/geminiService';
import { Illustration, GenerationState, Language } from '../types';
import { Card } from './ui/Card';
import { Lightbulb, Search, Book, Microscope, Hourglass } from 'lucide-react';
import { Button } from './ui/Button';

interface IllustrationFinderProps {
    language: Language;
}

export const IllustrationFinder: React.FC<IllustrationFinderProps> = ({ language }) => {
  const [theme, setTheme] = useState('');
  const [state, setState] = useState<GenerationState<Illustration[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const results = await findIllustrations(theme, language);
      setState({ data: results, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: "Failed to find illustrations." });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Historical': return <Hourglass className="h-3.5 w-3.5" />;
      case 'Scientific': return <Microscope className="h-3.5 w-3.5" />;
      case 'Literature': return <Book className="h-3.5 w-3.5" />;
      default: return <Lightbulb className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Card 
      title="Illustrations" 
      icon={<Lightbulb className="h-5 w-5" />}
      className="h-full border-t-4 border-t-yellow-600"
      scrollable={true}
    >
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 sticky top-0 bg-white z-10 pb-2">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder={language === 'Tamil' ? "கருத்து..." : "Theme (e.g., Redemption)..."}
          className="flex-1 min-w-0 rounded-md border border-bible-300 px-3 py-2 text-sm placeholder:text-bible-300 focus:border-bible-500 focus:outline-none focus:ring-1 focus:ring-bible-500"
        />
        <Button type="submit" disabled={!theme.trim() || state.loading} className="px-3">
          {state.loading ? <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"/> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      <div className="space-y-3">
        {state.loading && (
             <div className="space-y-4 pt-1">
             {[1, 2, 3].map(i => (
                 <div key={i} className="rounded-lg border border-bible-100 bg-white p-4 shadow-sm animate-pulse">
                     <div className="flex items-center gap-2 mb-3">
                         <div className="h-6 w-6 rounded-full bg-bible-200/70"></div>
                         <div className="h-3 w-20 bg-bible-100 rounded"></div>
                     </div>
                     <div className="h-5 w-3/4 bg-bible-200/70 rounded mb-3"></div>
                     <div className="space-y-2">
                         <div className="h-3 bg-bible-100/50 rounded w-full"></div>
                         <div className="h-3 bg-bible-100/50 rounded w-5/6"></div>
                         <div className="h-3 bg-bible-100/50 rounded w-4/6"></div>
                     </div>
                 </div>
             ))}
           </div>
        )}
        
        {state.error && (
           <div className="text-red-500 p-3 bg-red-50 rounded-md text-sm">{state.error}</div>
        )}

        {state.data && state.data.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-bible-200 bg-bible-50/50 p-3 transition-all hover:bg-white hover:shadow-md hover:border-bible-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white border border-bible-200 text-bible-600 shadow-sm">
                {getIcon(item.sourceType)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-bible-400">
                {item.sourceType}
              </span>
            </div>
            <h4 className="font-serif text-sm font-bold text-bible-900 mb-1 leading-snug">{item.title}</h4>
            <p className="text-xs text-bible-700 leading-relaxed line-clamp-4 hover:line-clamp-none">{item.content}</p>
          </div>
        ))}

        {!state.loading && !state.data && !state.error && (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                <Search className="h-8 w-8 text-bible-300 mb-2" />
                <div className="text-bible-500 text-xs italic max-w-[200px]">
                    {language === 'Tamil' ? "வரலாறு மற்றும் அறிவியலிலிருந்து கதைகளைக் கண்டறிய மேலே ஒரு கருத்தை உள்ளிடவும்." : "Enter a theme above to discover stories from history and science."}
                </div>
            </div>
        )}
      </div>
    </Card>
  );
};