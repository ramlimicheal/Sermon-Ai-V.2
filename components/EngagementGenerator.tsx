import React, { useEffect, useState } from 'react';
import { generateEngagementContent } from '../services/geminiService';
import { EngagementItem, GenerationState, Language } from '../types';
import { Card } from './ui/Card';
import { Sparkles, MessageCircle, Quote, Smile } from 'lucide-react';

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

  useEffect(() => {
    const fetchData = async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const result = await generateEngagementContent(scripture, language);
            setState({ data: result, loading: false, error: null });
        } catch (err) {
            setState({ data: null, loading: false, error: "Failed to generate engagement content." });
        }
    };
    fetchData();
  }, [scripture, language]);

  const getIcon = (category: string) => {
      switch(category) {
          case 'Ice Breaker': return <Sparkles className="h-4 w-4" />;
          case 'Humor': return <Smile className="h-4 w-4" />;
          case 'Quote': return <Quote className="h-4 w-4" />;
          default: return <MessageCircle className="h-4 w-4" />;
      }
  }

  return (
    <Card 
      title="Engagement Tools" 
      icon={<Smile className="h-5 w-5" />}
      className="h-full border-t-4 border-t-orange-500"
      scrollable={true}
    >
        {state.loading ? (
             <div className="space-y-4 animate-pulse pt-1">
             {[1, 2, 3, 4].map(i => (
                 <div key={i} className="rounded-lg bg-white border border-bible-100 p-4">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 rounded-full bg-bible-200"></div>
                        <div className="h-3 w-20 bg-bible-200 rounded"></div>
                     </div>
                     <div className="h-3 w-full bg-bible-100 rounded mb-1"></div>
                     <div className="h-3 w-5/6 bg-bible-100 rounded"></div>
                 </div>
             ))}
           </div>
        ) : state.error ? (
            <div className="text-red-500 p-3 bg-red-50 rounded-md text-sm">{state.error}</div>
        ) : (
            <div className="space-y-4">
                {state.data?.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-bible-50 to-white p-4 rounded-xl border border-bible-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-bible-600">
                             <span className="p-1 rounded-full bg-bible-100">{getIcon(item.category)}</span>
                             <span className="text-xs font-bold uppercase tracking-wider">{item.category}</span>
                        </div>
                        <p className="text-sm text-bible-800 leading-relaxed font-medium">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        )}
    </Card>
  );
};