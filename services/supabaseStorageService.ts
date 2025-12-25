import { supabase } from './supabaseClient';
import { SavedSermon, UserProfile, SermonSeries, SermonVersion } from '../types';

// =====================================================
// PROFILES
// =====================================================

export const getProfile = async (): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { name: '', churchName: '' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) {
    return { name: '', churchName: '' };
  }

  return {
    name: data.name,
    churchName: data.church_name,
    denomination: data.denomination || undefined,
    defaultLanguage: data.default_language as any,
    defaultOutlineStyle: data.default_outline_style as any,
    emailNotifications: data.email_notifications,
  };
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name: profile.name,
      church_name: profile.churchName,
      denomination: profile.denomination,
      default_language: profile.defaultLanguage || 'English',
      default_outline_style: profile.defaultOutlineStyle || 'Three-Point',
      email_notifications: profile.emailNotifications ?? true,
    });

  if (error) throw error;
};

// =====================================================
// SERMONS
// =====================================================

export const getSermons = async (): Promise<SavedSermon[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('sermons')
    .select(`
      *,
      sermon_tags(
        tag:tags(*)
      )
    `)
    .is('deleted_at', null)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sermons:', error);
    return [];
  }

  return (data || []).map(sermon => ({
    id: sermon.id,
    scripture: sermon.scripture,
    language: sermon.language as any,
    createdAt: sermon.created_at,
    updatedAt: sermon.updated_at,
    title: sermon.title || undefined,
    notes: sermon.notes,
    tags: sermon.sermon_tags?.map((st: any) => st.tag.name) || [],
    seriesId: sermon.series_id || undefined,
  }));
};

