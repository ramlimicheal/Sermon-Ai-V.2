import React, { useState } from 'react';
import { callMegaLLM } from '@/services/megaLLMService';
import { getDemoIllustrations } from '@/services/demoService';
import { Illustration, GenerationState, Language } from '@/types';
import { Lightbulb, Search, Book, Microscope, Hourglass, Loader2, Sparkles, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IllustrationsSkeleton } from '@/components/ui/Skeleton';

interface IllustrationFinderProps {
    language: Language;
}

interface IllustrationState {
  data: Illustration[] | null;
  isDemo: boolean;
  loading: boolean;
  error: string | null;
}

export const IllustrationFinder: React.FC<IllustrationFinderProps> = ({ language }) => {
  const [theme, setTheme] = useState('');
  const [state, setState] = useState<IllustrationState>({
    data: null,
    isDemo: false,
    loading: false,
    error: null,
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) return;

    setState({ data: null, isDemo: false, loading: true, error: null });
    try {
      const prompt = `Find 3 distinct, powerful sermon illustrations for the theme: "${theme}".
${language === 'Tamil' ? 'Output ALL content in Tamil language.' : 'Output in English.'}

Return a JSON array with exactly 3 objects, each having:
- title: A compelling title for the illustration
- sourceType: One of "Historical", "Scientific", "Literature", or "Modern"
- content: The full illustration story (2-3 paragraphs)

Return ONLY the JSON array, no other text.`;

      const response = await callMegaLLM([
        { role: 'system', content: 'You are a helpful assistant that finds sermon illustrations. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ], { response_format: { type: 'json_object' } });
      
      // Parse the JSON response
      let results: Illustration[];
      try {
        const parsed = JSON.parse(response);
        results = Array.isArray(parsed) ? parsed : parsed.illustrations || [];
      } catch {
        // If JSON parsing fails, try to extract array from response
        const match = response.match(/\[[\s\S]*\]/);
        results = match ? JSON.parse(match[0]) : [];
      }
      
      setState({ data: results, isDemo: false, loading: false, error: null });
    } catch (err) {
      // Fall back to demo mode with beautiful mock content
      try {
        const demoResults = await getDemoIllustrations(theme);
        // Map demo results to match Illustration type
        const mappedResults: Illustration[] = demoResults.map(item => ({
          title: item.title,
          sourceType: item.sourceType,
          content: item.content,
        }));
        setState({ data: mappedResults, isDemo: true, loading: false, error: null });
      } catch (demoErr) {
        setState({ data: null, isDemo: false, loading: false, error: "Failed to find illustrations." });
      }
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

      {/* Demo mode banner */}
      {state.isDemo && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <span className="text-xs text-amber-700">
            Viewing demo illustrations. <button className="underline font-medium hover:text-amber-900">Connect AI</button> to unlock live results.
          </span>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading && <IllustrationsSkeleton />}
        
        {state.error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={() => handleSearch()}>Retry</Button>
          </div>
        )}

        {state.data && (
          <div className="space-y-3">
            {state.isDemo && (
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Demo Results</span>
              </div>
            )}
            {state.data.map((item, idx) => (
              <div key={idx} className="group rounded-md border border-bible-200 bg-white p-3 hover:border-bible-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-bible-500">{getIcon(item.sourceType)}</span>
                    <span className="text-[10px] font-medium uppercase text-bible-400">{item.sourceType}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {/* TODO: Insert into sermon */}}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Insert
                  </Button>
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
            <p className="text-xs text-bible-400 mt-1">Try "faith", "hope", or "love"</p>
          </div>
        )}
      </div>
    </div>
  );
};
