import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GitCompare, Loader2 } from 'lucide-react';
import { getParallelPassages } from '@/services/geminiService';
import { Language } from '@/types';

interface ParallelPassagesProps {
  scripture: string;
  language: Language;
}

interface Parallel {
  reference: string;
  relationshipType: string;
  explanation: string;
}

export const ParallelPassages: React.FC<ParallelPassagesProps> = ({ scripture, language }) => {
  const [parallels, setParallels] = useState<Parallel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getParallelPassages(scripture, language);
      setParallels(result);
    } catch (error) {
      console.error('Error getting parallel passages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Parallel Passages</span>
        {parallels.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={loading} className="h-7 px-2 text-xs">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Refresh'}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {parallels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GitCompare className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-4">Find parallel passages</p>
            <Button onClick={handleGenerate} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <GitCompare className="h-4 w-4 mr-1.5" />}
              {loading ? 'Finding...' : 'Find'}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {parallels.map((parallel, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-bible-900">{parallel.reference}</p>
                  <span className="text-[10px] bg-bible-100 text-bible-600 px-1.5 py-0.5 rounded">
                    {parallel.relationshipType}
                  </span>
                </div>
                <p className="text-xs text-bible-600 leading-relaxed">{parallel.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
