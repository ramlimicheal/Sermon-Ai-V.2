import React, { useState, useEffect } from 'react';
import { SermonInput } from '@/components/SermonInput';
import { Dashboard } from '@/components/Dashboard';
import { Sidebar } from '@/components/Sidebar';
import { SermonLibrary } from '@/components/SermonLibrary';
import { UserProfile } from '@/components/UserProfile';
import { SermonAnalytics } from '@/components/SermonAnalytics';
import { LandingPage } from '@/components/LandingPage';
import { AuthPages } from '@/components/AuthPages';
import { OnboardingFlow, hasCompletedOnboarding } from '@/components/OnboardingFlow';
import { VoiceProfile } from '@/components/YourVoiceSettings';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { SermonData, Language, SavedSermon } from '@/types';
import { getSermons } from '@/services/storageService';

type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'new' | 'profile' | 'workspace' | 'analytics';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [sermonData, setSermonData] = useState<SermonData | null>(null);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const { isOpen: commandPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();

  const recentSermons = getSermons().slice(0, 5).map(s => ({
    id: s.id,
    title: s.scripture,
    date: s.updatedAt,
  }));

  const handleCommandNavigate = (targetView: string) => {
    setView(targetView as View);
    closePalette();
  };

  const handleCommandAction = (action: string) => {
    if (action === 'new-sermon') {
      setView('new');
    } else if (action === 'podium-mode' && sermonData) {
      // Podium mode is handled in Dashboard
    }
    closePalette();
  };

  const handleInputSubmit = (scripture: string, language: Language) => {
    setSermonData({ scripture, language });
    setView('workspace');
  };

  const handleOpenSermon = (sermon: SavedSermon) => {
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

  const handleGetStarted = () => {
    setView('auth');
  };

    const handleAuthComplete = () => {
      if (!hasCompletedOnboarding()) {
        setView('onboarding');
      } else {
        setView('dashboard');
      }
    };

    const handleOnboardingComplete = (profile: VoiceProfile) => {
      setVoiceProfile(profile);
      setView('dashboard');
    };

    const handleOnboardingSkip = () => {
      setView('dashboard');
    };

    // Show landing page for unauthenticated users
    if (view === 'landing') {
      return <LandingPage onGetStarted={handleGetStarted} />;
    }

    // Show auth pages
    if (view === 'auth') {
      return <AuthPages onComplete={handleAuthComplete} />;
    }

    // Show onboarding flow for new users
    if (view === 'onboarding') {
      return (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete} 
          onSkip={handleOnboardingSkip} 
        />
      );
    }

  return (
    <div className="flex h-screen bg-bible-50 text-bible-900 font-sans selection:bg-bible-200 selection:text-bible-900">
      
      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={closePalette}
        onNavigate={handleCommandNavigate}
        onAction={handleCommandAction}
        recentSermons={recentSermons}
      />

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

        {view === 'analytics' && (
           <div className="h-full overflow-y-auto">
              <SermonAnalytics />
           </div>
        )}

        {view === 'workspace' && sermonData && (
          <Dashboard data={sermonData} onBack={() => setView('dashboard')} />
        )}
      </div>
    </div>
  );
}
