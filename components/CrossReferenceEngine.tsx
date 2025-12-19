import React, { useEffect, useState } from 'react';
import { getCrossReferences } from '@/services/geminiService';
import { getDemoCrossReferences } from '@/services/demoService';
import { CrossReference, GenerationState, Language } from '@/types';
import { Link2, Loader2, RefreshCw, Sparkles, Info, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';

interface CrossReferenceEngineProps {
  scripture: string;
  language: Language;
}

interface CrossRefState {
  data: CrossReference[] | null;
  isDemo: boolean;
  loading: boolean;
  error: string | null;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'thematic': return 'bg-blue-100 text-blue-700';
    case 'prophetic': return 'bg-purple-100 text-purple-700';
    case 'theological': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const CrossReferenceEngine: React.FC<CrossReferenceEngineProps> = ({ scripture, language }) => {
  const [state, setState] = useState<CrossRefState>({
    data: null,
    isDemo: false,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, isDemo: false, loading: true, error: null });
    try {
      const result = await getCrossReferences(scripture, language);
      setState({ data: result, isDemo: false, loading: false, error: null });
    } catch (err) {
      // Fall back to demo mode with beautiful mock content
      try {
        const demoResults = await getDemoCrossReferences(scripture);
        // Map demo results to match CrossReference type
        const mappedResults: CrossReference[] = demoResults.map(item => ({
          reference: item.reference,
          connection: item.connection,
          type: item.type,
        }));
        setState({ data: mappedResults, isDemo: true, loading: false, error: null });
      } catch (demoErr) {
        setState({ data: null, isDemo: false, loading: false, error: "Failed to find cross references." });
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripture, language]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-bible-500">Cross References</span>
          {state.isDemo && (
            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              Demo
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={state.loading} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${state.loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* Demo mode banner */}
      {state.isDemo && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <span className="text-xs text-amber-700">
            Viewing demo references. <button className="underline font-medium hover:text-amber-900">Connect AI</button> to unlock live results.
          </span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading ? (
          <div className="space-y-3">
            <CardSkeleton lines={2} />
            <CardSkeleton lines={2} />
            <CardSkeleton lines={2} />
          </div>
        ) : state.error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {state.data?.map((ref, idx) => (
              <div key={idx} className="group p-3 rounded-md border border-bible-200 bg-white hover:border-bible-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-bible-400" />
                    <p className="text-sm font-medium text-bible-900">{ref.reference}</p>
                    {ref.type && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${getTypeColor(ref.type)}`}>
                        {ref.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => {/* TODO: Open reference */}}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => {/* TODO: Insert into sermon */}}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Insert
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-bible-600 leading-relaxed">{ref.connection}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
