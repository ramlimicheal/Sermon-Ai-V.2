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
import { getSermons } from '@/services/supabaseStorageService';
import { authService } from '@/services/authService';
import type { User } from '@supabase/supabase-js';

type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'new' | 'profile' | 'workspace' | 'analytics';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [sermonData, setSermonData] = useState<SermonData | null>(null);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const { isOpen: commandPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { user: currentUser } = await authService.getUser();
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        if (!hasCompletedOnboarding()) {
          setView('onboarding');
        } else {
          setView('dashboard');
        }
      } else {
        setView('landing');
      }
    };

    checkAuth();

    // Listen for auth changes
    const subscription = authService.onAuthStateChange((newUser, session) => {
      setUser(newUser);
      if (!newUser) {
        setView('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load recent sermons when user is authenticated
  useEffect(() => {
    if (user) {
      loadRecentSermons();
    }
  }, [user]);

  const loadRecentSermons = async () => {
    try {
      const sermons = await getSermons();
      setRecentSermons(sermons.slice(0, 5).map(s => ({
        id: s.id,
        title: s.scripture,
        date: s.updatedAt,
      })));
    } catch (error) {
      console.error('Error loading sermons:', error);
    }
  };

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

    // Show loading screen while checking auth
    if (loading) {
      return (
        <div className="min-h-screen bg-bible-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-bible-200 border-t-bible-900 mb-4"></div>
            <p className="text-bible-600 font-medium">Loading...</p>
          </div>
        </div>
      );
    }

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