export const getSermon = async (id: string): Promise<SavedSermon | null> => {
  const { data, error } = await supabase
    .from('sermons')
    .select(`
      *,
      sermon_tags(
        tag:tags(*)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    scripture: data.scripture,
    language: data.language as any,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    title: data.title || undefined,
    notes: data.notes,
    tags: data.sermon_tags?.map((st: any) => st.tag.name) || [],
    seriesId: data.series_id || undefined,
  };
};

export const saveSermon = async (
  sermon: Partial<SavedSermon> & { scripture: string; language: string }
): Promise<SavedSermon> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  if (sermon.id) {
    // Update existing sermon
    const { data, error } = await supabase
      .from('sermons')
      .update({
        scripture: sermon.scripture,
        title: sermon.title,
        theme: sermon.theme,
        language: sermon.language,
        notes: sermon.notes || '',
        series_id: sermon.seriesId,
      })
      .eq('id', sermon.id)
      .select()
      .single();

    if (error) throw error;

    // Handle tags
    if (sermon.tags) {
      await updateSermonTags(sermon.id, sermon.tags);
    }

    return {
      id: data.id,
      scripture: data.scripture,
      language: data.language as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      title: data.title || undefined,
      notes: data.notes,
      tags: sermon.tags || [],
      seriesId: data.series_id || undefined,
    };
  } else {
    // Create new sermon
    const { data, error } = await supabase
      .from('sermons')
      .insert({
        user_id: user.id,
        scripture: sermon.scripture,
        title: sermon.title,
        theme: sermon.theme,
        language: sermon.language,
        notes: sermon.notes || '',
        series_id: sermon.seriesId,
      })
      .select()
      .single();

    if (error) throw error;

    // Handle tags
    if (sermon.tags && sermon.tags.length > 0) {
      await updateSermonTags(data.id, sermon.tags);
    }

    return {
      id: data.id,
      scripture: data.scripture,
      language: data.language as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      title: data.title || undefined,
      notes: data.notes,
      tags: sermon.tags || [],
      seriesId: data.series_id || undefined,
    };
  }
};

export const deleteSermon = async (id: string): Promise<void> => {
  // Soft delete
  const { error } = await supabase
    .from('sermons')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// TAGS
// =====================================================

export const updateSermonTags = async (sermonId: string, tagNames: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Remove existing tags
  await supabase
    .from('sermon_tags')
    .delete()
    .eq('sermon_id', sermonId);

  if (tagNames.length === 0) return;

  // Get or create tags
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    // Try to get existing tag
    let { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', tagName)
      .maybeSingle();

    if (!tag) {
      // Create new tag
      const { data: newTag, error } = await supabase
        .from('tags')
        .insert({
          user_id: user.id,
          name: tagName,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating tag:', error);
        continue;
      }
      tag = newTag;
    }

    if (tag) {
      tagIds.push(tag.id);
    }
  }

  // Add new tag associations
  if (tagIds.length > 0) {
    await supabase
      .from('sermon_tags')
      .insert(
        tagIds.map(tagId => ({
          sermon_id: sermonId,
          tag_id: tagId,
        }))
      );
  }
};

export const getUserTags = async (): Promise<{ id: string; name: string; color: string }[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data || [];
};

// =====================================================
// SERMON VERSIONS
// =====================================================

export const addSermonVersion = async (
  sermonId: string,
  content: string,
  changeDescription?: string
): Promise<SermonVersion> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sermon_versions')
    .insert({
      sermon_id: sermonId,
      content,
      change_description: changeDescription,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    changeDescription: data.change_description || undefined,
  };
};

export const getSermonVersions = async (sermonId: string): Promise<SermonVersion[]> => {
  const { data, error } = await supabase
    .from('sermon_versions')
    .select('*')
    .eq('sermon_id', sermonId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching versions:', error);
    return [];
  }

  return (data || []).map(v => ({
    id: v.id,
    content: v.content,
    createdAt: v.created_at,
    changeDescription: v.change_description || undefined,
  }));
};

export const restoreSermonVersion = async (sermonId: string, versionId: string): Promise<void> => {
  // Get the version content
  const { data: version, error: versionError } = await supabase
    .from('sermon_versions')
    .select('content')
    .eq('id', versionId)
    .single();

  if (versionError || !version) throw versionError || new Error('Version not found');

  // Update sermon with version content
  const { error } = await supabase
    .from('sermons')
    .update({ notes: version.content })
    .eq('id', sermonId);

  if (error) throw error;
};

export const deleteSermonVersion = async (sermonId: string, versionId: string): Promise<void> => {
  const { error } = await supabase
    .from('sermon_versions')
    .delete()
    .eq('id', versionId)
    .eq('sermon_id', sermonId);

  if (error) throw error;
};

// =====================================================
// SERMON SERIES
// =====================================================

export const createSeries = async (
  title: string,
  description?: string,
  theme?: string
): Promise<SermonSeries> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sermon_series')
    .insert({
      user_id: user.id,
      title,
      description,
      theme,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    theme: data.theme || undefined,
    sermonIds: [],
    createdAt: data.created_at,
  };
};

export const getSeries = async (): Promise<SermonSeries[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('sermon_series')
    .select(`
      *,
      sermons(id)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching series:', error);
    return [];
  }

  return (data || []).map(series => ({
    id: series.id,
    title: series.title,
    description: series.description || undefined,
    theme: series.theme || undefined,
    sermonIds: series.sermons?.map((s: any) => s.id) || [],
    createdAt: series.created_at,
  }));
};

export const addSermonToSeries = async (seriesId: string, sermonId: string): Promise<void> => {
  const { error } = await supabase
    .from('sermons')
    .update({ series_id: seriesId })
    .eq('id', sermonId);

  if (error) throw error;
};

// =====================================================
// SCHEDULED SERMONS
// =====================================================

export const scheduleSermon = async (
  date: string,
  scripture: string,
  title?: string
): Promise<{ id: string; date: string; scripture: string; title?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('scheduled_sermons')
    .insert({
      user_id: user.id,
      scheduled_date: date,
      scripture,
      title,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    date: data.scheduled_date,
    scripture: data.scripture,
    title: data.title || undefined,
  };
};

export const getScheduledSermons = async (): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('scheduled_sermons')
    .select('*')
    .eq('user_id', user.id)
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching scheduled sermons:', error);
    return [];
  }

  return (data || []).map(s => ({
    id: s.id,
    date: s.scheduled_date,
    scripture: s.scripture,
    title: s.title,
  }));
};

export const removeScheduledSermon = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('scheduled_sermons')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
