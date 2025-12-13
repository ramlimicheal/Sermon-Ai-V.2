
import { SavedSermon, UserProfile, SermonSeries, SermonVersion } from '../types';

const SERMONS_KEY = 'sermon_builder_sermons';
const PROFILE_KEY = 'sermon_builder_profile';
const SERIES_KEY = 'sermon_builder_series';
const TEAM_MEMBERS_KEY = 'sermon_builder_team_members';
const SCHEDULED_SERMONS_KEY = 'sermon_builder_scheduled';

export const saveSermon = (sermon: Partial<SavedSermon> & { scripture: string, language: string }): SavedSermon => {
  const sermons = getSermons();
  
  if (sermon.id) {
    // Update existing
    const index = sermons.findIndex(s => s.id === sermon.id);
    if (index !== -1) {
      const updatedSermon = { 
        ...sermons[index], 
        ...sermon,
        updatedAt: new Date().toISOString()
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
    tags: sermon.tags || [],
    versions: [],
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

export const updateSermonTags = (id: string, tags: string[]): void => {
  const sermons = getSermons();
  const index = sermons.findIndex(s => s.id === id);
  if (index !== -1) {
    sermons[index].tags = tags;
    localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
  }
};

export const addSermonVersion = (sermonId: string, content: string, changeDescription?: string): SermonVersion => {
  const sermons = getSermons();
  const index = sermons.findIndex(s => s.id === sermonId);
  if (index !== -1) {
    const version: SermonVersion = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
      changeDescription,
    };
    if (!sermons[index].versions) {
      sermons[index].versions = [];
    }
    sermons[index].versions!.push(version);
    sermons[index].currentVersionId = version.id;
    localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
    return version;
  }
  throw new Error('Sermon not found');
};

export const getSermonVersions = (sermonId: string): SermonVersion[] => {
  const sermons = getSermons();
  const sermon = sermons.find(s => s.id === sermonId);
  return sermon?.versions || [];
};

export const restoreSermonVersion = (sermonId: string, versionId: string): void => {
  const sermons = getSermons();
  const sermonIndex = sermons.findIndex(s => s.id === sermonId);
  if (sermonIndex !== -1) {
    const version = sermons[sermonIndex].versions?.find(v => v.id === versionId);
    if (version) {
      sermons[sermonIndex].notes = version.content;
      sermons[sermonIndex].currentVersionId = versionId;
      localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
    }
  }
};

export const deleteSermonVersion = (sermonId: string, versionId: string): void => {
  const sermons = getSermons();
  const sermonIndex = sermons.findIndex(s => s.id === sermonId);
  if (sermonIndex !== -1) {
    sermons[sermonIndex].versions = sermons[sermonIndex].versions?.filter(v => v.id !== versionId) || [];
    localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
  }
};

// Series Management
export const createSeries = (title: string, description?: string, theme?: string): SermonSeries => {
  const series: SermonSeries = {
    id: crypto.randomUUID(),
    title,
    description,
    theme,
    sermonIds: [],
    createdAt: new Date().toISOString(),
  };
  const allSeries = getSeries();
  localStorage.setItem(SERIES_KEY, JSON.stringify([series, ...allSeries]));
  return series;
};

export const getSeries = (): SermonSeries[] => {
  const stored = localStorage.getItem(SERIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addSermonToSeries = (seriesId: string, sermonId: string): void => {
  const allSeries = getSeries();
  const index = allSeries.findIndex(s => s.id === seriesId);
  if (index !== -1) {
    if (!allSeries[index].sermonIds.includes(sermonId)) {
      allSeries[index].sermonIds.push(sermonId);
      localStorage.setItem(SERIES_KEY, JSON.stringify(allSeries));
    }
  }
};

export const getProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : { name: 'Pastor', churchName: 'My Church' };
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Scheduled Sermons
export const scheduleSermon = (date: string, scripture: string, title?: string) => {
  const scheduled = getScheduledSermons();
  const sermon = {
    id: crypto.randomUUID(),
    date,
    scripture,
    title,
  };
  localStorage.setItem(SCHEDULED_SERMONS_KEY, JSON.stringify([...scheduled, sermon]));
  return sermon;
};

export const getScheduledSermons = () => {
  const stored = localStorage.getItem(SCHEDULED_SERMONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const removeScheduledSermon = (id: string): void => {
  const scheduled = getScheduledSermons().filter((s: any) => s.id !== id);
  localStorage.setItem(SCHEDULED_SERMONS_KEY, JSON.stringify(scheduled));
};
