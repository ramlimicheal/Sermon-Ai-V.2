/*
  # AI Provider Testing and Performance Tracking

  ## Overview
  This migration creates tables for tracking AI provider performance, test results, and user preferences.

  ## New Tables

  1. **ai_test_results**
     - `id` (uuid, primary key) - Unique identifier for each test result
     - `user_id` (uuid, foreign key) - Reference to users table
     - `provider` (text) - AI provider name (megallm, openrouter, gemini)
     - `feature` (text) - Feature being tested (commentary, illustrations, etc.)
     - `scripture` (text) - Scripture passage used in test
     - `response_time_ms` (integer) - Response time in milliseconds
     - `token_count` (integer) - Number of tokens used
     - `success` (boolean) - Whether the request succeeded
     - `error_message` (text) - Error message if failed
     - `tested_at` (timestamptz) - Timestamp of test
     - `created_at` (timestamptz) - Record creation timestamp

  2. **ai_provider_preferences**
     - `id` (uuid, primary key) - Unique identifier
     - `user_id` (uuid, foreign key) - Reference to users table
     - `preferred_provider` (text) - User's preferred AI provider
     - `auto_fallback` (boolean) - Whether to automatically fallback to other providers
     - `updated_at` (timestamptz) - Last update timestamp
     - `created_at` (timestamptz) - Record creation timestamp

  3. **ai_comparison_results**
     - `id` (uuid, primary key) - Unique identifier
     - `user_id` (uuid, foreign key) - Reference to users table
     - `feature` (text) - Feature being compared
     - `scripture` (text) - Scripture passage used
     - `provider_a` (text) - First provider
     - `provider_b` (text) - Second provider
     - `response_a` (text) - First provider's response
     - `response_b` (text) - Second provider's response
     - `metrics_a` (jsonb) - First provider's metrics
     - `metrics_b` (jsonb) - Second provider's metrics
     - `user_rating` (integer) - User's quality rating (1-5)
     - `preferred_provider` (text) - Which provider the user preferred
     - `compared_at` (timestamptz) - Comparison timestamp
     - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users only
*/

-- Create ai_test_results table
CREATE TABLE IF NOT EXISTS ai_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  feature text NOT NULL,
  scripture text NOT NULL,
  response_time_ms integer NOT NULL,
  token_count integer DEFAULT 0,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  tested_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for ai_test_results
CREATE INDEX IF NOT EXISTS ai_test_results_user_id_idx ON ai_test_results(user_id);
CREATE INDEX IF NOT EXISTS ai_test_results_provider_idx ON ai_test_results(provider);
CREATE INDEX IF NOT EXISTS ai_test_results_feature_idx ON ai_test_results(feature);
CREATE INDEX IF NOT EXISTS ai_test_results_tested_at_idx ON ai_test_results(tested_at);

-- Enable RLS on ai_test_results
ALTER TABLE ai_test_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_test_results
CREATE POLICY "Users can view their own test results"
  ON ai_test_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results"
  ON ai_test_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
  ON ai_test_results FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test results"
  ON ai_test_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create ai_provider_preferences table
CREATE TABLE IF NOT EXISTS ai_provider_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_provider text NOT NULL DEFAULT 'megallm',
  auto_fallback boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for ai_provider_preferences
CREATE INDEX IF NOT EXISTS ai_provider_preferences_user_id_idx ON ai_provider_preferences(user_id);

-- Enable RLS on ai_provider_preferences
ALTER TABLE ai_provider_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_provider_preferences
CREATE POLICY "Users can view their own preferences"
  ON ai_provider_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON ai_provider_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON ai_provider_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON ai_provider_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create ai_comparison_results table
CREATE TABLE IF NOT EXISTS ai_comparison_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  scripture text NOT NULL,
  provider_a text NOT NULL,
  provider_b text NOT NULL,
  response_a text NOT NULL,
  response_b text NOT NULL,
  metrics_a jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics_b jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
  preferred_provider text,
  compared_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for ai_comparison_results
CREATE INDEX IF NOT EXISTS ai_comparison_results_user_id_idx ON ai_comparison_results(user_id);
CREATE INDEX IF NOT EXISTS ai_comparison_results_feature_idx ON ai_comparison_results(feature);
CREATE INDEX IF NOT EXISTS ai_comparison_results_compared_at_idx ON ai_comparison_results(compared_at);

-- Enable RLS on ai_comparison_results
ALTER TABLE ai_comparison_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_comparison_results
CREATE POLICY "Users can view their own comparison results"
  ON ai_comparison_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparison results"
  ON ai_comparison_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparison results"
  ON ai_comparison_results FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparison results"
  ON ai_comparison_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
