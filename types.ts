
export type Language = 'English' | 'Tamil';

export interface Illustration {
  title: string;
  sourceType: 'Historical' | 'Literature' | 'Scientific' | 'Modern' | 'Other';
  content: string;
}

export interface CrossReference {
  reference: string;
  connection: string;
}

export interface EngagementItem {
  category: 'Ice Breaker' | 'Humor' | 'Interactive Question' | 'Quote';
  content: string;
}

export enum OutlineType {
  EXPOSITORY = 'Expository',
  TOPICAL = 'Topical',
  NARRATIVE = 'Narrative',
  THREE_POINT = 'Three-Point',
}

export interface SermonData {
  id?: string;
  scripture: string;
  theme?: string;
  language: Language;
  notes?: string;
}

export interface GenerationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface SavedSermon {
  id: string;
  scripture: string;
  language: Language;
  createdAt: string;
  title?: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  churchName: string;
}
