import React, { useState } from 'react';
import { 
  BookOpen, 
  Church, 
  Users, 
  Mic2, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VoiceProfile } from '@/components/YourVoiceSettings';

interface OnboardingFlowProps {
  onComplete: (profile: VoiceProfile) => void;
  onSkip: () => void;
}

const ONBOARDING_COMPLETE_KEY = 'preachr_onboarding_complete';
const VOICE_PROFILE_KEY = 'preachr_voice_profile';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<VoiceProfile>>({
    denomination: '',
    theologicalTradition: '',
    preachingStyle: '',
    audienceType: '',
    sermonLength: '25-30',
    tonePreference: 'balanced',
    bibleTranslation: 'NIV',
    languageComplexity: 'accessible',
    illustrationPreference: 'mixed',
    applicationFocus: 'practical'
  });

  const handleChange = (field: keyof VoiceProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    const fullProfile = profile as VoiceProfile;
    localStorage.setItem(VOICE_PROFILE_KEY, JSON.stringify(fullProfile));
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    onComplete(fullProfile);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    onSkip();
  };

  const steps = [
    {
      title: 'Welcome to Preachr',
      subtitle: 'Let\'s personalize your experience',
      icon: Sparkles
    },
    {
      title: 'Your Church',
      subtitle: 'Help us understand your context',
      icon: Church
    },
    {
      title: 'Your Style',
      subtitle: 'How do you like to preach?',
      icon: Mic2
    },
    {
      title: 'Your Audience',
      subtitle: 'Who are you preaching to?',
      icon: Users
    },
    {
      title: 'Your Preferences',
      subtitle: 'Final touches',
      icon: BookOpen
    }
  ];

  const denominations = [
    'Non-denominational',
    'Baptist',
    'Methodist',
    'Presbyterian',
    'Lutheran',
    'Anglican/Episcopal',
    'Pentecostal/Charismatic',
    'Catholic',
    'Reformed',
    'Other'
  ];

  const theologicalTraditions = [
    { value: 'evangelical', label: 'Evangelical' },
    { value: 'reformed', label: 'Reformed/Calvinist' },
    { value: 'arminian', label: 'Arminian/Wesleyan' },
    { value: 'charismatic', label: 'Charismatic' },
    { value: 'liturgical', label: 'Liturgical' },
    { value: 'progressive', label: 'Progressive' }
  ];

  const preachingStyles = [
    { value: 'expository', label: 'Expository', desc: 'Verse-by-verse through passages' },
    { value: 'topical', label: 'Topical', desc: 'Theme-based messages' },
    { value: 'narrative', label: 'Narrative', desc: 'Story-driven preaching' },
    { value: 'textual', label: 'Textual', desc: 'Deep dive into single texts' }
  ];

  const audienceTypes = [
    { value: 'mixed', label: 'Mixed Congregation', desc: 'All ages and backgrounds' },
    { value: 'seekers', label: 'Seeker-Focused', desc: 'Many newcomers to faith' },
    { value: 'mature', label: 'Mature Believers', desc: 'Established Christians' },
    { value: 'youth', label: 'Youth/Young Adults', desc: 'Teens and college-age' }
  ];

  const bibleTranslations = ['NIV', 'ESV', 'NASB', 'KJV', 'NKJV', 'NLT', 'CSB'];

  const sermonLengths = [
    { value: '15-20', label: '15-20 min' },
    { value: '25-30', label: '25-30 min' },
    { value: '35-45', label: '35-45 min' },
    { value: '45+', label: '45+ min' }
  ];

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return profile.denomination && profile.theologicalTradition;
      case 2: return profile.preachingStyle;
      case 3: return profile.audienceType;
      case 4: return profile.bibleTranslation;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  idx < step
                    ? 'bg-stone-900 text-white'
                    : idx === step
                    ? 'bg-stone-900 text-white ring-4 ring-stone-200'
                    : 'bg-stone-200 text-stone-400'
                }`}
              >
                {idx < step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-900 transition-all duration-300"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-stone-100">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              {React.createElement(steps[step].icon, { className: 'h-8 w-8 text-stone-700' })}
            </div>
            <h1 className="text-2xl font-serif font-medium text-stone-900 mb-2">
              {steps[step].title}
            </h1>
            <p className="text-stone-500">{steps[step].subtitle}</p>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <p className="text-stone-600 leading-relaxed max-w-md mx-auto">
                  Preachr uses AI to help you prepare powerful sermons in half the time. 
                  Let's take a minute to personalize your experience so the AI understands 
                  your unique voice and context.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <BookOpen className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm text-stone-600">Deep Research</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <Mic2 className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm text-stone-600">Your Voice</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <Sparkles className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm text-stone-600">AI-Powered</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Church Identity */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    What's your denomination?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {denominations.map((d) => (
                      <button
                        key={d}
                        onClick={() => handleChange('denomination', d)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.denomination === d
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Theological tradition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {theologicalTraditions.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => handleChange('theologicalTradition', t.value)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.theologicalTradition === t.value
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Preaching Style */}
            {step === 2 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  How do you typically preach?
                </label>
                {preachingStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleChange('preachingStyle', style.value)}
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-all ${
                      profile.preachingStyle === style.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-medium">{style.label}</span>
                    <p className={`text-sm mt-1 ${
                      profile.preachingStyle === style.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {style.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Audience */}
            {step === 3 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Who is your primary audience?
                </label>
                {audienceTypes.map((audience) => (
                  <button
                    key={audience.value}
                    onClick={() => handleChange('audienceType', audience.value)}
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-all ${
                      profile.audienceType === audience.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-medium">{audience.label}</span>
                    <p className={`text-sm mt-1 ${
                      profile.audienceType === audience.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {audience.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Preferred Bible translation
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bibleTranslations.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleChange('bibleTranslation', t)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          profile.bibleTranslation === t
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Typical sermon length
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sermonLengths.map((length) => (
                      <button
                        key={length.value}
                        onClick={() => handleChange('sermonLength', length.value)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.sermonLength === length.value
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {length.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-sm text-stone-500 text-center">
                    You can always adjust these settings later in your profile.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            {step > 0 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-stone-500"
              >
                Skip for now
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Creating
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const hasCompletedOnboarding = (): boolean => {
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
};

export const resetOnboarding = (): void => {
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
};
