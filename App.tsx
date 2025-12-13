import React, { useState } from 'react';
import { SermonInput } from './components/SermonInput';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { SermonLibrary } from './components/SermonLibrary';
import { UserProfile } from './components/UserProfile';
import { SermonData, Language, SavedSermon } from './types';

type View = 'dashboard' | 'new' | 'profile' | 'workspace';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [sermonData, setSermonData] = useState<SermonData | null>(null);

  const handleInputSubmit = (scripture: string, language: Language) => {
    // New sermon, no ID or notes yet
    setSermonData({ scripture, language });
    setView('workspace');
  };

  const handleOpenSermon = (sermon: SavedSermon) => {
    // Open existing sermon with ID and Notes
    setSermonData({ 
        id: sermon.id,
        scripture: sermon.scripture, 
        language: sermon.language,
        notes: sermon.notes 
    });
    setView('workspace');
  };

  const handleChangeView = (newView: View) => {
    setView(newView);
    if (newView !== 'workspace') {
        setSermonData(null);
    }
  };

  return (
    <div className="flex h-screen bg-bible-50 text-bible-900 font-sans selection:bg-bible-200 selection:text-bible-900">
      
      {/* Persistent Sidebar */}
      <Sidebar 
        currentView={view} 
        onChangeView={handleChangeView} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {view === 'dashboard' && (
          <SermonLibrary 
            onOpenSermon={handleOpenSermon} 
            onNewSermon={() => setView('new')} 
          />
        )}

        {view === 'new' && (
           <div className="h-full overflow-y-auto">
              <SermonInput onSubmit={handleInputSubmit} />
           </div>
        )}

        {view === 'profile' && (
           <div className="h-full overflow-y-auto">
              <UserProfile />
           </div>
        )}

        {view === 'workspace' && sermonData && (
          <Dashboard data={sermonData} onBack={() => setView('dashboard')} />
        )}
      </div>
    </div>
  );
}