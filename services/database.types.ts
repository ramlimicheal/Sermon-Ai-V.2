export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          church_name: string
          denomination: string | null
          default_language: string
          default_outline_style: string
          email_notifications: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          church_name?: string
          denomination?: string | null
          default_language?: string
          default_outline_style?: string
          email_notifications?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          church_name?: string
          denomination?: string | null
          default_language?: string
          default_outline_style?: string
          email_notifications?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sermons: {
        Row: {
          id: string
          user_id: string
          scripture: string
          title: string | null
          theme: string | null
          language: string
          notes: string
          series_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          scripture: string
          title?: string | null
          theme?: string | null
          language?: string
          notes?: string
          series_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          scripture?: string
          title?: string | null
          theme?: string | null
          language?: string
          notes?: string
          series_id?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      sermon_versions: {
        Row: {
          id: string
          sermon_id: string
          content: string
          change_description: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          sermon_id: string
          content: string
          change_description?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          sermon_id?: string
          content?: string
          change_description?: string | null
          created_at?: string
          created_by?: string
        }
      }
      sermon_series: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          theme: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          theme?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          theme?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      sermon_tags: {
        Row: {
          sermon_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          sermon_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          sermon_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          sermon_id: string
          user_id: string | null
          invited_by: string
          role: 'editor' | 'viewer'
          email: string
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          sermon_id: string
          user_id?: string | null
          invited_by: string
          role: 'editor' | 'viewer'
          email: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          sermon_id?: string
          user_id?: string | null
          invited_by?: string
          role?: 'editor' | 'viewer'
          email?: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          accepted_at?: string | null
        }
      }
      scheduled_sermons: {
        Row: {
          id: string
          user_id: string
          sermon_id: string | null
          scheduled_date: string
          scripture: string
          title: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sermon_id?: string | null
          scheduled_date: string
          scripture: string
          title?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sermon_id?: string | null
          scheduled_date?: string
          scripture?: string
          title?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
