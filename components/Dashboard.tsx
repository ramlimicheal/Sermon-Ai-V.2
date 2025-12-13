
import React, { useState, useEffect } from 'react';
import { SermonData } from '../types';
import { CommentarySynthesizer } from './CommentarySynthesizer';
import { IllustrationFinder } from './IllustrationFinder';
import { CrossReferenceEngine } from './CrossReferenceEngine';
import { OutlineGenerator } from './OutlineGenerator';
import { EngagementGenerator } from './EngagementGenerator';
import { SermonEditor } from './SermonEditor';
import { ChevronRight, Link2, Lightbulb, Smile, Home, PenTool, LayoutTemplate } from 'lucide-react';
import { Button } from './ui/Button';
import { saveSermon } from '../services/storageService';

interface DashboardProps {
  data: SermonData;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onBack }) => {
  const [activeToolTab, setActiveToolTab] = useState<'connections' | 'illustrations' | 'engagement'>('connections');
  // Changed default to 'outline' for better first-impression visibility of the Structure Builder
  const [rightColumnTab, setRightColumnTab] = useState<'outline' | 'notes'>('outline');
  const [currentNotes, setCurrentNotes] = useState(data.notes || '');
  const [currentId, setCurrentId] = useState(data.id);

  // If data changes (e.g. from saved sermon), update internal state
  useEffect(() => {
      setCurrentNotes(data.notes || '');
      setCurrentId(data.id);
  }, [data]);

  const handleSaveNotes = (newContent: string) => {
    setCurrentNotes(newContent);
    // Autosave functionality
    const saved = saveSermon({
        id: currentId,
        scripture: data.scripture,
        language: data.language,
        notes: newContent
    });
    // If it was a new sermon, we now have an ID
    if (!currentId) {
        setCurrentId(saved.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bible-50/50 overflow-hidden font-sans">
      {/* SaaS Header */}
      <header className="bg-white border-b border-bible-200 shrink-0 z-20 shadow-sm">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center text-sm text-bible-500">
             <button onClick={onBack} className="flex items-center hover:text-bible-900 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Library
             </button>
             <ChevronRight className="h-4 w-4 mx-2 text-bible-300" />
             <span className="font-medium text-bible-900 bg-bible-50 px-3 py-1 rounded-full border border-bible-100 font-serif">{data.scripture}</span>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center text-xs gap-2 px-3 py-1.5 bg-bible-50 rounded-full border border-bible-100 text-bible-600">
                <span className={`w-2 h-2 rounded-full ${data.language === 'Tamil' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                {data.language} Mode
             </div>
          </div>
        </div>
      </header>

      {/* Main Workspace - 3 Column Layout */}
      <main className="flex-1 overflow-hidden p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Column 1: Context & Tools (Tabbed Sidebar) */}
          <div className="lg:col-span-3 flex flex-col h-full overflow-hidden bg-white rounded-xl border border-bible-200 shadow-sm">
             {/* Tabs */}
             <div className="flex border-b border-bible-200">
                <button 
                  onClick={() => setActiveToolTab('connections')}
                  className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${activeToolTab === 'connections' ? 'border-bible-600 text-bible-900 bg-bible-50/50' : 'border-transparent text-bible-500 hover:text-bible-700'}`}
                >
                  <Link2 className="h-4 w-4 mx-auto mb-1" />
                  Connect
                </button>
                <button 
                  onClick={() => setActiveToolTab('illustrations')}
                  className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${activeToolTab === 'illustrations' ? 'border-yellow-500 text-bible-900 bg-yellow-50/30' : 'border-transparent text-bible-500 hover:text-bible-700'}`}
                >
                  <Lightbulb className="h-4 w-4 mx-auto mb-1" />
                  Illustrate
                </button>
                 <button 
                  onClick={() => setActiveToolTab('engagement')}
                  className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${activeToolTab === 'engagement' ? 'border-orange-500 text-bible-900 bg-orange-50/30' : 'border-transparent text-bible-500 hover:text-bible-700'}`}
                >
                  <Smile className="h-4 w-4 mx-auto mb-1" />
                  Engage
                </button>
             </div>

             {/* Tab Content */}
             <div className="flex-1 overflow-hidden">
                 <div className={`h-full ${activeToolTab === 'connections' ? 'block' : 'hidden'}`}>
                    <CrossReferenceEngine scripture={data.scripture} language={data.language} />
                 </div>
                 <div className={`h-full ${activeToolTab === 'illustrations' ? 'block' : 'hidden'}`}>
                    <IllustrationFinder language={data.language} />
                 </div>
                 <div className={`h-full ${activeToolTab === 'engagement' ? 'block' : 'hidden'}`}>
                    <EngagementGenerator scripture={data.scripture} language={data.language} />
                 </div>
             </div>
          </div>
          
          {/* Column 2: Deep Study (5 cols) - The main reading pane */}
          <div className="lg:col-span-5 h-full overflow-hidden flex flex-col min-h-[500px]">
            <CommentarySynthesizer scripture={data.scripture} language={data.language} />
          </div>

          {/* Column 3: Construction (4 cols) - Tabs for AI Outline and User Notes */}
          <div className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-white rounded-xl border border-bible-200 shadow-sm">
             <div className="flex border-b border-bible-200 bg-bible-50/30">
                <button 
                  onClick={() => setRightColumnTab('outline')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide text-center transition-all border-b-2 ${rightColumnTab === 'outline' ? 'border-bible-800 text-bible-900 bg-white' : 'border-transparent text-bible-400 hover:text-bible-600'}`}
                >
                   <span className="flex items-center justify-center gap-2">
                       <LayoutTemplate className="h-3.5 w-3.5" /> AI Structure
                   </span>
                </button>
                <button 
                  onClick={() => setRightColumnTab('notes')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide text-center transition-all border-b-2 ${rightColumnTab === 'notes' ? 'border-bible-800 text-bible-900 bg-white' : 'border-transparent text-bible-400 hover:text-bible-600'}`}
                >
                   <span className="flex items-center justify-center gap-2">
                       <PenTool className="h-3.5 w-3.5" /> My Sermon Notes
                   </span>
                </button>
             </div>

             <div className="flex-1 overflow-hidden">
                <div className={`h-full ${rightColumnTab === 'outline' ? 'block' : 'hidden'}`}>
                    <OutlineGenerator scripture={data.scripture} language={data.language} />
                </div>
                <div className={`h-full ${rightColumnTab === 'notes' ? 'block' : 'hidden'}`}>
                    <SermonEditor initialContent={currentNotes} onSave={handleSaveNotes} />
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};
