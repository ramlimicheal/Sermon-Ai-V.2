
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateOutline } from '../services/geminiService';
import { OutlineType, GenerationState, Language } from '../types';
import { Card } from './ui/Card';
import { List, Wand2, Copy, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface OutlineGeneratorProps {
  scripture: string;
  language: Language;
}

export const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ scripture, language }) => {
  const [type, setType] = useState<OutlineType>(OutlineType.EXPOSITORY);
  const [state, setState] = useState<GenerationState<string>>({
    data: null,
    loading: false,
    error: null,
  });
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await generateOutline(scripture, type, language);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: "Failed to generate outline." });
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
    <Card 
      title="Structure Builder" 
      icon={<List className="h-5 w-5" />}
      className="h-full border-t-4 border-t-bible-900"
      scrollable={true}
      action={
          state.data && (
            <button 
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-bible-500 hover:text-bible-900 transition-colors"
                title="Copy to clipboard"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
            </button>
          )
      }
    >
      <div className="flex flex-col gap-3 mb-6 bg-bible-50 p-4 rounded-lg border border-bible-100">
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-bible-600 uppercase tracking-wide">Outline Structure</label>
            <select
            value={type}
            onChange={(e) => setType(e.target.value as OutlineType)}
            className="w-full rounded-md border-bible-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-bible-500 focus:outline-none focus:ring-1 focus:ring-bible-500 shadow-sm"
            >
            {Object.values(OutlineType).map((t) => (
                <option key={t} value={t}>{t}</option>
            ))}
            </select>
        </div>
        <Button onClick={handleGenerate} disabled={state.loading} className="w-full justify-center">
          {state.loading ? 'Architecting Sermon...' : <><Wand2 className="mr-2 h-4 w-4" /> Generate Structure</>}
        </Button>
      </div>

      <div className="space-y-6 pb-10">
        {state.loading && (
             <div className="space-y-6 animate-pulse px-1">
                <div className="h-8 w-2/3 bg-bible-200 rounded mx-auto mb-8"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border border-bible-100 rounded-lg p-4 space-y-3">
                        <div className="h-5 w-1/3 bg-bible-200 rounded"></div>
                        <div className="h-4 w-full bg-bible-100 rounded"></div>
                        <div className="h-4 w-5/6 bg-bible-100 rounded"></div>
                    </div>
                ))}
            </div>
        )}
        
        {state.error && <div className="text-red-500 text-sm p-4 bg-red-50 rounded border border-red-100 text-center">{state.error}</div>}
        
        {!state.loading && !state.data && !state.error && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                <List className="h-12 w-12 text-bible-300 mb-2" />
                <p className="text-bible-500 text-sm">Select a structure above to<br/>generate a spacious sermon skeleton.</p>
            </div>
        )}

        {state.data && (
            <div className="outline-viewer">
                <ReactMarkdown
                    components={{
                        // Custom renderers to un-crowd the content using visual blocks
                        h1: ({children}) => <h1 className="text-2xl lg:text-3xl font-bold text-center text-bible-900 font-serif mb-8 pb-4 border-b-2 border-bible-100">{children}</h1>,
                        
                        // H2 as a distinct section header with a pill indicator
                        h2: ({children}) => (
                            <div className="mt-8 mb-4">
                                <h2 className="text-lg lg:text-xl font-bold text-bible-800 uppercase tracking-wider flex items-center gap-3">
                                    <span className="h-2 w-2 bg-bible-400 rounded-full"></span>
                                    {children}
                                </h2>
                            </div>
                        ),
                        
                        // H3 for sub-points
                        h3: ({children}) => <h3 className="text-base lg:text-lg font-bold text-bible-900 mt-6 mb-2 pl-4 border-l-4 border-bible-300">{children}</h3>,
                        
                        // Lists with generous spacing
                        ul: ({children}) => <ul className="space-y-4 my-6">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside space-y-4 my-6">{children}</ol>,
                        
                        // List items as distinct cards/blocks for readability
                        li: ({children}) => (
                            <li className="text-bible-700 leading-relaxed p-3 rounded-lg bg-bible-50/50 border border-transparent hover:border-bible-200 hover:bg-white transition-all">
                                <span className="inline-block align-top">{children}</span>
                            </li>
                        ),
                        
                        p: ({children}) => <p className="text-bible-700 leading-7 mb-4 font-sans text-base">{children}</p>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-bible-400 pl-4 py-2 italic text-bible-600 bg-bible-50 rounded-r-lg my-4">{children}</blockquote>,
                        strong: ({children}) => <span className="font-bold text-bible-900">{children}</span>
                    }}
                >
                    {state.data}
                </ReactMarkdown>
            </div>
        )}
      </div>
    </Card>
  );
};
