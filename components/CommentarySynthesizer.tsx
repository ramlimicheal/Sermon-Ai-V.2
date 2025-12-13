import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { synthesizeCommentary } from '@/services/geminiService';
import { GenerationState, Language } from '@/types';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CommentarySynthesizerProps {
  scripture: string;
  language: Language;
}

export const CommentarySynthesizer: React.FC<CommentarySynthesizerProps> = ({ scripture, language }) => {
  const [state, setState] = useState<GenerationState<string>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await synthesizeCommentary(scripture, language);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: "Failed to load commentary." });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripture, language]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Commentary Synthesis</span>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={state.loading} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${state.loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm max-w-none prose-headings:text-bible-900 prose-headings:font-semibold prose-headings:text-sm prose-p:text-bible-600 prose-p:text-sm prose-p:leading-relaxed prose-li:text-bible-600 prose-li:text-sm prose-strong:text-bible-900">
          {state.loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-bible-400">
              <Loader2 className="h-5 w-5 animate-spin mb-2" />
              <span className="text-xs">Loading commentary...</span>
            </div>
          ) : state.error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-red-600 mb-2">{state.error}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
            </div>
          ) : (
            <ReactMarkdown>{state.data || ''}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};