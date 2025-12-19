import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Plus,
  Settings,
  BarChart3,
  BookOpen,
  Sparkles,
  Presentation,
  Share2,
  Download,
  Clock,
  Tag,
  Users,
  Mic,
  MessageSquare,
  Layers,
  ChevronRight,
  Command,
  CornerDownLeft,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'navigation' | 'actions' | 'ai' | 'export' | 'recent';
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onAction: (action: string) => void;
  recentSermons?: { id: string; title: string; date: string }[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAction,
  recentSermons = [],
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-library',
      title: 'Go to Library',
      description: 'View all your sermons',
      icon: <BookOpen className="h-4 w-4" />,
      shortcut: 'G L',
      category: 'navigation',
      action: () => onNavigate('dashboard'),
    },
    {
      id: 'nav-new',
      title: 'New Sermon',
      description: 'Start a new sermon',
      icon: <Plus className="h-4 w-4" />,
      shortcut: 'N',
      category: 'navigation',
      action: () => onNavigate('new'),
    },
    {
      id: 'nav-analytics',
      title: 'Analytics',
      description: 'View your sermon analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      shortcut: 'G A',
      category: 'navigation',
      action: () => onNavigate('analytics'),
    },
    {
      id: 'nav-settings',
      title: 'Settings',
      description: 'Manage your preferences',
      icon: <Settings className="h-4 w-4" />,
      shortcut: 'G S',
      category: 'navigation',
      action: () => onNavigate('profile'),
    },

    // Actions
    {
      id: 'action-podium',
      title: 'Enter Podium Mode',
      description: 'Present your sermon',
      icon: <Presentation className="h-4 w-4" />,
      shortcut: 'P',
      category: 'actions',
      action: () => onAction('podium'),
    },
    {
      id: 'action-repurpose',
      title: 'Repurpose Content',
      description: 'Transform sermon into social media, devotionals',
      icon: <Share2 className="h-4 w-4" />,
      shortcut: 'R',
      category: 'actions',
      action: () => onAction('repurpose'),
    },
    {
      id: 'action-export',
      title: 'Export Sermon',
      description: 'Download as PDF, Word, or PowerPoint',
      icon: <Download className="h-4 w-4" />,
      shortcut: 'E',
      category: 'export',
      action: () => onAction('export'),
    },
    {
      id: 'action-schedule',
      title: 'Schedule Sermon',
      description: 'Add to your preaching calendar',
      icon: <Clock className="h-4 w-4" />,
      category: 'actions',
      action: () => onAction('schedule'),
    },
    {
      id: 'action-tags',
      title: 'Manage Tags',
      description: 'Organize with tags and categories',
      icon: <Tag className="h-4 w-4" />,
      category: 'actions',
      action: () => onAction('tags'),
    },
    {
      id: 'action-team',
      title: 'Share with Team',
      description: 'Collaborate with your ministry team',
      icon: <Users className="h-4 w-4" />,
      category: 'actions',
      action: () => onAction('team'),
    },
    {
      id: 'action-transcribe',
      title: 'Transcribe Audio',
      description: 'Convert audio to text',
      icon: <Mic className="h-4 w-4" />,
      category: 'actions',
      action: () => onAction('transcribe'),
    },

    // AI Tools
    {
      id: 'ai-commentary',
      title: 'Generate Commentary',
      description: 'AI-powered biblical commentary',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'ai',
      action: () => onAction('ai-commentary'),
    },
    {
      id: 'ai-illustrations',
      title: 'Find Illustrations',
      description: 'AI-powered sermon illustrations',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'ai',
      action: () => onAction('ai-illustrations'),
    },
    {
      id: 'ai-outline',
      title: 'Generate Outline',
      description: 'AI-powered sermon structure',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'ai',
      action: () => onAction('ai-outline'),
    },
    {
      id: 'ai-applications',
      title: 'Generate Applications',
      description: 'Practical life applications',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'ai',
      action: () => onAction('ai-applications'),
    },
    {
      id: 'ai-coach',
      title: 'Sermon Coach',
      description: 'Get AI feedback on your sermon',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'ai',
      action: () => onAction('ai-coach'),
    },

    // Recent sermons
    ...recentSermons.slice(0, 5).map((sermon) => ({
      id: `recent-${sermon.id}`,
      title: sermon.title,
      description: sermon.date,
      icon: <FileText className="h-4 w-4" />,
      category: 'recent' as const,
      action: () => onAction(`open-${sermon.id}`),
    })),
  ];

  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Actions',
    ai: 'AI Tools',
    export: 'Export',
    recent: 'Recent Sermons',
  };

  const categoryOrder = ['recent', 'navigation', 'actions', 'ai', 'export'];

  const flatFilteredCommands = categoryOrder.flatMap(
    (cat) => groupedCommands[cat] || []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatFilteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatFilteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatFilteredCommands[selectedIndex]) {
            flatFilteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, flatFilteredCommands, selectedIndex, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-200"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, sermons, or actions..."
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
              />
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">
                  esc
                </kbd>
                <span>to close</span>
              </div>
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-[400px] overflow-y-auto py-2"
            >
              {flatFilteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No results found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : (
                categoryOrder.map((category) => {
                  const items = groupedCommands[category];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category} className="mb-2">
                      <div className="px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </div>
                      {items.map((cmd) => {
                        const index = currentIndex++;
                        const isSelected = index === selectedIndex;

                        return (
                          <button
                            key={cmd.id}
                            data-index={index}
                            onClick={() => {
                              cmd.action();
                              onClose();
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isSelected
                                ? 'bg-bible-50 text-bible-900'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-md ${
                                isSelected
                                  ? 'bg-bible-100 text-bible-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {cmd.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {cmd.title}
                              </div>
                              {cmd.description && (
                                <div className="text-xs text-gray-500 truncate">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <div className="flex items-center gap-1">
                                {cmd.shortcut.split(' ').map((key, i) => (
                                  <kbd
                                    key={i}
                                    className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500 font-mono"
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            )}
                            {isSelected && (
                              <CornerDownLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">
                    ↓
                  </kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono">
                    ↵
                  </kbd>
                  <span>to select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>K to open anytime</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook to manage command palette state
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};
