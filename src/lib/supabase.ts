import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * User type definition
 * Represents a user in the system with their basic profile information
 */
export type User = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

/**
 * Journey type definition
 * Represents a habit-tracking journey with its narrative and progress details
 */
export type Journey = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  habit: string;
  duration: number;
  theme: 'fantasy' | 'sci-fi' | 'adventure' | 'mystery';
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  current_day: number;
  streak: number;
  truth_score: number;
};

/**
 * CheckIn type definition
 * Represents a daily check-in record with enhanced data collection
 */
export type CheckIn = {
  id: string;
  journey_id: string;
  user_id: string;
  day: number;
  created_at: string;
  text_input?: string;
  numeric_input?: number;
  media_url?: string;
  reflection: string;
  truth_rating: number;
  completed: boolean;
};

/**
 * ReflectionGate type definition
 * Represents a milestone reflection point in a journey
 */
export type ReflectionGate = {
  id: string;
  journey_id: string;
  day: number;
  completed: boolean;
  prompt: string;
  response: string | null;
  created_at: string;
};

// Database schema setup
export const createTables = async () => {
  const { error: checkInsError } = await supabase.rpc('create_check_ins_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS check_ins (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        day INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
        text_input TEXT,
        numeric_input NUMERIC,
        media_url TEXT,
        reflection TEXT NOT NULL,
        truth_rating INTEGER CHECK (truth_rating >= 0 AND truth_rating <= 10),
        completed BOOLEAN DEFAULT false,
        CONSTRAINT check_ins_journey_day_unique UNIQUE (journey_id, day)
      );
      
      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_check_ins_journey_id ON check_ins(journey_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON check_ins(created_at);
      
      -- Enable Row Level Security
      ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY "Users can view their own check-ins"
        ON check_ins FOR SELECT
        USING (auth.uid() = user_id);
        
      CREATE POLICY "Users can insert their own check-ins"
        ON check_ins FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
      CREATE POLICY "Users can update their own check-ins"
        ON check_ins FOR UPDATE
        USING (auth.uid() = user_id);
    `
  });

  if (checkInsError) {
    console.error('Error creating check_ins table:', checkInsError);
  }
};