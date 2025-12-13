import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Heart, Users, Calendar, Gift, Cross, Sparkles } from 'lucide-react';

interface SermonTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  suggestedScriptures: string[];
  outlineType: string;
}

interface SermonTemplatesProps {
  onSelectTemplate: (template: SermonTemplate) => void;
  onClose: () => void;
}

export const SermonTemplates: React.FC<SermonTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const templates: SermonTemplate[] = [
    {
      id: 'sunday-expository',
      title: 'Sunday Expository',
      description: 'Deep verse-by-verse teaching for regular Sunday service',
      icon: <BookOpen className="h-6 w-6" />,
      suggestedScriptures: ['Romans 8:28-39', 'Ephesians 2:1-10', 'John 3:16-21'],
      outlineType: 'Expository'
    },
    {
      id: 'topical-series',
      title: 'Topical Series',
      description: 'Theme-based message connecting multiple passages',
      icon: <Sparkles className="h-6 w-6" />,
      suggestedScriptures: ['Faith: Hebrews 11', 'Love: 1 Corinthians 13', 'Hope: Romans 15:13'],
      outlineType: 'Topical'
    },
    {
      id: 'evangelistic',
      title: 'Evangelistic Message',
      description: 'Gospel-centered message for outreach and salvation',
      icon: <Heart className="h-6 w-6" />,
      suggestedScriptures: ['John 3:16', 'Romans 10:9-13', 'Acts 16:31'],
      outlineType: '3-Point'
    },
    {
      id: 'funeral',
      title: 'Funeral Service',
      description: 'Comforting message for memorial and celebration of life',
      icon: <Cross className="h-6 w-6" />,
      suggestedScriptures: ['Psalm 23', 'John 14:1-6', '1 Thessalonians 4:13-18'],
      outlineType: 'Narrative'
    },
    {
      id: 'wedding',
      title: 'Wedding Ceremony',
      description: 'Joyful message celebrating marriage covenant',
      icon: <Gift className="h-6 w-6" />,
      suggestedScriptures: ['1 Corinthians 13', 'Ephesians 5:22-33', 'Genesis 2:18-24'],
      outlineType: '3-Point'
    },
    {
      id: 'youth',
      title: 'Youth Service',
      description: 'Engaging message for young people with modern applications',
      icon: <Users className="h-6 w-6" />,
      suggestedScriptures: ['Proverbs 3:5-6', 'Jeremiah 29:11', 'Philippians 4:13'],
      outlineType: 'Topical'
    },
    {
      id: 'easter',
      title: 'Easter Sunday',
      description: 'Resurrection-focused message for Easter celebration',
      icon: <Calendar className="h-6 w-6" />,
      suggestedScriptures: ['Luke 24:1-12', 'Matthew 28:1-10', '1 Corinthians 15:1-11'],
      outlineType: 'Narrative'
    },
    {
      id: 'christmas',
      title: 'Christmas Service',
      description: 'Incarnation-centered message for Christmas celebration',
      icon: <Gift className="h-6 w-6" />,
      suggestedScriptures: ['Luke 2:1-20', 'John 1:1-14', 'Isaiah 9:6-7'],
      outlineType: 'Narrative'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-bible-800 to-bible-700 p-6 text-white">
          <h2 className="text-2xl font-serif font-bold mb-2">Sermon Templates</h2>
          <p className="text-bible-200 text-sm">Quick-start your sermon preparation with proven structures</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-bible-200 rounded-xl p-5 hover:border-bible-400 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-bible-100 rounded-lg text-bible-700 group-hover:bg-bible-700 group-hover:text-white transition-colors">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-bible-900 text-lg mb-1">{template.title}</h3>
                    <p className="text-bible-500 text-sm mb-3">{template.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-bible-600 uppercase tracking-wide">Suggested Passages:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.suggestedScriptures.map((scripture, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-bible-50 text-bible-700 px-2 py-1 rounded border border-bible-200"
                          >
                            {scripture}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-bible-500 mt-2">
                        <span className="font-semibold">Outline Style:</span> {template.outlineType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-bible-200 p-4 bg-bible-50 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
