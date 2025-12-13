import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Target, Users, Heart, Briefcase, Home, Loader2, Plus } from 'lucide-react';
import { generateApplications } from '@/services/geminiService';
import { Language } from '@/types';

interface ApplicationBuilderProps {
  scripture: string;
  language: Language;
}

interface Application {
  audience: string;
  application: string;
  actionStep: string;
}

export const ApplicationBuilder: React.FC<ApplicationBuilderProps> = ({ scripture, language }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateApplications(scripture, language);
      setApplications(result);
    } catch (error) {
      console.error('Error generating applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const audienceIcons: Record<string, React.ReactNode> = {
    'Youth': <Users className="h-4 w-4" />,
    'Families': <Home className="h-4 w-4" />,
    'Singles': <Heart className="h-4 w-4" />,
    'Professionals': <Briefcase className="h-4 w-4" />,
    'Seniors': <Users className="h-4 w-4" />,
    'General': <Target className="h-4 w-4" />
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-bible-100 flex items-center justify-between shrink-0 bg-bible-50/50">
        <span className="text-xs font-medium text-bible-500">Practical Applications</span>
        {applications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={loading} className="h-7 px-2 text-xs">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'More'}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-8 w-8 text-bible-300 mb-3" />
            <p className="text-sm text-bible-500 mb-4">Generate practical applications</p>
            <Button onClick={handleGenerate} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, idx) => (
              <div key={idx} className="p-3 rounded-md border border-bible-200 bg-white">
                <div className="flex items-center gap-2 mb-2 text-bible-500">
                  {audienceIcons[app.audience] || <Target className="h-4 w-4" />}
                  <span className="text-xs font-medium">{app.audience}</span>
                </div>
                <p className="text-sm text-bible-700 mb-2">{app.application}</p>
                <div className="text-xs text-bible-600 bg-bible-50 p-2 rounded border-l-2 border-bible-400">
                  <span className="font-medium">Action:</span> {app.actionStep}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
