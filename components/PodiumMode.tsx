import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2,
  Minimize2,
  Clock,
  Eye,
  EyeOff,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

interface PodiumModeProps {
  sermonTitle: string;
  scripture: string;
  content: string;
  onClose: () => void;
}

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'intro' | 'point' | 'illustration' | 'application' | 'conclusion';
}

export const PodiumMode: React.FC<PodiumModeProps> = ({ 
  sermonTitle, 
  scripture, 
  content, 
  onClose 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fontSize, setFontSize] = useState(32);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sections: Section[] = parseContentToSections(content);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSection();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSection();
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFontSize(prev => Math.min(prev + 4, 72));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFontSize(prev => Math.max(prev - 4, 16));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, sections.length]);

  const nextSection = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  }, [currentSection, sections.length]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  }, [currentSection]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const bgColor = isDarkMode ? 'bg-gray-950' : 'bg-stone-50';
  const textColor = isDarkMode ? 'text-white' : 'text-stone-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-stone-500';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-stone-200';

  return (
    <div className={`fixed inset-0 z-50 ${bgColor} ${textColor} flex flex-col`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${mutedColor}`}
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{sermonTitle}</h1>
            <p className={`text-sm ${mutedColor}`}>{scripture}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showTimer && (
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-stone-100'}`}>
              <Clock className={`h-4 w-4 ${mutedColor}`} />
              <span className="font-mono text-xl font-medium">{formatTime(elapsedTime)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1.5 rounded hover:bg-gray-700/50 transition-colors`}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={resetTimer}
                  className={`p-1.5 rounded hover:bg-gray-700/50 transition-colors`}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${mutedColor}`}
          >
            <Settings className="h-5 w-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${mutedColor}`}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-20 right-6 w-72 rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border ${borderColor} p-4 z-10`}>
          <h3 className="font-medium mb-4">Display Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`text-sm ${mutedColor} mb-2 block`}>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="16"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-stone-100'}`}
              >
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Show Timer</span>
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-stone-100'}`}
              >
                {showTimer ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className={`mt-4 pt-4 border-t ${borderColor}`}>
            <p className={`text-xs ${mutedColor}`}>
              Keyboard shortcuts: Space/Right = Next, Left = Previous, F = Fullscreen, P = Play/Pause, Up/Down = Font size
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-12 py-8 overflow-hidden">
        <div className="max-w-4xl w-full">
          {sections.length > 0 && sections[currentSection] && (
            <div className="text-center animate-fade-in">
              {sections[currentSection].type !== 'intro' && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-stone-200 text-stone-600'
                }`}>
                  {sections[currentSection].type.charAt(0).toUpperCase() + sections[currentSection].type.slice(1)}
                </span>
              )}
              
              {sections[currentSection].title && (
                <h2 
                  className="font-serif font-medium mb-8"
                  style={{ fontSize: `${fontSize + 8}px`, lineHeight: 1.3 }}
                >
                  {sections[currentSection].title}
                </h2>
              )}
              
              <p 
                className={`leading-relaxed ${mutedColor}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              >
                {sections[currentSection].content}
              </p>
            </div>
          )}

          {sections.length === 0 && (
            <div className="text-center">
              <p className={`text-xl ${mutedColor}`}>
                No sermon content to display. Add notes to your sermon first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex items-center justify-between px-6 py-4 border-t ${borderColor}`}>
        <button
          onClick={prevSection}
          disabled={currentSection === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSection === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : `hover:${isDarkMode ? 'bg-gray-800' : 'bg-stone-100'}`
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        {/* Section Indicators */}
        <div className="flex items-center gap-2">
          {sections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSection(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSection 
                  ? (isDarkMode ? 'bg-white w-8' : 'bg-stone-900 w-8')
                  : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-stone-300 hover:bg-stone-400')
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSection}
          disabled={currentSection === sections.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentSection === sections.length - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : `hover:${isDarkMode ? 'bg-gray-800' : 'bg-stone-100'}`
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className={`h-1 ${isDarkMode ? 'bg-gray-800' : 'bg-stone-200'}`}>
        <div 
          className={`h-full transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-stone-900'}`}
          style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

function parseContentToSections(content: string): Section[] {
  if (!content || content.trim() === '') {
    return [{
      id: '1',
      title: 'Welcome',
      content: 'Your sermon content will appear here. Start by adding notes to your sermon.',
      type: 'intro'
    }];
  }

  const sections: Section[] = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentSection: Section | null = null;
  let sectionIndex = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      sectionIndex++;
      const title = trimmedLine.replace(/^#+\s*/, '');
      const type = detectSectionType(title, sectionIndex, lines.length);
      currentSection = {
        id: String(sectionIndex),
        title,
        content: '',
        type
      };
    } else if (trimmedLine.startsWith('### ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      sectionIndex++;
      currentSection = {
        id: String(sectionIndex),
        title: trimmedLine.replace(/^#+\s*/, ''),
        content: '',
        type: 'point'
      };
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? ' ' : '') + trimmedLine;
    } else {
      sectionIndex++;
      currentSection = {
        id: String(sectionIndex),
        title: '',
        content: trimmedLine,
        type: sectionIndex === 1 ? 'intro' : 'point'
      };
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    paragraphs.forEach((para, idx) => {
      sections.push({
        id: String(idx + 1),
        title: '',
        content: para.trim(),
        type: idx === 0 ? 'intro' : idx === paragraphs.length - 1 ? 'conclusion' : 'point'
      });
    });
  }

  return sections.length > 0 ? sections : [{
    id: '1',
    title: '',
    content: content,
    type: 'intro'
  }];
}

function detectSectionType(title: string, index: number, totalLines: number): Section['type'] {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('intro') || lowerTitle.includes('opening') || index === 1) {
    return 'intro';
  }
  if (lowerTitle.includes('conclusion') || lowerTitle.includes('closing') || lowerTitle.includes('summary')) {
    return 'conclusion';
  }
  if (lowerTitle.includes('illustration') || lowerTitle.includes('story') || lowerTitle.includes('example')) {
    return 'illustration';
  }
  if (lowerTitle.includes('application') || lowerTitle.includes('apply') || lowerTitle.includes('action')) {
    return 'application';
  }
  
  return 'point';
}
