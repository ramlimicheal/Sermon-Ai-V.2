import React, { useEffect, useState } from 'react';
import { getSermons, deleteSermon, getProfile } from '@/services/storageService';
import { SavedSermon, UserProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Trash2, BookOpen, FileText, Download, LayoutTemplate, Search, Plus, MoreHorizontal } from 'lucide-react';
import { SermonExport } from '@/components/SermonExport';
import { SermonTemplates } from '@/components/SermonTemplates';

interface SermonLibraryProps {
  onOpenSermon: (sermon: SavedSermon) => void;
  onNewSermon: () => void;
}

export const SermonLibrary: React.FC<SermonLibraryProps> = ({ onOpenSermon, onNewSermon }) => {
  const [sermons, setSermons] = useState<SavedSermon[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', churchName: '' });
  const [showExport, setShowExport] = useState<SavedSermon | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'English' | 'Tamil'>('all');

  useEffect(() => {
    setSermons(getSermons());
    setProfile(getProfile());
  }, []);

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || sermon.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this sermon?')) {
      deleteSermon(id);
      setSermons(getSermons());
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bible-50 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold text-bible-900">
            Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <Button onClick={onNewSermon} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Sermon
          </Button>
        </div>
        <p className="text-sm text-bible-500">
          {sermons.length} sermon{sermons.length !== 1 ? 's' : ''} in your library
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-bible-200 rounded-lg p-4">
          <p className="text-xs text-bible-500 mb-1">Total Sermons</p>
          <p className="text-2xl font-semibold text-bible-900">{sermons.length}</p>
        </div>
        <div className="bg-white border border-bible-200 rounded-lg p-4">
          <p className="text-xs text-bible-500 mb-1">Time Saved</p>
          <p className="text-2xl font-semibold text-bible-900">{sermons.length * 5}h</p>
        </div>
        <div className="bg-white border border-bible-200 rounded-lg p-4">
          <p className="text-xs text-bible-500 mb-1">This Month</p>
          <p className="text-2xl font-semibold text-bible-900">
            {sermons.filter(s => {
              const d = new Date(s.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Sermons List */}
      <div className="bg-white border border-bible-200 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-bible-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bible-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm border border-bible-200 rounded-md pl-9 pr-3 py-1.5 bg-white text-bible-900 focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900"
              />
            </div>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value as any)}
              className="text-sm border border-bible-200 rounded-md px-3 py-1.5 bg-white text-bible-700 focus:outline-none focus:ring-1 focus:ring-bible-900 focus:border-bible-900"
            >
              <option value="all">All</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
            <LayoutTemplate className="h-3.5 w-3.5 mr-1.5" />
            Templates
          </Button>
        </div>

        {/* Content */}
        {filteredSermons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-bible-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-5 w-5 text-bible-400" />
            </div>
            <p className="text-sm font-medium text-bible-900 mb-1">
              {searchQuery || filterLanguage !== 'all' ? 'No results found' : 'No sermons yet'}
            </p>
            <p className="text-xs text-bible-500 mb-4">
              {searchQuery || filterLanguage !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first sermon to get started'}
            </p>
            {!searchQuery && filterLanguage === 'all' && (
              <Button onClick={onNewSermon} size="sm">Create Sermon</Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-bible-100">
            {filteredSermons.map((sermon) => (
              <div 
                key={sermon.id} 
                className="flex items-center gap-4 px-4 py-3 hover:bg-bible-50 transition-colors cursor-pointer group"
                onClick={() => onOpenSermon(sermon)}
              >
                <div className="h-9 w-9 rounded-md bg-bible-100 flex items-center justify-center text-bible-500 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-bible-900 truncate">{sermon.scripture}</p>
                  <p className="text-xs text-bible-500">
                    {new Date(sermon.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    <span className="mx-1.5">·</span>
                    {sermon.language}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="p-1.5 text-bible-400 hover:text-bible-600 hover:bg-bible-100 rounded transition-colors"
                    onClick={() => setShowExport(sermon)}
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 text-bible-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    onClick={(e) => handleDelete(sermon.id, e)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showExport && (
        <SermonExport sermon={showExport} onClose={() => setShowExport(null)} />
      )}
      {showTemplates && (
        <SermonTemplates 
          onSelectTemplate={(template) => {
            setShowTemplates(false);
            onNewSermon();
          }} 
          onClose={() => setShowTemplates(false)} 
        />
      )}
    </div>
  );
};