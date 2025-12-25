import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Loader2, BookMarked, FileText, Layers, Lightbulb, AlertCircle } from 'lucide-react';
import { getExegeticalNotes } from '@/services/megaLLMService';
import { Language } from '@/types';

interface ExegeticalNotesProps {
  scripture: string;
  language: Language;
}

interface ExegesisData {
  literaryStructure: string;
  grammaticalInsights: string;
  textualVariants: string;
  theologicalThemes: string;
  homileticalBridges: string;
}

export const ExegeticalNotes: React.FC<ExegeticalNotesProps> = ({ scripture, language }) => {
  const [notes, setNotes] = useState<ExegesisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getExegeticalNotes(scripture, language);
      setNotes(result);
    } catch (error) {
      console.error('Error getting exegetical notes:', error);
      setError('Failed to generate exegetical notes. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Exegetical Notes" icon={<GraduationCap className="h-5 w-5" />}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={handleGenerate} className="mt-2">
                Retry
              </Button>
            </div>
          </div>
        )}
        {!notes && !error ? (
          <div className="text-center py-8">
            <div className="bg-bible-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-bible-600" />
            </div>
            <p className="text-bible-500 text-sm mb-4">
              Advanced exegetical analysis for deep biblical study
            </p>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 mr-2" /> Generate Notes
                </>
              )}
            </Button>
          </div>
        ) : notes ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-bible-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-bible-900">Literary Structure & Genre</h4>
              </div>
              <p className="text-sm text-bible-700 leading-relaxed">{notes.literaryStructure}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-bible-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-bible-900">Grammatical Insights</h4>
              </div>
              <p className="text-sm text-bible-700 leading-relaxed">{notes.grammaticalInsights}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-bible-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-bible-900">Textual Variants</h4>
              </div>
              <p className="text-sm text-bible-700 leading-relaxed">{notes.textualVariants}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-bible-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-bible-900">Theological Themes</h4>
              </div>
              <p className="text-sm text-bible-700 leading-relaxed">{notes.theologicalThemes}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-bible-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-bible-900">Homiletical Bridges</h4>
              </div>
              <p className="text-sm text-bible-700 leading-relaxed">{notes.homileticalBridges}</p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GraduationCap className="h-4 w-4 mr-2" />}
              Regenerate
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
