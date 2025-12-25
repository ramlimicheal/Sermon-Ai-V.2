import React, { useState } from 'react';
import { Activity, BarChart3, GitCompare, Settings } from 'lucide-react';
import { AIProviderTesting } from './AIProviderTesting';
import { AIProviderComparison } from './AIProviderComparison';
import { AIPerformanceMetrics } from './AIPerformanceMetrics';

type TabType = 'testing' | 'comparison' | 'metrics';

export const AITestingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('testing');

  const tabs = [
    { id: 'testing' as TabType, label: 'API Testing', icon: Settings },
    { id: 'comparison' as TabType, label: 'Side-by-Side', icon: GitCompare },
    { id: 'metrics' as TabType, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="border-b border-bible-200 bg-white px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 py-4">
            <Activity className="h-5 w-5 text-bible-900" />
            <h1 className="text-lg font-bold text-bible-900">AI Testing Hub</h1>
          </div>

          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                    border-b-2
                    ${
                      activeTab === tab.id
                        ? 'border-bible-900 text-bible-900'
                        : 'border-transparent text-bible-600 hover:text-bible-900 hover:border-bible-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'testing' && <AIProviderTesting />}
        {activeTab === 'comparison' && <AIProviderComparison />}
        {activeTab === 'metrics' && <AIPerformanceMetrics />}
      </div>
    </div>
  );
};
