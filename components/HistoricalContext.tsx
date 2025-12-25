import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Users, Landmark, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { getHistoricalContext } from '@/services/megaLLMService';
import { Language } from '@/types';

interface HistoricalContextProps {
  scripture: string;
  language: Language;
}

interface ContextData {
  timeperiod: string;
  culturalBackground: string;
  geographicalSetting: string;
  politicalContext: string;
  religiousContext: string;
}

export const HistoricalContext: React.FC<HistoricalContextProps> = ({ scripture, language }) => {
  const [context, setContext] = useState<ContextData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHistoricalContext(scripture, language);
      setContext(result);
    } catch (error) {
      console.error('Error getting historical context:', error);
      setError('Failed to generate historical context. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = context ? [
    { icon: Calendar, label: 'Time Period', content: context.timeperiod },
    { icon: MapPin, label: 'Geography', content: context.geographicalSetting },
    { icon: Users, label: 'Culture', content: context.culturalBackground },
    { icon: Landmark, label: 'Political', content: context.politicalContext },
    { icon: BookOpen, label: 'Religious', content: context.religiousContext },
  ] : [];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Historical Context</span>
        {context && (
          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={loading} className="h-7 px-2 text-xs">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Refresh'}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={handleGenerate} className="mt-2">
                Retry
              </Button>
            </div>
          </div>
        )}
        {!context && !error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Landmark className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-4">Understand the historical context</p>
            <Button onClick={handleGenerate} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <MapPin className="h-4 w-4 mr-1.5" />}
              {loading ? 'Loading...' : 'Generate'}
            </Button>
          </div>
        ) : context ? (
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white">
                <div className="flex items-center gap-1.5 mb-1 text-bible-500">
                  <section.icon className="h-3 w-3" />
                  <span className="text-[10px] font-medium uppercase">{section.label}</span>
                </div>
                <p className="text-sm text-bible-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
