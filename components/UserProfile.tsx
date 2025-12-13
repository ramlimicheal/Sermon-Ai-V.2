import React, { useEffect, useState } from 'react';
import { getProfile, saveProfile } from '../services/storageService';
import { UserProfile as UserProfileType } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User, Church, Save } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileType>({ name: '', churchName: '' });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bible-50/50 p-6 lg:p-10 font-sans">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-serif font-bold text-bible-900 mb-6">Profile Settings</h1>
        
        <Card title="Pastor Details" icon={<User className="h-5 w-5" />}>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-bible-700 mb-1">Full Name</label>
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
              <label className="block text-sm font-medium text-bible-700 mb-1">Church Name</label>
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

            <div className="pt-4 flex items-center gap-3">
              <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> Save Profile
              </Button>
              {isSaved && <span className="text-green-600 text-sm font-medium animate-fade-in">Saved successfully!</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};