-- ============================================================================
-- CodeType Database Schema for Supabase
-- ============================================================================
-- This file contains the complete database schema for the CodeType application.
-- Run this SQL in your Supabase SQL Editor to set up the required tables and
-- Row-Level Security (RLS) policies.
-- ============================================================================

-- ============================================================================
-- 1. USER STATS TABLE
-- ============================================================================
-- Stores user statistics including XP, level, typing metrics, and achievements
-- One row per user, synchronized with Supabase Auth users
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core Stats
  total_snippets INTEGER DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  total_lines INTEGER DEFAULT 0,

  -- Performance Metrics
  best_wpm DECIMAL(10, 2) DEFAULT 0,
  average_accuracy DECIMAL(5, 2) DEFAULT 0,

  -- Gamification
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  perfect_snippets INTEGER DEFAULT 0,

  -- Session Data (for quick display)
  last_session_wpm DECIMAL(10, 2),
  last_session_accuracy DECIMAL(5, 2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id)
);

-- Add index for faster user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Ensures users can only access and modify their own data
-- ============================================================================

-- Enable RLS on user_stats table
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own stats
CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own stats (on first login)
CREATE POLICY "Users can insert their own stats"
  ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stats
CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own stats
CREATE POLICY "Users can delete their own stats"
  ON user_stats
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. HELPER FUNCTION: Initialize User Stats on Signup
-- ============================================================================
-- This function automatically creates a user_stats row when a new user signs up
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user() when a new user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 4. OPTIONAL: SESSION HISTORY TABLE
-- ============================================================================
-- Uncomment this section if you want to track individual typing sessions
-- This allows for detailed analytics and performance tracking over time
-- ============================================================================

/*
CREATE TABLE IF NOT EXISTS typing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Details
  snippet_id TEXT NOT NULL,
  language TEXT NOT NULL,

  -- Performance Metrics
  wpm DECIMAL(10, 2) NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  correct_chars INTEGER NOT NULL,
  total_chars INTEGER NOT NULL,
  errors INTEGER NOT NULL,

  -- XP Earned
  xp_earned INTEGER NOT NULL,

  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER GENERATED ALWAYS AS
    (EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER) STORED,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster user_id lookups
CREATE INDEX IF NOT EXISTS idx_typing_sessions_user_id ON typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_sessions_created_at ON typing_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for typing_sessions
CREATE POLICY "Users can view their own sessions"
  ON typing_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON typing_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
*/

-- ============================================================================
-- 5. OPTIONAL: ACHIEVEMENTS TABLE
-- ============================================================================
-- Uncomment this section if you want to track unlocked achievements in the database
-- Currently achievements are calculated on the frontend, but this allows persistence
-- ============================================================================

/*
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, achievement_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock their own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
*/

-- ============================================================================
-- 6. VERIFICATION QUERIES
-- ============================================================================
-- Run these queries after executing the schema to verify everything is set up
-- ============================================================================

-- Check if tables were created successfully
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('user_stats');

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = 'user_stats';

-- Check if policies were created
-- SELECT schemaname, tablename, policyname FROM pg_policies
-- WHERE tablename = 'user_stats';
