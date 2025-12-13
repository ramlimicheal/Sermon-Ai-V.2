
import { SavedSermon, UserProfile } from '../types';

const SERMONS_KEY = 'sermon_builder_sermons';
const PROFILE_KEY = 'sermon_builder_profile';

export const saveSermon = (sermon: Partial<SavedSermon> & { scripture: string, language: string }): SavedSermon => {
  const sermons = getSermons();
  
  if (sermon.id) {
    // Update existing
    const index = sermons.findIndex(s => s.id === sermon.id);
    if (index !== -1) {
      const updatedSermon = { 
        ...sermons[index], 
        ...sermon,
        createdAt: new Date().toISOString() // Update timestamp on save
      };
      sermons[index] = updatedSermon;
      localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
      return updatedSermon;
    }
  }

  // Create new
  const newSermon: SavedSermon = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    scripture: sermon.scripture,
    language: sermon.language as any,
    notes: sermon.notes || '',
    title: sermon.title,
  };
  
  localStorage.setItem(SERMONS_KEY, JSON.stringify([newSermon, ...sermons]));
  return newSermon;
};

export const getSermons = (): SavedSermon[] => {
  const stored = localStorage.getItem(SERMONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteSermon = (id: string): void => {
  const sermons = getSermons().filter(s => s.id !== id);
  localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
};

export const getProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : { name: 'Pastor', churchName: 'My Church' };
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};
