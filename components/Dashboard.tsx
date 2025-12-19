import React, { useState, useEffect } from 'react';
import { SermonData } from '@/types';
import { CommentarySynthesizer } from '@/components/CommentarySynthesizer';
import { IllustrationFinder } from '@/components/IllustrationFinder';
import { CrossReferenceEngine } from '@/components/CrossReferenceEngine';
import { OutlineGenerator } from '@/components/OutlineGenerator';
import { EngagementGenerator } from '@/components/EngagementGenerator';
import { SermonEditor } from '@/components/SermonEditor';
import { RichTextEditor } from '@/components/RichTextEditor';
import { GreekHebrewLexicon } from '@/components/GreekHebrewLexicon';
import { HistoricalContext } from '@/components/HistoricalContext';
import { TheologicalPerspectives } from '@/components/TheologicalPerspectives';
import { ApplicationBuilder } from '@/components/ApplicationBuilder';
import { ParallelPassages } from '@/components/ParallelPassages';
import { SermonSeriesBuilder } from '@/components/SermonSeriesBuilder';
import { ExegeticalNotes } from '@/components/ExegeticalNotes';
import { TaggingSystem } from '@/components/TaggingSystem';
import { SermonVersioning } from '@/components/SermonVersioning';
import { EmailSharing } from '@/components/EmailSharing';
import { PowerPointExport } from '@/components/PowerPointExport';
import { TeamSharing } from '@/components/TeamSharing';
import { CalendarIntegration } from '@/components/CalendarIntegration';
import { AudioTranscription } from '@/components/AudioTranscription';
import { SermonCoach } from '@/components/SermonCoach';
import { PodiumMode } from '@/components/PodiumMode';
import { ContentRepurposer } from '@/components/ContentRepurposer';
import { 
  ChevronLeft, 
  BookOpen, 
  Languages, 
  Landmark, 
  GraduationCap,
  Link2,
  GitCompare,
  Lightbulb,
  Target,
  MessageSquare,
  FileText,
  PenLine,
  LayoutList,
  Calendar,
  Presentation,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { saveSermon, addSermonVersion, getSermonVersions, restoreSermonVersion, deleteSermonVersion, updateSermonTags, scheduleSermon, getScheduledSermons, removeScheduledSermon } from '@/services/storageService';

interface DashboardProps {
  data: SermonData;
  onBack: () => void;
}

type ToolCategory = 'study' | 'connect' | 'craft';
type StudyTool = 'commentary' | 'lexicon' | 'context' | 'exegesis';
type ConnectTool = 'crossref' | 'parallels' | 'theology';
type CraftTool = 'illustrations' | 'applications' | 'engagement';

export const Dashboard: React.FC<DashboardProps> = ({ data, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('study');
  const [studyTool, setStudyTool] = useState<StudyTool>('commentary');
  const [connectTool, setConnectTool] = useState<ConnectTool>('crossref');
  const [craftTool, setCraftTool] = useState<CraftTool>('illustrations');
  const [rightTab, setRightTab] = useState<'outline' | 'notes' | 'tags' | 'versions'>('outline');
  const [currentNotes, setCurrentNotes] = useState(data.notes || '');
  const [currentId, setCurrentId] = useState(data.id);
  const [showSeriesBuilder, setShowSeriesBuilder] = useState(false);
  const [useRichEditor, setUseRichEditor] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [scheduledSermons, setScheduledSermons] = useState<any[]>([]);
  const [showPodiumMode, setShowPodiumMode] = useState(false);

  useEffect(() => {
    setCurrentNotes(data.notes || '');
    setCurrentId(data.id);
    if (data.id) {
      setVersions(getSermonVersions(data.id));
      setScheduledSermons(getScheduledSermons());
    }
  }, [data]);

  const handleSaveNotes = (newContent: string) => {
    setCurrentNotes(newContent);
    const saved = saveSermon({
      id: currentId,
      scripture: data.scripture,
      language: data.language,
      notes: newContent
    });
    if (!currentId) {
      setCurrentId(saved.id);
    }
    // Add version
    if (currentId) {
      addSermonVersion(currentId, newContent, 'Auto-saved');
      setVersions(getSermonVersions(currentId));
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    if (currentId) {
      updateSermonTags(currentId, newTags);
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    if (currentId) {
      restoreSermonVersion(currentId, versionId);
      const version = versions.find(v => v.id === versionId);
      if (version) {
        setCurrentNotes(version.content);
      }
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (currentId) {
      deleteSermonVersion(currentId, versionId);
      setVersions(getSermonVersions(currentId));
    }
  };

  const handleAddTeamMember = (email: string, role: 'editor' | 'viewer') => {
    const newMember = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role,
      addedAt: new Date().toISOString(),
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
  };

  const handleScheduleSermon = (date: string, scripture: string, title?: string) => {
    const scheduled = scheduleSermon(date, scripture, title);
    setScheduledSermons(getScheduledSermons());
  };

  const handleRemoveSchedule = (id: string) => {
    removeScheduledSermon(id);
    setScheduledSermons(getScheduledSermons());
  };

  const handleTranscriptionComplete = (text: string) => {
    setCurrentNotes(currentNotes + '\n\n' + text);
    handleSaveNotes(currentNotes + '\n\n' + text);
  };

  const categories = [
    { id: 'study' as ToolCategory, label: 'Study', icon: BookOpen },
    { id: 'connect' as ToolCategory, label: 'Connect', icon: Link2 },
    { id: 'craft' as ToolCategory, label: 'Craft', icon: PenLine },
  ];

  const studyTools = [
    { id: 'commentary' as StudyTool, label: 'Commentary', icon: BookOpen },
    { id: 'lexicon' as StudyTool, label: 'Greek/Hebrew', icon: Languages },
    { id: 'context' as StudyTool, label: 'Historical', icon: Landmark },
    { id: 'exegesis' as StudyTool, label: 'Exegesis', icon: GraduationCap },
  ];

  const connectTools = [
    { id: 'crossref' as ConnectTool, label: 'Cross-Refs', icon: Link2 },
    { id: 'parallels' as ConnectTool, label: 'Parallels', icon: GitCompare },
    { id: 'theology' as ConnectTool, label: 'Theology', icon: BookOpen },
  ];

  const craftTools = [
    { id: 'illustrations' as CraftTool, label: 'Illustrations', icon: Lightbulb },
    { id: 'applications' as CraftTool, label: 'Applications', icon: Target },
    { id: 'engagement' as CraftTool, label: 'Engagement', icon: MessageSquare },
  ];

  const getCurrentTools = () => {
    switch (activeCategory) {
      case 'study': return studyTools;
      case 'connect': return connectTools;
      case 'craft': return craftTools;
    }
  };

  const getCurrentTool = () => {
    switch (activeCategory) {
      case 'study': return studyTool;
      case 'connect': return connectTool;
      case 'craft': return craftTool;
    }
  };

  const setCurrentTool = (tool: string) => {
    switch (activeCategory) {
      case 'study': setStudyTool(tool as StudyTool); break;
      case 'connect': setConnectTool(tool as ConnectTool); break;
      case 'craft': setCraftTool(tool as CraftTool); break;
    }
  };

  const renderToolContent = () => {
    if (activeCategory === 'study') {
      switch (studyTool) {
        case 'commentary': return <CommentarySynthesizer scripture={data.scripture} language={data.language} />;
        case 'lexicon': return <GreekHebrewLexicon scripture={data.scripture} language={data.language} />;
        case 'context': return <HistoricalContext scripture={data.scripture} language={data.language} />;
        case 'exegesis': return <ExegeticalNotes scripture={data.scripture} language={data.language} />;
      }
    }
    if (activeCategory === 'connect') {
      switch (connectTool) {
        case 'crossref': return <CrossReferenceEngine scripture={data.scripture} language={data.language} />;
        case 'parallels': return <ParallelPassages scripture={data.scripture} language={data.language} />;
        case 'theology': return <TheologicalPerspectives scripture={data.scripture} language={data.language} />;
      }
    }
    if (activeCategory === 'craft') {
      switch (craftTool) {
        case 'illustrations': return <IllustrationFinder language={data.language} />;
        case 'applications': return <ApplicationBuilder scripture={data.scripture} language={data.language} />;
        case 'engagement': return <EngagementGenerator scripture={data.scripture} language={data.language} />;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-bible-50 overflow-hidden font-sans">
      {/* Clean Header */}
      <header className="bg-white border-b border-bible-200 shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack} 
                className="flex items-center gap-1 text-bible-500 hover:text-bible-900 transition-colors text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Library</span>
              </button>
              <div className="h-4 w-px bg-bible-200" />
              <div>
                <h1 className="font-serif text-lg font-semibold text-bible-900">{data.scripture}</h1>
                {data.theme && (
                  <p className="text-xs text-bible-500 mt-0.5">{data.theme}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-bible-500 bg-bible-100 px-2 py-1 rounded">
                {data.language}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <EmailSharing sermonTitle={data.scripture} sermonContent={currentNotes} />
            <PowerPointExport 
              sermonTitle={data.scripture} 
              scripture={data.scripture}
              outline=""
              notes={currentNotes}
            />
            <TeamSharing 
              sermonId={currentId || ''}
              teamMembers={teamMembers}
              onAddMember={handleAddTeamMember}
              onRemoveMember={handleRemoveTeamMember}
            />
            <CalendarIntegration 
              scheduledSermons={scheduledSermons}
              onScheduleSermon={handleScheduleSermon}
              onRemoveSchedule={handleRemoveSchedule}
            />
            <AudioTranscription onTranscriptionComplete={handleTranscriptionComplete} />
            <SermonCoach sermonContent={currentNotes} scripture={data.scripture} />
            <Button
              onClick={() => setShowSeriesBuilder(!showSeriesBuilder)}
              variant="outline"
              size="sm"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Series
            </Button>
                  <Button
                    onClick={() => setUseRichEditor(!useRichEditor)}
                    variant="outline"
                    size="sm"
                  >
                    {useRichEditor ? 'Simple Editor' : 'Rich Editor'}
                  </Button>
                  <ContentRepurposer
                    sermonTitle={data.scripture}
                    scripture={data.scripture}
                    sermonContent={currentNotes}
                    language={data.language}
                  />
                  <Button
                    onClick={() => setShowPodiumMode(true)}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Presentation className="h-3.5 w-3.5 mr-1.5" />
                    Podium Mode
                  </Button>
                </div>
              </div>
            </header>

            {/* Podium Mode Overlay */}
            {showPodiumMode && (
              <PodiumMode
                sermonTitle={data.scripture}
                scripture={data.scripture}
                content={currentNotes}
                onClose={() => setShowPodiumMode(false)}
              />
            )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          
          {/* Left Panel - Research Tools */}
          <div className="col-span-4 border-r border-bible-200 flex flex-col bg-white">
            {/* Category Tabs */}
            <div className="flex border-b border-bible-200 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'text-bible-900 border-b-2 border-bible-900 bg-bible-50'
                      : 'text-bible-500 hover:text-bible-700 hover:bg-bible-50'
                  }`}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tool Selector */}
            <div className="px-3 py-2 border-b border-bible-100 bg-bible-50/50 shrink-0">
              <div className="flex gap-1">
                {getCurrentTools().map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      getCurrentTool() === tool.id
                        ? 'bg-bible-900 text-white'
                        : 'text-bible-600 hover:bg-bible-100'
                    }`}
                  >
                    <tool.icon className="h-3 w-3" />
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool Content */}
            <div className="flex-1 overflow-hidden">
              {renderToolContent()}
            </div>
          </div>

          {/* Center Panel - Structure Builder */}
          <div className="col-span-4 border-r border-bible-200 flex flex-col bg-white">
            {showSeriesBuilder ? (
              <>
                <div className="px-4 py-3 border-b border-bible-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-bible-500" />
                    <h2 className="text-sm font-medium text-bible-900">Sermon Series</h2>
                  </div>
                  <button 
                    onClick={() => setShowSeriesBuilder(false)}
                    className="text-xs text-bible-500 hover:text-bible-700"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SermonSeriesBuilder language={data.language} />
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-bible-200 flex items-center gap-2 shrink-0">
                  <LayoutList className="h-4 w-4 text-bible-500" />
                  <h2 className="text-sm font-medium text-bible-900">Structure Builder</h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <OutlineGenerator scripture={data.scripture} language={data.language} />
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Notes */}
          <div className="col-span-4 flex flex-col bg-white">
            {/* Tabs */}
            <div className="flex border-b border-bible-200 shrink-0">
              <button
                onClick={() => setRightTab('outline')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  rightTab === 'outline'
                    ? 'text-bible-900 border-b-2 border-bible-900'
                    : 'text-bible-500 hover:text-bible-700'
                }`}
              >
                <FileText className="h-4 w-4" />
                Quick Outline
              </button>
              <button
                onClick={() => setRightTab('notes')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  rightTab === 'notes'
                    ? 'text-bible-900 border-b-2 border-bible-900'
                    : 'text-bible-500 hover:text-bible-700'
                }`}
              >
                <PenLine className="h-4 w-4" />
                My Notes
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {rightTab === 'outline' && (
                <div className="h-full overflow-auto p-4">
                  <OutlineGenerator scripture={data.scripture} language={data.language} />
                </div>
              )}
              {rightTab === 'notes' && (
                <SermonEditor
                  initialContent={currentNotes}
                  onSave={handleSaveNotes}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
