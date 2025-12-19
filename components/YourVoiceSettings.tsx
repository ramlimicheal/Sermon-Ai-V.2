import React, { useState, useEffect } from 'react';
import { 
  User, 
  Church, 
  BookOpen, 
  Users, 
  Mic2, 
  Save, 
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface VoiceProfile {
  denomination: string;
  theologicalTradition: string;
  preachingStyle: string;
  audienceType: string;
  sermonLength: string;
  tonePreference: string;
  illustrationPreference: string;
  applicationFocus: string;
  bibleTranslation: string;
  languageComplexity: string;
}

interface YourVoiceSettingsProps {
  onSave?: (profile: VoiceProfile) => void;
  initialProfile?: VoiceProfile;
}

const defaultProfile: VoiceProfile = {
  denomination: '',
  theologicalTradition: '',
  preachingStyle: '',
  audienceType: '',
  sermonLength: '25-30',
  tonePreference: 'balanced',
  illustrationPreference: 'mixed',
  applicationFocus: 'practical',
  bibleTranslation: 'NIV',
  languageComplexity: 'accessible'
};

const STORAGE_KEY = 'preachr_voice_profile';

export const YourVoiceSettings: React.FC<YourVoiceSettingsProps> = ({ 
  onSave,
  initialProfile 
}) => {
  const [profile, setProfile] = useState<VoiceProfile>(initialProfile || defaultProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('identity');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading voice profile:', e);
      }
    }
  }, []);

  const handleChange = (field: keyof VoiceProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsSaved(true);
    onSave?.(profile);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const denominations = [
    'Non-denominational',
    'Baptist',
    'Methodist',
    'Presbyterian',
    'Lutheran',
    'Anglican/Episcopal',
    'Pentecostal/Charismatic',
    'Catholic',
    'Orthodox',
    'Church of Christ',
    'Assemblies of God',
    'Evangelical Free',
    'Reformed',
    'Other'
  ];

  const theologicalTraditions = [
    'Evangelical',
    'Reformed/Calvinist',
    'Arminian/Wesleyan',
    'Charismatic',
    'Liturgical',
    'Progressive',
    'Traditional',
    'Ecumenical'
  ];

  const preachingStyles = [
    { value: 'expository', label: 'Expository', desc: 'Verse-by-verse through a passage' },
    { value: 'topical', label: 'Topical', desc: 'Theme-based with supporting scriptures' },
    { value: 'narrative', label: 'Narrative', desc: 'Story-driven, following biblical narratives' },
    { value: 'textual', label: 'Textual', desc: 'Deep dive into a single text' },
    { value: 'biographical', label: 'Biographical', desc: 'Character studies from Scripture' }
  ];

  const audienceTypes = [
    { value: 'mixed', label: 'Mixed Congregation', desc: 'All ages and spiritual maturity levels' },
    { value: 'seekers', label: 'Seeker-Focused', desc: 'Many newcomers to faith' },
    { value: 'mature', label: 'Mature Believers', desc: 'Established Christians seeking depth' },
    { value: 'youth', label: 'Youth/Young Adults', desc: 'Teens and college-age' },
    { value: 'family', label: 'Family-Oriented', desc: 'Parents and children together' }
  ];

  const sermonLengths = [
    { value: '15-20', label: '15-20 minutes' },
    { value: '25-30', label: '25-30 minutes' },
    { value: '35-45', label: '35-45 minutes' },
    { value: '45+', label: '45+ minutes' }
  ];

  const tonePreferences = [
    { value: 'warm', label: 'Warm & Pastoral', desc: 'Encouraging, nurturing tone' },
    { value: 'prophetic', label: 'Prophetic', desc: 'Bold, challenging, calls to action' },
    { value: 'teaching', label: 'Teaching-Focused', desc: 'Educational, informative' },
    { value: 'balanced', label: 'Balanced', desc: 'Mix of comfort and challenge' },
    { value: 'conversational', label: 'Conversational', desc: 'Casual, relatable style' }
  ];

  const illustrationPreferences = [
    { value: 'contemporary', label: 'Contemporary', desc: 'Current events, pop culture, modern life' },
    { value: 'historical', label: 'Historical', desc: 'Church history, historical figures' },
    { value: 'personal', label: 'Personal Stories', desc: 'Life experiences, testimonies' },
    { value: 'literary', label: 'Literary', desc: 'Books, poetry, classic literature' },
    { value: 'mixed', label: 'Mixed', desc: 'Variety of illustration types' }
  ];

  const applicationFocuses = [
    { value: 'practical', label: 'Practical', desc: 'Concrete action steps' },
    { value: 'relational', label: 'Relational', desc: 'Focus on relationships and community' },
    { value: 'spiritual', label: 'Spiritual Formation', desc: 'Inner life and spiritual disciplines' },
    { value: 'missional', label: 'Missional', desc: 'Outreach and evangelism' },
    { value: 'holistic', label: 'Holistic', desc: 'All areas of life' }
  ];

  const bibleTranslations = [
    'NIV', 'ESV', 'NASB', 'KJV', 'NKJV', 'NLT', 'CSB', 'MSG', 'NRSV', 'AMP'
  ];

  const languageComplexities = [
    { value: 'simple', label: 'Simple', desc: 'Easy to understand, minimal jargon' },
    { value: 'accessible', label: 'Accessible', desc: 'Clear but not oversimplified' },
    { value: 'academic', label: 'Academic', desc: 'Theological depth, scholarly language' }
  ];

  const sections = [
    { id: 'identity', label: 'Church Identity', icon: Church },
    { id: 'style', label: 'Preaching Style', icon: Mic2 },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: BookOpen }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">Your Voice Profile</h2>
            <p className="text-sm text-stone-500">Customize how AI generates content for you</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-stone-200 px-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeSection === section.id
                ? 'text-stone-900 border-stone-900'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Church Identity Section */}
        {activeSection === 'identity' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Your church identity helps the AI understand your theological context and generate content that aligns with your tradition.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Denomination
              </label>
              <select
                value={profile.denomination}
                onChange={(e) => handleChange('denomination', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              >
                <option value="">Select denomination...</option>
                {denominations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Theological Tradition
              </label>
              <div className="grid grid-cols-2 gap-2">
                {theologicalTraditions.map((tradition) => (
                  <button
                    key={tradition}
                    onClick={() => handleChange('theologicalTradition', tradition)}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      profile.theologicalTradition === tradition
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {tradition}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preaching Style Section */}
        {activeSection === 'style' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Primary Preaching Style
              </label>
              <div className="space-y-2">
                {preachingStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleChange('preachingStyle', style.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.preachingStyle === style.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{style.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.preachingStyle === style.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {style.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Tone Preference
              </label>
              <div className="space-y-2">
                {tonePreferences.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => handleChange('tonePreference', tone.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.tonePreference === tone.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{tone.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.tonePreference === tone.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {tone.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audience Section */}
        {activeSection === 'audience' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Primary Audience
              </label>
              <div className="space-y-2">
                {audienceTypes.map((audience) => (
                  <button
                    key={audience.value}
                    onClick={() => handleChange('audienceType', audience.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.audienceType === audience.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{audience.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.audienceType === audience.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {audience.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Language Complexity
              </label>
              <div className="space-y-2">
                {languageComplexities.map((complexity) => (
                  <button
                    key={complexity.value}
                    onClick={() => handleChange('languageComplexity', complexity.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.languageComplexity === complexity.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{complexity.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.languageComplexity === complexity.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {complexity.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Typical Sermon Length
              </label>
              <div className="flex gap-2">
                {sermonLengths.map((length) => (
                  <button
                    key={length.value}
                    onClick={() => handleChange('sermonLength', length.value)}
                    className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      profile.sermonLength === length.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {length.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Preferred Bible Translation
              </label>
              <select
                value={profile.bibleTranslation}
                onChange={(e) => handleChange('bibleTranslation', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              >
                {bibleTranslations.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Illustration Preference
              </label>
              <div className="space-y-2">
                {illustrationPreferences.map((pref) => (
                  <button
                    key={pref.value}
                    onClick={() => handleChange('illustrationPreference', pref.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.illustrationPreference === pref.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{pref.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.illustrationPreference === pref.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {pref.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Application Focus
              </label>
              <div className="space-y-2">
                {applicationFocuses.map((focus) => (
                  <button
                    key={focus.value}
                    onClick={() => handleChange('applicationFocus', focus.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      profile.applicationFocus === focus.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-medium">{focus.label}</span>
                    <p className={`text-sm mt-0.5 ${
                      profile.applicationFocus === focus.value ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {focus.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-200 bg-stone-50">
        <Button onClick={handleSave} className="w-full">
          {isSaved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Voice Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const getVoiceProfile = (): VoiceProfile | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};
