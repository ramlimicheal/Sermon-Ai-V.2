import React, { useState } from 'react';
import { findIllustrations } from '@/services/geminiService';
import { Illustration, GenerationState, Language } from '@/types';
import { Lightbulb, Search, Book, Microscope, Hourglass, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      case 'Historical': return <Hourglass className="h-3 w-3" />;
      case 'Scientific': return <Microscope className="h-3 w-3" />;
      case 'Literature': return <Book className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-bible-100 shrink-0">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter a theme..."
            className="flex-1 min-w-0 rounded-md border border-bible-200 px-3 py-2 text-sm placeholder:text-bible-400 focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900"
          />
          <Button type="submit" disabled={!theme.trim() || state.loading} size="sm">
            {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading && (
          <div className="flex flex-col items-center justify-center py-12 text-bible-400">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span className="text-xs">Finding illustrations...</span>
          </div>
        )}
        
        {state.error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={() => handleSearch()}>Retry</Button>
          </div>
        )}

        {state.data && (
          <div className="space-y-3">
            {state.data.map((item, idx) => (
              <div key={idx} className="rounded-md border border-bible-200 bg-white p-3 hover:border-bible-300 transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-bible-500">{getIcon(item.sourceType)}</span>
                  <span className="text-[10px] font-medium uppercase text-bible-400">{item.sourceType}</span>
                </div>
                <h4 className="text-sm font-medium text-bible-900 mb-1">{item.title}</h4>
                <p className="text-xs text-bible-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        )}

        {!state.loading && !state.data && !state.error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-8 w-8 text-bible-300 mb-2" />
            <p className="text-sm text-bible-500">Search for illustrations</p>
          </div>
        )}
      </div>
    </div>
  );
};