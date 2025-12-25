/*
  # Initial Schema for Preacher Application

  ## Overview
  This migration creates the complete database schema for the Preacher sermon preparation application.
  
  ## New Tables Created
  
  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `name` (text) - User's full name
  - `church_name` (text) - User's church name
  - `denomination` (text, optional) - Church denomination
  - `default_language` (text) - Preferred language (English/Tamil)
  - `default_outline_style` (text) - Preferred outline format
  - `email_notifications` (boolean) - Email notification preference
  - `avatar_url` (text, optional) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update
  
  ### 2. sermons
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles(id)
  - `scripture` (text) - Bible passage reference
  - `title` (text, optional) - Custom sermon title
  - `theme` (text, optional) - Sermon theme
  - `language` (text) - Language (English/Tamil)
  - `notes` (text) - Sermon content/manuscript
  - `series_id` (uuid, optional) - References sermon_series(id)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `deleted_at` (timestamptz, optional) - Soft delete timestamp
  
  ### 3. sermon_versions
  - `id` (uuid, primary key)
  - `sermon_id` (uuid) - References sermons(id)
  - `content` (text) - Version content
  - `change_description` (text, optional) - What changed in this version
  - `created_at` (timestamptz) - Version creation time
  - `created_by` (uuid) - User who created this version
  
  ### 4. sermon_series
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles(id)
  - `title` (text) - Series title
  - `description` (text, optional) - Series description
  - `theme` (text, optional) - Series theme
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. tags
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles(id)
  - `name` (text) - Tag name
  - `color` (text, optional) - Tag color for UI
  - `created_at` (timestamptz)
  
  ### 6. sermon_tags (junction table)
  - `sermon_id` (uuid) - References sermons(id)
  - `tag_id` (uuid) - References tags(id)
  - `created_at` (timestamptz)
  
  ### 7. team_members
  - `id` (uuid, primary key)
  - `sermon_id` (uuid) - References sermons(id)
  - `user_id` (uuid) - References profiles(id) for invited user
  - `invited_by` (uuid) - References profiles(id) for inviter
  - `role` (text) - 'editor' or 'viewer'
  - `email` (text) - Email for invitation
  - `status` (text) - 'pending', 'accepted', 'declined'
  - `created_at` (timestamptz)
  - `accepted_at` (timestamptz, optional)
  
  ### 8. scheduled_sermons
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles(id)
  - `sermon_id` (uuid, optional) - References sermons(id)
  - `scheduled_date` (timestamptz) - When sermon is scheduled
  - `scripture` (text) - Planned scripture
  - `title` (text, optional) - Planned title
  - `notes` (text, optional) - Planning notes
  - `created_at` (timestamptz)
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Team members can access shared sermons based on permissions
  - Secure policies for read, insert, update, and delete operations
  
  ## Performance
  - Indexes on foreign keys and frequently queried columns
  - Indexes on user_id for efficient user data queries
  - Composite indexes for junction tables
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE ALL TABLES FIRST (without RLS policies)
-- =====================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  church_name text NOT NULL DEFAULT '',
  denomination text,
  default_language text DEFAULT 'English',
  default_outline_style text DEFAULT 'Three-Point',
  email_notifications boolean DEFAULT true,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SERMON SERIES TABLE
CREATE TABLE IF NOT EXISTS sermon_series (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  theme text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SERMONS TABLE
CREATE TABLE IF NOT EXISTS sermons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scripture text NOT NULL,
  title text,
  theme text,
  language text NOT NULL DEFAULT 'English',
  notes text DEFAULT '',
  series_id uuid REFERENCES sermon_series(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- SERMON VERSIONS TABLE
CREATE TABLE IF NOT EXISTS sermon_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sermon_id uuid NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  content text NOT NULL,
  change_description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- TAGS TABLE
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- SERMON TAGS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS sermon_tags (
  sermon_id uuid NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (sermon_id, tag_id)
);

-- TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sermon_id uuid NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('editor', 'viewer')),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz
);

-- SCHEDULED SERMONS TABLE
CREATE TABLE IF NOT EXISTS scheduled_sermons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sermon_id uuid REFERENCES sermons(id) ON DELETE SET NULL,
  scheduled_date timestamptz NOT NULL,
  scripture text NOT NULL,
  title text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(id);
CREATE INDEX IF NOT EXISTS sermon_series_user_id_idx ON sermon_series(user_id);
CREATE INDEX IF NOT EXISTS sermon_series_created_at_idx ON sermon_series(created_at DESC);
CREATE INDEX IF NOT EXISTS sermons_user_id_idx ON sermons(user_id);
CREATE INDEX IF NOT EXISTS sermons_series_id_idx ON sermons(series_id);
CREATE INDEX IF NOT EXISTS sermons_created_at_idx ON sermons(created_at DESC);
CREATE INDEX IF NOT EXISTS sermons_deleted_at_idx ON sermons(deleted_at);
CREATE INDEX IF NOT EXISTS sermons_scripture_idx ON sermons USING gin(to_tsvector('english', scripture));
CREATE INDEX IF NOT EXISTS sermon_versions_sermon_id_idx ON sermon_versions(sermon_id);
CREATE INDEX IF NOT EXISTS sermon_versions_created_at_idx ON sermon_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
CREATE INDEX IF NOT EXISTS sermon_tags_sermon_id_idx ON sermon_tags(sermon_id);
CREATE INDEX IF NOT EXISTS sermon_tags_tag_id_idx ON sermon_tags(tag_id);
CREATE INDEX IF NOT EXISTS team_members_sermon_id_idx ON team_members(sermon_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);
CREATE INDEX IF NOT EXISTS team_members_email_idx ON team_members(email);
CREATE INDEX IF NOT EXISTS scheduled_sermons_user_id_idx ON scheduled_sermons(user_id);
CREATE INDEX IF NOT EXISTS scheduled_sermons_date_idx ON scheduled_sermons(scheduled_date);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_sermons ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - PROFILES
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS POLICIES - SERMON SERIES
-- =====================================================

CREATE POLICY "Users can view own series"
  ON sermon_series FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own series"
  ON sermon_series FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own series"
  ON sermon_series FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own series"
  ON sermon_series FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - SERMONS
-- =====================================================

CREATE POLICY "Users can view own sermons"
  ON sermons FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.sermon_id = sermons.id 
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'accepted'
    )
  );

CREATE POLICY "Users can insert own sermons"
  ON sermons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sermons"
  ON sermons FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.sermon_id = sermons.id 
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'editor'
      AND team_members.status = 'accepted'
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.sermon_id = sermons.id 
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'editor'
      AND team_members.status = 'accepted'
    )
  );

CREATE POLICY "Users can delete own sermons"
  ON sermons FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - SERMON VERSIONS
-- =====================================================

CREATE POLICY "Users can view versions of accessible sermons"
  ON sermon_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = sermon_versions.sermon_id 
      AND (
        sermons.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members 
          WHERE team_members.sermon_id = sermons.id 
          AND team_members.user_id = auth.uid()
          AND team_members.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can create versions for accessible sermons"
  ON sermon_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = sermon_versions.sermon_id 
      AND (
        sermons.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members 
          WHERE team_members.sermon_id = sermons.id 
          AND team_members.user_id = auth.uid()
          AND team_members.role = 'editor'
          AND team_members.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can delete own versions"
  ON sermon_versions FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- =====================================================
-- RLS POLICIES - TAGS
-- =====================================================

CREATE POLICY "Users can view own tags"
  ON tags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON tags FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - SERMON TAGS
-- =====================================================

CREATE POLICY "Users can view tags on accessible sermons"
  ON sermon_tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = sermon_tags.sermon_id 
      AND (
        sermons.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members 
          WHERE team_members.sermon_id = sermons.id 
          AND team_members.user_id = auth.uid()
          AND team_members.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can add tags to own sermons"
  ON sermon_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = sermon_tags.sermon_id 
      AND sermons.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove tags from own sermons"
  ON sermon_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = sermon_tags.sermon_id 
      AND sermons.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - TEAM MEMBERS
-- =====================================================

CREATE POLICY "Users can view team members of own sermons"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = team_members.sermon_id 
      AND sermons.user_id = auth.uid()
    )
    OR auth.uid() = user_id
  );

CREATE POLICY "Sermon owners can invite team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = invited_by
    AND EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = team_members.sermon_id 
      AND sermons.user_id = auth.uid()
    )
  );

CREATE POLICY "Invited users can update their own membership"
  ON team_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sermon owners can remove team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sermons 
      WHERE sermons.id = team_members.sermon_id 
      AND sermons.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - SCHEDULED SERMONS
-- =====================================================

CREATE POLICY "Users can view own scheduled sermons"
  ON scheduled_sermons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scheduled sermons"
  ON scheduled_sermons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled sermons"
  ON scheduled_sermons FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled sermons"
  ON scheduled_sermons FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sermons_updated_at ON sermons;
CREATE TRIGGER update_sermons_updated_at
  BEFORE UPDATE ON sermons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sermon_series_updated_at ON sermon_series;
CREATE TRIGGER update_sermon_series_updated_at
  BEFORE UPDATE ON sermon_series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, church_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'church_name', ''),
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();