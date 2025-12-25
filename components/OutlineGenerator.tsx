import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateSermonContent } from '@/services/megaLLMService';
import { OutlineType, Language } from '@/types';
import { List, Wand2, Copy, Check, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OutlineSkeleton } from '@/components/ui/Skeleton';

interface OutlineGeneratorProps {
  scripture: string;
  language: Language;
}

interface OutlineState {
  data: string | null;
  loading: boolean;
  error: string | null;
}

export const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ scripture, language }) => {
  const [type, setType] = useState<OutlineType>(OutlineType.EXPOSITORY);
  const [state, setState] = useState<OutlineState>({
    data: null,
    loading: false,
    error: null,
  });
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await generateSermonContent('outline', scripture, language, type);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      console.error('Outline generation error:', err);
      setState({ data: null, loading: false, error: "Failed to generate outline. Please check your API key and try again." });
    }
  };

  const handleCopy = () => {
    if (state.data) {
        navigator.clipboard.writeText(state.data);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Controls */}
      <div className="p-4 border-b border-bible-100 shrink-0">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as OutlineType)}
            className="flex-1 rounded-md border border-bible-200 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900"
          >
            {Object.values(OutlineType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Button onClick={handleGenerate} disabled={state.loading} size="sm">
            {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wand2 className="h-4 w-4 mr-1.5" /> Generate</>}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading && <OutlineSkeleton />}
        
        {state.error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={handleGenerate}>Retry</Button>
          </div>
        )}
        
        {!state.loading && !state.data && !state.error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <List className="h-8 w-8 text-bible-300 mb-2" />
            <p className="text-sm text-bible-500">Select a structure and generate</p>
            <p className="text-xs text-bible-400 mt-1">Choose Expository, Topical, or Narrative</p>
          </div>
        )}

        {state.data && (
          <div className="relative">
            <div className="flex items-center gap-2 absolute top-0 right-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => {/* TODO: Insert into sermon */}}
              >
                <Plus className="h-3 w-3 mr-1" />
                Use Outline
              </Button>
              <button 
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-bible-400 hover:text-bible-600 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="prose prose-sm max-w-none prose-headings:text-bible-900 prose-headings:font-semibold prose-p:text-bible-600 prose-p:text-sm prose-li:text-bible-600 prose-li:text-sm mt-8">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-lg font-semibold text-bible-900 mb-4 pb-2 border-b border-bible-100">{children}</h1>,
                  h2: ({children}) => <h2 className="text-sm font-semibold text-bible-900 mt-4 mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-bible-400 rounded-full"></span>{children}</h2>,
                  h3: ({children}) => <h3 className="text-sm font-medium text-bible-700 mt-3 mb-1 pl-3 border-l-2 border-bible-200">{children}</h3>,
                  ul: ({children}) => <ul className="space-y-2 my-3">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside space-y-2 my-3">{children}</ol>,
                  li: ({children}) => <li className="text-sm text-bible-600 leading-relaxed pl-2">{children}</li>,
                  p: ({children}) => <p className="text-sm text-bible-600 leading-relaxed mb-2">{children}</p>,
                  blockquote: ({children}) => <blockquote className="border-l-2 border-bible-300 pl-3 italic text-bible-500 text-sm my-3">{children}</blockquote>,
                  strong: ({children}) => <span className="font-medium text-bible-900">{children}</span>
                }}
              >
                {state.data}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
