import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

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

export type CheckIn = {
  id: string;
  journey_id: string;
  day: number;
  completed: boolean;
  reflection: string;
  truth_rating: number;
  created_at: string;
};

export type ReflectionGate = {
  id: string;
  journey_id: string;
  day: number;
  completed: boolean;
  prompt: string;
  response: string | null;
  created_at: string;
};