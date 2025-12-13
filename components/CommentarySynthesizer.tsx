import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { synthesizeCommentary } from '../services/geminiService';
import { GenerationState, Language } from '../types';
import { Card } from './ui/Card';
import { BookOpenCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

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
    <Card 
      title="Commentary Synthesis" 
      icon={<BookOpenCheck className="h-5 w-5" />}
      className="h-full border-t-4 border-t-bible-600"
      scrollable={true}
      action={
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={state.loading} className="h-8 w-8 p-0">
           <RefreshCw className={`h-3.5 w-3.5 ${state.loading ? 'animate-spin' : ''}`} />
        </Button>
      }
    >
      <div className="prose prose-sm prose-bible max-w-none prose-headings:font-serif prose-headings:text-bible-900 prose-headings:font-bold prose-p:text-bible-800 prose-p:leading-relaxed prose-li:text-bible-800 prose-strong:text-bible-900">
        {state.loading ? (
          <div className="flex flex-col h-full animate-pulse px-1">
            {/* Header-like skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-8 bg-bible-200/60 rounded-md w-3/4"></div>
              <div className="h-4 bg-bible-100/60 rounded-md w-1/2"></div>
            </div>
            
            {/* Body paragraphs */}
            <div className="space-y-8">
              <div className="space-y-2.5">
                 <div className="h-4 bg-bible-200/40 rounded w-full"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-full"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-5/6"></div>
              </div>
              <div className="space-y-2.5">
                 <div className="h-4 bg-bible-200/40 rounded w-11/12"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-full"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-full"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-4/5"></div>
              </div>
               <div className="space-y-2.5">
                 <div className="h-4 bg-bible-200/40 rounded w-5/6"></div>
                 <div className="h-4 bg-bible-100/40 rounded w-full"></div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2 text-bible-400">
               <Loader2 className="h-4 w-4 animate-spin" />
               <span className="text-xs uppercase tracking-widest font-medium">Synthesizing Context ({language})...</span>
            </div>
          </div>
        ) : state.error ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-600 text-sm font-medium">{state.error}</p>
            <Button variant="outline" size="sm" onClick={fetchData} className="mt-2 bg-white border-red-200 text-red-700 hover:bg-red-50">Retry</Button>
          </div>
        ) : (
          <ReactMarkdown>{state.data || ''}</ReactMarkdown>
        )}
      </div>
    </Card>
  );
};