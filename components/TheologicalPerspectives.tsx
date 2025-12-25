import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BookOpen, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getTheologicalPerspectives } from '@/services/megaLLMService';
import { Language } from '@/types';

interface TheologicalPerspectivesProps {
  scripture: string;
  language: Language;
}

interface Perspective {
  tradition: string;
  interpretation: string;
  keyEmphasis: string;
}

export const TheologicalPerspectives: React.FC<TheologicalPerspectivesProps> = ({ scripture, language }) => {
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTheologicalPerspectives(scripture, language);
      setPerspectives(result);
    } catch (error) {
      console.error('Error getting theological perspectives:', error);
      setError('Failed to generate theological perspectives. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Theological Perspectives</span>
        {perspectives.length > 0 && (
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
        {perspectives.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-4">Explore different interpretations</p>
            <Button onClick={handleGenerate} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <BookOpen className="h-4 w-4 mr-1.5" />}
              {loading ? 'Loading...' : 'Generate'}
            </Button>
          </div>
        ) : perspectives.length > 0 ? (
          <div className="space-y-2">
            {perspectives.map((perspective, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="rounded-md border border-bible-200 bg-white overflow-hidden">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-bible-50 transition-colors"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <div>
                      <p className="text-sm font-medium text-bible-900">{perspective.tradition}</p>
                      <p className="text-xs text-bible-500">{perspective.keyEmphasis}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-bible-400" /> : <ChevronDown className="h-4 w-4 text-bible-400" />}
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0">
                      <p className="text-sm text-bible-600 leading-relaxed">{perspective.interpretation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
