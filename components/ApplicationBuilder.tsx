import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Target, Users, Heart, Briefcase, Home, Loader2, Plus, Sparkles, Info, Copy, Check } from 'lucide-react';
import { generateApplications } from '@/services/geminiService';
import { getDemoApplications } from '@/services/demoService';
import { Language } from '@/types';
import { CardSkeleton } from '@/components/ui/Skeleton';

interface ApplicationBuilderProps {
  scripture: string;
  language: Language;
}

interface Application {
  audience: string;
  application: string;
  actionStep: string;
}

interface ApplicationState {
  data: Application[];
  isDemo: boolean;
  loading: boolean;
  error: string | null;
}

export const ApplicationBuilder: React.FC<ApplicationBuilderProps> = ({ scripture, language }) => {
  const [state, setState] = useState<ApplicationState>({
    data: [],
    isDemo: false,
    loading: false,
    error: null,
  });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await generateApplications(scripture, language);
      setState({ data: result, isDemo: false, loading: false, error: null });
    } catch (error) {
      // Fall back to demo mode with beautiful mock content
      try {
        const demoResults = await getDemoApplications(scripture);
        // Map demo results to match Application type
        const mappedResults: Application[] = demoResults.map(item => ({
          audience: item.audience,
          application: item.application,
          actionStep: item.actionStep,
        }));
        setState({ data: mappedResults, isDemo: true, loading: false, error: null });
      } catch (demoErr) {
        setState({ data: [], isDemo: false, loading: false, error: "Failed to generate applications." });
      }
    }
  };

  const handleCopy = (idx: number, app: Application) => {
    const text = `${app.audience}\n${app.application}\n\nAction: ${app.actionStep}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const audienceIcons: Record<string, React.ReactNode> = {
    'Youth': <Users className="h-4 w-4" />,
    'Families': <Home className="h-4 w-4" />,
    'Singles': <Heart className="h-4 w-4" />,
    'Professionals': <Briefcase className="h-4 w-4" />,
    'Seniors': <Users className="h-4 w-4" />,
    'General': <Target className="h-4 w-4" />
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-bible-500">Practical Applications</span>
          {state.isDemo && (
            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              Demo
            </span>
          )}
        </div>
        {state.data.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={state.loading} className="h-7 px-2 text-xs">
            {state.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'More'}
          </Button>
        )}
      </div>
      
      {/* Demo mode banner */}
      {state.isDemo && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <span className="text-xs text-amber-700">
            Viewing demo applications. <button className="underline font-medium hover:text-amber-900">Connect AI</button> to unlock personalized results.
          </span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading && state.data.length === 0 ? (
          <div className="space-y-3">
            <CardSkeleton lines={3} />
            <CardSkeleton lines={3} />
            <CardSkeleton lines={3} />
          </div>
        ) : state.error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{state.error}</p>
            <Button variant="outline" size="sm" onClick={handleGenerate}>Retry</Button>
          </div>
        ) : state.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-1">Generate practical applications</p>
            <p className="text-xs text-bible-400 mb-4">Tailored for different audiences</p>
            <Button onClick={handleGenerate} disabled={state.loading} size="sm">
              {state.loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
              {state.loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {state.data.map((app, idx) => (
              <div key={idx} className="group p-3 rounded-md border border-bible-200 bg-white hover:border-bible-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-bible-500">
                    {audienceIcons[app.audience] || <Target className="h-4 w-4" />}
                    <span className="text-xs font-medium">{app.audience}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => handleCopy(idx, app)}
                    >
                      {copiedIdx === idx ? <Check className="h-3 w-3 mr-1 text-green-600" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
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
                <p className="text-sm text-bible-700 mb-2">{app.application}</p>
                <div className="text-xs text-bible-600 bg-bible-50 p-2 rounded border-l-2 border-bible-400">
                  <span className="font-medium">Action:</span> {app.actionStep}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
