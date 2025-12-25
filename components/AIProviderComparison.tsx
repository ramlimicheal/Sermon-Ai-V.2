import React, { useState } from 'react';
import {
  GitCompare,
  Loader2,
  Clock,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Language } from '@/types';
import { AIProvider, compareProviders } from '@/services/aiProviderService';
import { supabase } from '@/services/supabaseClient';

interface ComparisonResult {
  megallm: {
    content: string;
    metrics: {
      responseTime?: number;
      success?: boolean;
      error?: string;
    };
  };
  openrouter: {
    content: string;
    metrics: {
      responseTime?: number;
      success?: boolean;
      error?: string;
    };
  };
}

const FEATURE_OPTIONS = [
  { value: 'commentary', label: 'Commentary' },
  { value: 'illustrations', label: 'Illustrations' },
  { value: 'outline', label: 'Sermon Outline' },
  { value: 'crossReferences', label: 'Cross References' },
  { value: 'applications', label: 'Applications' },
  { value: 'exegetical', label: 'Exegetical Notes' },
  { value: 'greekHebrew', label: 'Greek/Hebrew Analysis' },
  { value: 'historical', label: 'Historical Context' },
];

export const AIProviderComparison: React.FC = () => {
  const [scripture, setScripture] = useState('John 3:16');
  const [feature, setFeature] = useState('commentary');
  const [language, setLanguage] = useState<Language>('English');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);

  const handleCompare = async () => {
    if (!scripture.trim()) return;

    setComparing(true);
    setResult(null);
    setSelectedProvider(null);

    try {
      const comparisonResult = await compareProviders(feature, scripture, language);
      setResult(comparisonResult);
    } catch (error: any) {
      console.error('Comparison failed:', error);
    } finally {
      setComparing(false);
    }
  };

  const handleSelectProvider = async (provider: AIProvider) => {
    setSelectedProvider(provider);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !result) return;

      await supabase.from('ai_comparison_results').insert({
        user_id: user.id,
        feature,
        scripture,
        provider_a: 'megallm',
        provider_b: 'openrouter',
        response_a: result.megallm.content,
        response_b: result.openrouter.content,
        metrics_a: result.megallm.metrics,
        metrics_b: result.openrouter.metrics,
        preferred_provider: provider,
        compared_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save comparison result:', error);
    }
  };

  const renderProviderCard = (
    provider: 'megallm' | 'openrouter',
    data: ComparisonResult['megallm'] | ComparisonResult['openrouter']
  ) => {
    const providerName = provider === 'megallm' ? 'MegaLLM' : 'OpenRouter';
    const isSelected = selectedProvider === provider;

    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-bible-50 to-blue-50 p-4 border-b border-bible-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${data.metrics.success ? 'bg-green-500' : 'bg-red-500'}`} />
            <h3 className="font-semibold text-bible-900">{providerName}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-bible-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {data.metrics.responseTime || '—'}ms
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {data.metrics.error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {data.metrics.error}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-bible-800 leading-relaxed">
              {data.content}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-bible-100 bg-bible-50">
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => handleSelectProvider(provider)}
            disabled={!data.metrics.success}
            className="w-full"
          >
            {isSelected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-2" />
                Selected
              </>
            ) : (
              <>
                <Star className="h-3 w-3 mr-2" />
                Choose This
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-bible-100 bg-gradient-to-r from-bible-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-bible-900 text-white rounded-lg">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bible-900">AI Provider Comparison</h1>
              <p className="text-sm text-bible-600">
                Compare outputs from MegaLLM and OpenRouter side by side
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-bible-700 mb-1 block">
                Scripture Passage
              </label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder="e.g., John 3:16"
                className="w-full px-3 py-2 text-sm border border-bible-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bible-900"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-bible-700 mb-1 block">
                Feature to Test
              </label>
              <select
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-bible-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bible-900"
              >
                {FEATURE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-bible-700 mb-1 block">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 text-sm border border-bible-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bible-900"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleCompare}
            disabled={comparing || !scripture.trim()}
            className="mt-4 w-full md:w-auto"
          >
            {comparing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Comparison
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {comparing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-bible-900 animate-spin mx-auto mb-4" />
              <p className="text-bible-600">Running comparison tests...</p>
              <p className="text-xs text-bible-500 mt-1">
                This may take 10-20 seconds
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="h-full flex">
            {renderProviderCard('megallm', result.megallm)}
            <div className="w-px bg-bible-200" />
            {renderProviderCard('openrouter', result.openrouter)}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <GitCompare className="h-16 w-16 text-bible-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-bible-900 mb-2">
                Ready to Compare
              </h3>
              <p className="text-sm text-bible-600">
                Configure your test parameters above and click "Run Comparison" to see
                side-by-side results from both AI providers.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                <p className="text-xs text-blue-900 font-medium mb-2">
                  Comparison includes:
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Response quality and accuracy</li>
                  <li>• Speed and performance metrics</li>
                  <li>• Error handling and reliability</li>
                  <li>• Your preference tracking</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
