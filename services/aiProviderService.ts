import * as MegaLLM from './megaLLMService';
import * as OpenRouter from './openRouterService';
import { supabase } from './supabaseClient';

export enum AIProvider {
  MEGALLM = 'megallm',
  OPENROUTER = 'openrouter',
  GEMINI = 'gemini',
}

export interface ProviderStatus {
  provider: AIProvider;
  isAvailable: boolean;
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
  responseTime?: number;
}

export interface AIRequestMetrics {
  provider: AIProvider;
  feature: string;
  scripture: string;
  responseTime: number;
  tokenCount: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

const providerConfig = {
  [AIProvider.MEGALLM]: {
    name: 'MegaLLM',
    apiKey: import.meta.env.VITE_MEGALLM_API_KEY,
    service: MegaLLM,
  },
  [AIProvider.OPENROUTER]: {
    name: 'OpenRouter',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    service: OpenRouter,
  },
  [AIProvider.GEMINI]: {
    name: 'Gemini',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    service: null,
  },
};

let providerStatusCache: Record<AIProvider, ProviderStatus> = {} as any;
let currentProvider: AIProvider = AIProvider.MEGALLM;

export const setCurrentProvider = (provider: AIProvider) => {
  currentProvider = provider;
  localStorage.setItem('preferred_ai_provider', provider);
};

export const getCurrentProvider = (): AIProvider => {
  const stored = localStorage.getItem('preferred_ai_provider');
  if (stored && Object.values(AIProvider).includes(stored as AIProvider)) {
    return stored as AIProvider;
  }
  return currentProvider;
};

export const isProviderConfigured = (provider: AIProvider): boolean => {
  const config = providerConfig[provider];
  return !!(config && config.apiKey && config.apiKey.length > 10);
};

export const testProviderConnection = async (provider: AIProvider): Promise<ProviderStatus> => {
  const startTime = Date.now();
  const status: ProviderStatus = {
    provider,
    isAvailable: false,
    isHealthy: false,
    lastChecked: new Date(),
  };

  if (!isProviderConfigured(provider)) {
    status.error = 'API key not configured';
    return status;
  }

  try {
    const config = providerConfig[provider];
    const testMessages = [
      { role: 'system' as const, content: 'You are a test assistant.' },
      { role: 'user' as const, content: 'Reply with just the word "OK"' }
    ];

    let response: string;
    if (provider === AIProvider.MEGALLM) {
      response = await MegaLLM.callMegaLLM(testMessages, { max_tokens: 10 });
    } else if (provider === AIProvider.OPENROUTER) {
      response = await OpenRouter.callOpenRouter(testMessages, { max_tokens: 10 });
    } else {
      throw new Error('Provider not implemented');
    }

    const responseTime = Date.now() - startTime;

    if (response && response.length > 0) {
      status.isAvailable = true;
      status.isHealthy = true;
      status.responseTime = responseTime;
    } else {
      status.error = 'Empty response received';
    }
  } catch (error: any) {
    status.error = error.message || 'Connection test failed';
    status.responseTime = Date.now() - startTime;
  }

  providerStatusCache[provider] = status;
  return status;
};

export const getAllProviderStatuses = async (): Promise<ProviderStatus[]> => {
  const providers = [AIProvider.MEGALLM, AIProvider.OPENROUTER];
  const results = await Promise.allSettled(
    providers.map(provider => testProviderConnection(provider))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        provider: providers[index],
        isAvailable: false,
        isHealthy: false,
        lastChecked: new Date(),
        error: 'Test failed',
      };
    }
  });
};

export const getHealthyProvider = async (): Promise<AIProvider | null> => {
  const preferred = getCurrentProvider();

  if (providerStatusCache[preferred]?.isHealthy) {
    return preferred;
  }

  const status = await testProviderConnection(preferred);
  if (status.isHealthy) {
    return preferred;
  }

  const allProviders = [AIProvider.MEGALLM, AIProvider.OPENROUTER];
  for (const provider of allProviders) {
    if (provider === preferred) continue;

    const status = await testProviderConnection(provider);
    if (status.isHealthy) {
      return provider;
    }
  }

  return null;
};

