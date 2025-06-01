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

// Database monitoring and debugging
export const monitorDatabaseOperations = {
  async select(table: string, query: any) {
    console.group(`📥 Fetching from ${table}`);
    console.time('Query Duration');
    const result = await query;
    console.timeEnd('Query Duration');
    
    if (result.error) {
      console.error('Query Error:', result.error);
    } else {
      console.log('Data:', result.data);
      console.log('Count:', result.data?.length || 0);
    }
    console.groupEnd();
    return result;
  },

  async insert(table: string, data: any) {
    console.group(`📤 Inserting into ${table}`);
    console.log('Data to insert:', data);
    console.time('Insert Duration');
    const result = await supabase.from(table).insert(data).select();
    console.timeEnd('Insert Duration');
    
    if (result.error) {
      console.error('Insert Error:', result.error);
    } else {
      console.log('Inserted Data:', result.data);
    }
    console.groupEnd();
    return result;
  },

  async update(table: string, id: string, data: any) {
    console.group(`🔄 Updating ${table}`);
    console.log('ID:', id);
    console.log('Update data:', data);
    console.time('Update Duration');
    const result = await supabase.from(table).update(data).eq('id', id).select();
    console.timeEnd('Update Duration');
    
    if (result.error) {
      console.error('Update Error:', result.error);
    } else {
      console.log('Updated Data:', result.data);
    }
    console.groupEnd();
    return result;
  }
};

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
  points: number;
  total_check_ins: number;
  total_reflection_gates_completed: number;
};

/**
 * Achievement type definition
 * Represents a gamification achievement that users can earn
 */
export type Achievement = {
  id: string;
  name: string;
  description: string;
  criteria_type: 'streak' | 'total_check_ins' | 'journey_completed' | 'reflection_gates_completed';
  criteria_value: number;
  points_reward: number;
  image_url: string;
  created_at: string;
};

/**
 * UserAchievement type definition
 * Represents an achievement earned by a user
 */
export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
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
  // Create achievements table
  const { error: achievementsError } = await supabase.rpc('create_achievements_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        criteria_type TEXT NOT NULL,
        criteria_value INTEGER NOT NULL,
        points_reward INTEGER DEFAULT 0 NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
      );

      -- Enable Row Level Security
      ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Enable read access for all users"
        ON achievements FOR SELECT
        USING (TRUE);
    `
  });

  if (achievementsError) {
    console.error('Error creating achievements table:', achievementsError);
  }

  // Create user_achievements table
  const { error: userAchievementsError } = await supabase.rpc('create_user_achievements_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_achievements (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
        earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
        CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
      );

      -- Enable Row Level Security
      ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view their own earned achievements"
        ON user_achievements FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own earned achievements"
        ON user_achievements FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `
  });

  if (userAchievementsError) {
    console.error('Error creating user_achievements table:', userAchievementsError);
  }

  // Add new columns to journeys table
  const { error: journeysError } = await supabase.rpc('alter_journeys_table', {
    sql: `
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS total_check_ins INTEGER DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS total_reflection_gates_completed INTEGER DEFAULT 0 NOT NULL;
    `
  });

  if (journeysError) {
    console.error('Error modifying journeys table:', journeysError);
  }

  // Create check_ins table if it doesn't exist
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