import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Loader2, Plus, BookOpen, AlertCircle } from 'lucide-react';
import { generateSermonSeries } from '@/services/megaLLMService';
import { Language } from '@/types';

interface SermonSeriesBuilderProps {
  language: Language;
}

interface SeriesWeek {
  week: number;
  title: string;
  scripture: string;
  keyPoints: string[];
  progression: string;
}

export const SermonSeriesBuilder: React.FC<SermonSeriesBuilderProps> = ({ language }) => {
  const [series, setSeries] = useState<SeriesWeek[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [weeks, setWeeks] = useState(4);
  const [showForm, setShowForm] = useState(true);

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateSermonSeries(theme, weeks, language);
      setSeries(result);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating sermon series:', error);
      setError('Failed to generate sermon series. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Sermon Series Builder" icon={<Calendar className="h-5 w-5" />}>
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
        {showForm ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="bg-bible-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-bible-600" />
              </div>
              <p className="text-bible-500 text-sm mb-4">
                Plan a multi-week sermon series with AI assistance
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-bible-700 mb-2">Series Theme</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., The Fruit of the Spirit, Prayer, Faith"
                className="w-full px-4 py-2 border border-bible-300 rounded-lg focus:ring-2 focus:ring-bible-500 focus:border-bible-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-bible-700 mb-2">Number of Weeks</label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full px-4 py-2 border border-bible-300 rounded-lg focus:ring-2 focus:ring-bible-500 focus:border-bible-500"
              >
                <option value={3}>3 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={5}>5 weeks</option>
                <option value={6}>6 weeks</option>
                <option value={8}>8 weeks</option>
                <option value={12}>12 weeks</option>
              </select>
            </div>

            <Button onClick={handleGenerate} disabled={loading || !theme.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating Series...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Generate Series
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-bible-800 to-bible-700 p-4 rounded-lg text-white">
              <h3 className="font-serif font-bold text-xl mb-1">{theme}</h3>
              <p className="text-bible-200 text-sm">{weeks}-Week Sermon Series</p>
            </div>

            <div className="space-y-3">
              {series.map((week) => (
                <div
                  key={week.week}
                  className="p-4 bg-white rounded-lg border border-bible-200 hover:border-bible-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-bible-700 text-white rounded-lg flex items-center justify-center font-bold">
                      {week.week}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-bible-900 text-lg mb-1">{week.title}</h4>
                      <p className="text-sm text-bible-600 flex items-center gap-2">
                        <BookOpen className="h-3 w-3" />
                        {week.scripture}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-xs font-semibold text-bible-500 uppercase tracking-wide">Key Points</p>
                    <ul className="space-y-1">
                      {week.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-bible-700 flex items-start gap-2">
                          <span className="text-bible-400 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-bible-100">
                    <p className="text-xs font-semibold text-bible-500 uppercase tracking-wide mb-1">Series Flow</p>
                    <p className="text-sm text-bible-600 italic">{week.progression}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(true)} className="flex-1">
                New Series
              </Button>
              <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