export const callAI = async (
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: any = {},
  preferredProvider?: AIProvider
): Promise<{ content: string; provider: AIProvider; metrics: Partial<AIRequestMetrics> }> => {
  const startTime = Date.now();
  const provider = preferredProvider || getCurrentProvider();

  try {
    let response: string;

    if (provider === AIProvider.MEGALLM) {
      response = await MegaLLM.callMegaLLM(messages, options);
    } else if (provider === AIProvider.OPENROUTER) {
      response = await OpenRouter.callOpenRouter(messages, options);
    } else {
      throw new Error('Provider not available');
    }

    const responseTime = Date.now() - startTime;

    return {
      content: response,
      provider,
      metrics: {
        provider,
        responseTime,
        success: true,
        timestamp: new Date(),
      },
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    if (!preferredProvider && provider !== AIProvider.OPENROUTER) {
      try {
        const fallbackProvider = provider === AIProvider.MEGALLM
          ? AIProvider.OPENROUTER
          : AIProvider.MEGALLM;

        return await callAI(messages, options, fallbackProvider);
      } catch (fallbackError) {
        // Both failed
      }
    }

    throw {
      error: error.message || 'AI request failed',
      provider,
      metrics: {
        provider,
        responseTime,
        success: false,
        error: error.message,
        timestamp: new Date(),
      },
    };
  }
};

export const logTestResult = async (metrics: AIRequestMetrics): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('ai_test_results').insert({
      user_id: user?.id,
      provider: metrics.provider,
      feature: metrics.feature,
      scripture: metrics.scripture,
      response_time_ms: metrics.responseTime,
      token_count: metrics.tokenCount,
      success: metrics.success,
      error_message: metrics.error,
      tested_at: metrics.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Failed to log test result:', error);
  }
};

export const getProviderMetrics = async (
  provider?: AIProvider,
  days: number = 7
): Promise<any> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    let query = supabase
      .from('ai_test_results')
      .select('*')
      .eq('user_id', user.id)
      .gte('tested_at', sinceDate.toISOString())
      .order('tested_at', { ascending: false });

    if (provider) {
      query = query.eq('provider', provider);
    }

    const { data, error } = await query;

    if (error) throw error;

    const metrics = {
      totalRequests: data?.length || 0,
      successfulRequests: data?.filter(r => r.success).length || 0,
      failedRequests: data?.filter(r => !r.success).length || 0,
      avgResponseTime: data?.length
        ? data.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / data.length
        : 0,
      successRate: data?.length
        ? (data.filter(r => r.success).length / data.length) * 100
        : 0,
      byFeature: {} as Record<string, any>,
    };

    if (data) {
      const features = [...new Set(data.map(r => r.feature))];
      features.forEach(feature => {
        const featureData = data.filter(r => r.feature === feature);
        metrics.byFeature[feature] = {
          requests: featureData.length,
          avgResponseTime: featureData.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / featureData.length,
          successRate: (featureData.filter(r => r.success).length / featureData.length) * 100,
        };
      });
    }

    return metrics;
  } catch (error) {
    console.error('Failed to get provider metrics:', error);
    return null;
  }
};

export const compareProviders = async (
  feature: string,
  scripture: string,
  language: 'English' | 'Tamil' = 'English'
): Promise<{
  megallm: { content: string; metrics: Partial<AIRequestMetrics> };
  openrouter: { content: string; metrics: Partial<AIRequestMetrics> };
}> => {
  const testPrompt = `Provide a brief analysis of "${scripture}" for ${feature}.`;
  const messages = [
    { role: 'system' as const, content: 'You are a helpful biblical research assistant.' },
    { role: 'user' as const, content: testPrompt }
  ];

  const [megallmResult, openrouterResult] = await Promise.allSettled([
    callAI(messages, { max_tokens: 500 }, AIProvider.MEGALLM),
    callAI(messages, { max_tokens: 500 }, AIProvider.OPENROUTER),
  ]);

  return {
    megallm: megallmResult.status === 'fulfilled'
      ? megallmResult.value
      : { content: 'Failed to generate', metrics: { success: false, error: 'Request failed' } },
    openrouter: openrouterResult.status === 'fulfilled'
      ? openrouterResult.value
      : { content: 'Failed to generate', metrics: { success: false, error: 'Request failed' } },
  };
};
