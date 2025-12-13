import React, { useEffect, useState } from 'react';
import { generateEngagementContent } from '@/services/geminiService';
import { EngagementItem, GenerationState, Language } from '@/types';
import { Sparkles, MessageCircle, Quote, Smile, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EngagementGeneratorProps {
  scripture: string;
  language: Language;
}

export const EngagementGenerator: React.FC<EngagementGeneratorProps> = ({ scripture, language }) => {
  const [state, setState] = useState<GenerationState<EngagementItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await generateEngagementContent(scripture, language);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: "Failed to generate engagement content." });
    }
  };

  useEffect(() => {
    fetchData();
  }, [scripture, language]);

  const getIcon = (category: string) => {
    switch(category) {
      case 'Ice Breaker': return <Sparkles className="h-3 w-3" />;
      case 'Humor': return <Smile className="h-3 w-3" />;
      case 'Quote': return <Quote className="h-3 w-3" />;
      default: return <MessageCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Engagement Tools</span>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={state.loading} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${state.loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-bible-400">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span className="text-xs">Generating content...</span>
          </div>
        ) : state.error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {state.data?.map((item, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white hover:border-bible-300 transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5 text-bible-500">
                  {getIcon(item.category)}
                  <span className="text-[10px] font-medium uppercase">{item.category}</span>
                </div>
                <p className="text-sm text-bible-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};