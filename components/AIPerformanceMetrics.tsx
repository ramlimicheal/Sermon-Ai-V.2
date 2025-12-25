import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  RefreshCw,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AIProvider, getProviderMetrics } from '@/services/aiProviderService';
import { supabase } from '@/services/supabaseClient';

interface ProviderMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  successRate: number;
  byFeature: Record<string, {
    requests: number;
    avgResponseTime: number;
    successRate: number;
  }>;
}

export const AIPerformanceMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<7 | 30>(7);
  const [megallmMetrics, setMegallmMetrics] = useState<ProviderMetrics | null>(null);
  const [openrouterMetrics, setOpenrouterMetrics] = useState<ProviderMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const [megallm, openrouter] = await Promise.all([
        getProviderMetrics(AIProvider.MEGALLM, timeRange),
        getProviderMetrics(AIProvider.OPENROUTER, timeRange),
      ]);

      setMegallmMetrics(megallm);
      setOpenrouterMetrics(openrouter);

      await loadComparisonData();
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComparisonData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - timeRange);

      const { data, error } = await supabase
        .from('ai_comparison_results')
        .select('*')
        .eq('user_id', user.id)
        .gte('compared_at', sinceDate.toISOString())
        .order('compared_at', { ascending: false });

      if (!error && data) {
        setComparisonData(data);
      }
    } catch (error) {
      console.error('Failed to load comparison data:', error);
    }
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange: `${timeRange} days`,
      megallm: megallmMetrics,
      openrouter: openrouterMetrics,
      comparisons: comparisonData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    subtitle?: string,
    trend?: 'up' | 'down'
  ) => (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-bible-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-bible-900">{value}</p>
          {subtitle && <p className="text-xs text-bible-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  const renderProviderSection = (name: string, metrics: ProviderMetrics | null, color: string) => {
    if (!metrics) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="text-lg font-semibold text-bible-900">{name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {renderMetricCard(
            'Total Requests',
            metrics.totalRequests,
            <Activity className="h-5 w-5" />
          )}
          {renderMetricCard(
            'Success Rate',
            `${metrics.successRate.toFixed(1)}%`,
            <CheckCircle className="h-5 w-5" />,
            `${metrics.successfulRequests} successful`,
            'up'
          )}
          {renderMetricCard(
            'Avg Response Time',
            `${Math.round(metrics.avgResponseTime)}ms`,
            <Clock className="h-5 w-5" />
          )}
          {renderMetricCard(
            'Failed Requests',
            metrics.failedRequests,
            <XCircle className="h-5 w-5" />,
            metrics.failedRequests === 0 ? 'Perfect!' : undefined
          )}
        </div>

        {Object.keys(metrics.byFeature).length > 0 && (
          <Card className="p-4">
            <h4 className="text-sm font-semibold text-bible-900 mb-3">Performance by Feature</h4>
            <div className="space-y-2">
              {Object.entries(metrics.byFeature).map(([feature, data]) => (
                <div key={feature} className="flex items-center justify-between text-sm">
                  <span className="text-bible-700 capitalize">{feature}</span>
                  <div className="flex items-center gap-4 text-xs text-bible-600">
                    <span>{data.requests} requests</span>
                    <span>{Math.round(data.avgResponseTime)}ms</span>
                    <span className={data.successRate >= 95 ? 'text-green-600' : 'text-amber-600'}>
                      {data.successRate.toFixed(0)}% success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const getUserPreference = () => {
    const megallmCount = comparisonData.filter(c => c.preferred_provider === 'megallm').length;
    const openrouterCount = comparisonData.filter(c => c.preferred_provider === 'openrouter').length;
    const total = megallmCount + openrouterCount;

    if (total === 0) return null;

    return {
      megallm: ((megallmCount / total) * 100).toFixed(1),
      openrouter: ((openrouterCount / total) * 100).toFixed(1),
      total,
    };
  };

  const preference = getUserPreference();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-bible-900 animate-spin mx-auto mb-4" />
          <p className="text-bible-600">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-bible-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bible-900 text-white rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bible-900">Performance Analytics</h1>
              <p className="text-sm text-bible-600">
                Track and compare AI provider performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30)}
              className="px-3 py-2 text-sm border border-bible-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bible-900"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>

            <Button variant="outline" size="sm" onClick={loadMetrics}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {preference && (
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-bible-900 mb-2">Your Preference Summary</h3>
                <p className="text-sm text-bible-600 mb-3">
                  Based on {preference.total} comparison{preference.total > 1 ? 's' : ''} you've made:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-bible-600 mb-1">MegaLLM</p>
                    <p className="text-2xl font-bold text-bible-900">{preference.megallm}%</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-bible-600 mb-1">OpenRouter</p>
                    <p className="text-2xl font-bold text-bible-900">{preference.openrouter}%</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {renderProviderSection('MegaLLM', megallmMetrics, 'bg-blue-500')}
        {renderProviderSection('OpenRouter', openrouterMetrics, 'bg-purple-500')}

        {!megallmMetrics && !openrouterMetrics && (
          <Card className="p-8 text-center">
            <Zap className="h-12 w-12 text-bible-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-bible-900 mb-2">No Data Yet</h3>
            <p className="text-sm text-bible-600 mb-4">
              Start testing AI providers to see performance metrics here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
