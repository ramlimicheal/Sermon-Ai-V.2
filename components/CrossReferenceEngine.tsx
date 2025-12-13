import React, { useEffect, useState } from 'react';
import { getCrossReferences } from '../services/geminiService';
import { CrossReference, GenerationState, Language } from '../types';
import { Card } from './ui/Card';
import { Link2 } from 'lucide-react';

interface CrossReferenceEngineProps {
  scripture: string;
  language: Language;
}

export const CrossReferenceEngine: React.FC<CrossReferenceEngineProps> = ({ scripture, language }) => {
  const [state, setState] = useState<GenerationState<CrossReference[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const result = await getCrossReferences(scripture, language);
            setState({ data: result, loading: false, error: null });
        } catch (err) {
            setState({ data: null, loading: false, error: "Failed to find cross references." });
        }
    };
    fetchData();
  }, [scripture, language]);

  return (
    <Card 
      title="Cross References" 
      icon={<Link2 className="h-5 w-5" />}
      className="h-full border-t-4 border-t-bible-400"
      scrollable={true}
    >
        {state.loading ? (
             <div className="space-y-3 animate-pulse pt-1">
             {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex flex-col gap-2 p-3 bg-bible-50/40 rounded-lg border border-bible-100/40">
                      <div className="h-4 w-20 bg-bible-200/60 rounded"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-bible-100/50 rounded"></div>
                        <div className="h-3 w-3/4 bg-bible-100/50 rounded"></div>
                      </div>
                 </div>
             ))}
           </div>
        ) : state.error ? (
            <div className="text-red-500 p-3 bg-red-50 rounded-md text-sm">{state.error}</div>
        ) : (
            <div className="space-y-3">
                {state.data?.map((ref, idx) => (
                    <div key={idx} className="group flex flex-col gap-1 p-3 rounded-lg bg-bible-50 hover:bg-bible-100 transition-colors border border-bible-100/50">
                        <div className="flex items-center gap-2">
                             <span className="font-serif font-bold text-bible-800 text-sm">
                                {ref.reference}
                            </span>
                        </div>
                        <p className="text-xs text-bible-600 leading-relaxed">
                            {ref.connection}
                        </p>
                    </div>
                ))}
            </div>
        )}
    </Card>
  );
};