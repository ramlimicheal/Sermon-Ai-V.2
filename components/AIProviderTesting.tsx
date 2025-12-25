import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Zap,
  Activity,
  AlertCircle,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  AIProvider,
  ProviderStatus,
  testProviderConnection,
  getAllProviderStatuses,
  setCurrentProvider,
  getCurrentProvider,
  isProviderConfigured,
} from '@/services/aiProviderService';

interface TestResult {
  provider: AIProvider;
  status: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
  responseTime?: number;
}

export const AIProviderTesting: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<AIProvider, TestResult>>({
    [AIProvider.MEGALLM]: { provider: AIProvider.MEGALLM, status: 'idle' },
    [AIProvider.OPENROUTER]: { provider: AIProvider.OPENROUTER, status: 'idle' },
    [AIProvider.GEMINI]: { provider: AIProvider.GEMINI, status: 'idle' },
  });
  const [currentProvider, setCurrentProviderState] = useState<AIProvider>(getCurrentProvider());
  const [testingAll, setTestingAll] = useState(false);

  useEffect(() => {
    testAllProviders();
  }, []);

  const testSingleProvider = async (provider: AIProvider) => {
    setTestResults(prev => ({
      ...prev,
      [provider]: { ...prev[provider], status: 'testing' },
    }));

    try {
      if (!isProviderConfigured(provider)) {
        setTestResults(prev => ({
          ...prev,
          [provider]: {
            provider,
            status: 'error',
            message: 'API key not configured',
          },
        }));
        return;
      }

      const result = await testProviderConnection(provider);

      setTestResults(prev => ({
        ...prev,
        [provider]: {
          provider,
          status: result.isHealthy ? 'success' : 'error',
          message: result.error || `Connected successfully (${result.responseTime}ms)`,
          responseTime: result.responseTime,
        },
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          provider,
          status: 'error',
          message: error.message || 'Connection failed',
        },
      }));
    }
  };

  const testAllProviders = async () => {
    setTestingAll(true);

    setTestResults({
      [AIProvider.MEGALLM]: { provider: AIProvider.MEGALLM, status: 'testing' },
      [AIProvider.OPENROUTER]: { provider: AIProvider.OPENROUTER, status: 'testing' },
      [AIProvider.GEMINI]: { provider: AIProvider.GEMINI, status: 'idle' },
    });

    const statuses = await getAllProviderStatuses();

    const newResults: Record<AIProvider, TestResult> = {
      [AIProvider.MEGALLM]: { provider: AIProvider.MEGALLM, status: 'idle' },
      [AIProvider.OPENROUTER]: { provider: AIProvider.OPENROUTER, status: 'idle' },
      [AIProvider.GEMINI]: { provider: AIProvider.GEMINI, status: 'idle' },
    };

    statuses.forEach(status => {
      newResults[status.provider] = {
        provider: status.provider,
        status: status.isHealthy ? 'success' : 'error',
        message: status.error || `Connected successfully (${status.responseTime}ms)`,
        responseTime: status.responseTime,
      };
    });

    setTestResults(newResults);
    setTestingAll(false);
  };

  const handleSetProvider = (provider: AIProvider) => {
    if (testResults[provider].status === 'success') {
      setCurrentProvider(provider);
      setCurrentProviderState(provider);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getProviderName = (provider: AIProvider): string => {
    switch (provider) {
      case AIProvider.MEGALLM:
        return 'MegaLLM';
      case AIProvider.OPENROUTER:
        return 'OpenRouter';
      case AIProvider.GEMINI:
        return 'Gemini';
      default:
        return provider;
    }
  };

  const getProviderDescription = (provider: AIProvider): string => {
    switch (provider) {
      case AIProvider.MEGALLM:
        return 'Fast, cost-effective Llama models';
      case AIProvider.OPENROUTER:
        return 'Multiple model options with reliability';
      case AIProvider.GEMINI:
        return 'Google\'s advanced AI models';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bible-900">AI Provider Testing</h1>
          <p className="text-sm text-bible-600 mt-1">
            Test and validate your AI provider API keys
          </p>
        </div>
        <Button
          onClick={testAllProviders}
          disabled={testingAll}
          variant="outline"
        >
          {testingAll ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Test All
        </Button>
      </div>

      <div className="grid gap-4">
        {[AIProvider.MEGALLM, AIProvider.OPENROUTER].map((provider) => {
          const result = testResults[provider];
          const isConfigured = isProviderConfigured(provider);
          const isCurrent = provider === currentProvider;

          return (
            <Card key={provider} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(result.status)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-bible-900">
                        {getProviderName(provider)}
                      </h3>
                      {isCurrent && (
                        <span className="text-xs bg-bible-900 text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-bible-600 mt-0.5">
                      {getProviderDescription(provider)}
                    </p>

                    {!isConfigured && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        API key not configured in .env file
                      </div>
                    )}

                    {isConfigured && result.message && (
                      <div
                        className={`mt-2 p-2 rounded text-xs ${
                          result.status === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : result.status === 'error'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-gray-50 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {result.message}
                      </div>
                    )}

                    {result.responseTime && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-bible-500">
                        <Activity className="h-3 w-3" />
                        Response time: {result.responseTime}ms
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSingleProvider(provider)}
                    disabled={result.status === 'testing' || !isConfigured}
                  >
                    {result.status === 'testing' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Test'
                    )}
                  </Button>

                  {result.status === 'success' && !isCurrent && (
                    <Button
                      size="sm"
                      onClick={() => handleSetProvider(provider)}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 bg-gradient-to-br from-bible-50 to-blue-50 border-bible-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-bible-900 text-white rounded-lg">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-bible-900">Configuration Guide</h3>
            <div className="text-sm text-bible-600 mt-2 space-y-2">
              <p>
                <strong>MegaLLM:</strong> Your API key is already configured and working.
              </p>
              <p>
                <strong>OpenRouter:</strong> Add your API key to the <code className="bg-white px-1 rounded">.env</code> file:
                <code className="block mt-1 bg-white p-2 rounded text-xs">
                  VITE_OPENROUTER_API_KEY=sk-or-v1-...
                </code>
              </p>
              <p className="text-xs text-bible-500 mt-2">
                Get your OpenRouter API key from: <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-xs text-bible-500">
          Test results are stored securely and used to track performance over time
        </p>
      </div>
    </div>
  );
};
