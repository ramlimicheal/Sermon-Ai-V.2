import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Languages, Search, Loader2 } from 'lucide-react';
import { analyzeOriginalLanguages } from '@/services/geminiService';
import { Language } from '@/types';

interface GreekHebrewLexiconProps {
  scripture: string;
  language: Language;
}

interface WordStudy {
  word: string;
  transliteration: string;
  strongsNumber: string;
  definition: string;
  usage: string;
}

export const GreekHebrewLexicon: React.FC<GreekHebrewLexiconProps> = ({ scripture, language }) => {
  const [wordStudies, setWordStudies] = useState<WordStudy[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeOriginalLanguages(scripture, language);
      setWordStudies(result);
    } catch (error) {
      console.error('Error analyzing original languages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Greek & Hebrew Lexicon</span>
        {wordStudies.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleAnalyze} disabled={loading} className="h-7 px-2 text-xs">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Refresh'}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {wordStudies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Languages className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-4">Analyze key words in original languages</p>
            <Button onClick={handleAnalyze} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Search className="h-4 w-4 mr-1.5" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {wordStudies.map((study, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white hover:border-bible-300 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium text-bible-900">{study.word}</span>
                    <span className="text-xs text-bible-500 ml-2 italic">{study.transliteration}</span>
                  </div>
                  <span className="text-[10px] bg-bible-100 text-bible-600 px-1.5 py-0.5 rounded font-mono">
                    {study.strongsNumber}
                  </span>
                </div>
                <p className="text-sm text-bible-700 mb-1">{study.definition}</p>
                <p className="text-xs text-bible-500">{study.usage}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
