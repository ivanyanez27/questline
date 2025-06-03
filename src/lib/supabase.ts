// @ts-ignore - Suppress SES extension warnings
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export interface Journey {
  id: string;
  user_id: string;
  title: string;
  description: string;
  habit: string;
  duration: number;
  theme: string;
  started_at: string;
  completed_at: string | null;
  current_day: number;
  streak: number;
  truth_score: number;
  created_at: string;
}

export interface CheckIn {
  id: string;
  journey_id: string;
  day: number;
  text_input: string;
  numeric_input: number;
  photo_url: string | null;
  reflection: string;
  created_at: string;
}

export interface ReflectionGate {
  id: string;
  journey_id: string;
  day: number;
  completed: boolean;
  prompt: string;
  response: string | null;
  created_at: string;
}

// Initialize Supabase client with auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Rest of the file remains unchanged...
// (Previous code continues below)