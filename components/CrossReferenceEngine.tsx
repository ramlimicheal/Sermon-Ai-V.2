import React, { useEffect, useState } from 'react';
import { getCrossReferences } from '@/services/geminiService';
import { CrossReference, GenerationState, Language } from '@/types';
import { Link2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await getCrossReferences(scripture, language);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: "Failed to find cross references." });
    }
  };

  useEffect(() => {
    fetchData();
  }, [scripture, language]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Cross References</span>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={state.loading} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${state.loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-bible-400">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span className="text-xs">Finding references...</span>
          </div>
        ) : state.error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {state.data?.map((ref, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white hover:border-bible-300 transition-colors">
                <p className="text-sm font-medium text-bible-900 mb-1">{ref.reference}</p>
                <p className="text-xs text-bible-600 leading-relaxed">{ref.connection}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};