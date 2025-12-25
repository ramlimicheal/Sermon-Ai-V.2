import React, { useEffect, useState } from 'react';
import { getProfile, saveProfile } from '@/services/supabaseStorageService';
import { UserProfile as UserProfileType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Church, Save, Mail, MapPin, Globe, Calendar, Award, BookOpen, Users, Languages, Sparkles } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileType>({ name: '', churchName: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile(profile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bible-50 p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-bible-900 mb-2">Settings & Profile</h1>
          <p className="text-bible-500">Manage your account preferences and personal information</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-bible-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-bible-800 to-bible-700 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white/30">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold">{profile.name || 'Pastor Name'}</h2>
                  <p className="text-bible-200 text-sm">{profile.churchName || 'Church Name'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-bible-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bible-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="block w-full pl-10 rounded-lg border-bible-300 shadow-sm focus:border-bible-500 focus:ring-bible-500 py-2.5 bg-white border text-sm"
                      placeholder="e.g. Rev. John Smith"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-bible-700 mb-2">Church Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bible-400">
                      <Church className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={profile.churchName}
                      onChange={(e) => setProfile({...profile, churchName: e.target.value})}
                      className="block w-full pl-10 rounded-lg border-bible-300 shadow-sm focus:border-bible-500 focus:ring-bible-500 py-2.5 bg-white border text-sm"
                      placeholder="e.g. Grace Community Church"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-bible-100">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
                {isSaved && (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-2 animate-fade-in">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-bible-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-bible-700" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-bible-900">Sermon Preferences</h3>
                <p className="text-sm text-bible-500">Customize your sermon preparation experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bible-50 rounded-lg border border-bible-100">
                <div className="flex items-center gap-3">
                  <Languages className="h-5 w-5 text-bible-600" />
                  <div>
                    <p className="font-semibold text-bible-900 text-sm">Default Language</p>
                    <p className="text-xs text-bible-500">Choose your preferred sermon output language</p>
                  </div>
                </div>
                <select className="px-3 py-2 border border-bible-300 rounded-lg text-sm font-medium text-bible-700 bg-white focus:ring-2 focus:ring-bible-500 focus:border-bible-500">
                  <option>English</option>
                  <option>Tamil</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-bible-50 rounded-lg border border-bible-100">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-bible-600" />
                  <div>
                    <p className="font-semibold text-bible-900 text-sm">Outline Style</p>
                    <p className="text-xs text-bible-500">Default sermon structure preference</p>
                  </div>
                </div>
                <select className="px-3 py-2 border border-bible-300 rounded-lg text-sm font-medium text-bible-700 bg-white focus:ring-2 focus:ring-bible-500 focus:border-bible-500">
                  <option>Expository</option>
                  <option>Topical</option>
                  <option>Narrative</option>
                  <option>3-Point</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-bible-900">Subscription Plan</h3>
                <p className="text-sm text-bible-500">Manage your Preachr subscription</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-bible-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-bible-500 uppercase tracking-wide font-bold">Current Plan</p>
                  <p className="text-2xl font-serif font-bold text-bible-900 mt-1">Free Tier</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-bible-500">Sermons this month</p>
                  <p className="text-2xl font-bold text-bible-900">0 / 3</p>
                </div>
              </div>
              
              <div className="w-full h-2 bg-bible-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-bible-600 w-0 rounded-full"></div>
              </div>

              <Button variant="primary" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" /> Upgrade to Pastor Plan - $19/mo
              </Button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-bible-100 rounded-lg">
                <Users className="h-5 w-5 text-bible-700" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-bible-900">Data Management</h3>
                <p className="text-sm text-bible-500">Export and manage your sermon library</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" /> Export All Sermons
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" /> Backup Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};