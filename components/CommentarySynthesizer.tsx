import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateSermonContent } from '@/services/megaLLMService';
import { getDemoCommentary } from '@/services/demoService';
import { GenerationState, Language } from '@/types';
import { RefreshCw, Loader2, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SourceAttribution, Citation, generateMockCitations } from '@/components/TrustLayer';
import { CommentarySkeleton } from '@/components/ui/Skeleton';

interface CommentarySynthesizerProps {
  scripture: string;
  language: Language;
}

interface CommentaryState {
  content: string | null;
  citations: Citation[];
  isDemo: boolean;
  loading: boolean;
  error: string | null;
}

export const CommentarySynthesizer: React.FC<CommentarySynthesizerProps> = ({ scripture, language }) => {
  const [state, setState] = useState<CommentaryState>({
    content: null,
    citations: [],
    isDemo: false,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState({ content: null, citations: [], isDemo: false, loading: true, error: null });
    try {
      const result = await generateSermonContent('commentary', scripture, language);
      setState({ 
        content: result, 
        citations: generateMockCitations(scripture),
        isDemo: false, 
        loading: false, 
        error: null 
      });
    } catch (err) {
      // Fall back to demo mode with beautiful mock content
      try {
        const demoResult = await getDemoCommentary(scripture);
        setState({ 
          content: demoResult.content, 
          citations: demoResult.citations,
          isDemo: true, 
          loading: false, 
          error: null 
        });
      } catch (demoErr) {
        setState({ content: null, citations: [], isDemo: false, loading: false, error: "Failed to load commentary." });
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
          <span className="text-xs font-medium text-bible-500">Commentary Synthesis</span>
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
            Viewing demo content. <button className="underline font-medium hover:text-amber-900">Connect AI</button> to unlock live, personalized results.
          </span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm max-w-none prose-headings:text-bible-900 prose-headings:font-semibold prose-headings:text-sm prose-p:text-bible-600 prose-p:text-sm prose-p:leading-relaxed prose-li:text-bible-600 prose-li:text-sm prose-strong:text-bible-900">
          {state.loading ? (
            <CommentarySkeleton />
          ) : state.error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-red-600 mb-2">{state.error}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
            </div>
          ) : (
            <>
              <ReactMarkdown>{state.content || ''}</ReactMarkdown>
              {state.citations.length > 0 && (
                <SourceAttribution citations={state.citations} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
