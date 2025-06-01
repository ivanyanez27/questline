import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Journey, CheckIn, ReflectionGate } from '../lib/supabase';
import { useAuth } from './AuthContext';

type JourneyContextType = {
  journeys: Journey[];
  currentJourney: Journey | null;
  checkIns: CheckIn[];
  reflectionGates: ReflectionGate[];
  loading: boolean;
  error: string | null;
  fetchJourneys: () => Promise<void>;
  fetchCurrentJourney: () => Promise<void>;
  createJourney: (journeyData: Partial<Journey>) => Promise<{ data: Journey | null; error: Error | null }>;
  updateJourney: (id: string, updates: Partial<Journey>) => Promise<{ error: Error | null }>;
  createCheckIn: (checkInData: Partial<CheckIn>) => Promise<{ data: CheckIn | null; error: Error | null }>;
  completeReflectionGate: (gateId: string, response: string) => Promise<{ error: Error | null }>;
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [reflectionGates, setReflectionGates] = useState<ReflectionGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's journeys
  const fetchJourneys = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJourneys(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current active journey
  const fetchCurrentJourney = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get the most recent active journey
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .not('started_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is ok
        throw error;
      }

      if (data) {
        setCurrentJourney(data);
        
        // Fetch check-ins for this journey
        const { data: checkInsData, error: checkInsError } = await supabase
          .from('check_ins')
          .select('*')
          .eq('journey_id', data.id)
          .order('day', { ascending: true });
          
        if (checkInsError) throw checkInsError;
        setCheckIns(checkInsData || []);
        
        // Fetch reflection gates for this journey
        const { data: gatesData, error: gatesError } = await supabase
          .from('reflection_gates')
          .select('*')
          .eq('journey_id', data.id)
          .order('day', { ascending: true });
          
        if (gatesError) throw gatesError;
        setReflectionGates(gatesData || []);
      } else {
        setCurrentJourney(null);
        setCheckIns([]);
        setReflectionGates([]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new journey
  const createJourney = async (journeyData: Partial<Journey>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('journeys')
        .insert([{ ...journeyData, user_id: user.id }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Create reflection gates at specific intervals
      const gates = [];
      const duration = journeyData.duration || 30;
      
      // Add gates at days 3, 7, 14, 21, and final day
      const gateDays = [3, 7, 14, 21, duration];
      for (const day of gateDays) {
        if (day <= duration) {
          gates.push({
            journey_id: data.id,
            day,
            completed: false,
            prompt: `Day ${day} Reflection: How has this journey changed you so far?`
          });
        }
      }
      
      if (gates.length > 0) {
        await supabase.from('reflection_gates').insert(gates);
      }
      
      await fetchJourneys();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // Update a journey
  const updateJourney = async (id: string, updates: Partial<Journey>) => {
    try {
      const { error } = await supabase
        .from('journeys')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchJourneys();
      if (currentJourney?.id === id) {
        await fetchCurrentJourney();
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Create a check-in
  const createCheckIn = async (checkInData: Partial<CheckIn>) => {
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert([checkInData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Update journey streak and current day
      if (currentJourney && checkInData.journey_id === currentJourney.id) {
        const updates: Partial<Journey> = {
          current_day: Math.max((currentJourney.current_day || 0) + 1, (checkInData.day || 0) + 1),
          streak: (currentJourney.streak || 0) + 1,
          truth_score: Math.round(
            ((currentJourney.truth_score * (currentJourney.current_day || 0)) + 
              (checkInData.truth_rating || 5)) / ((currentJourney.current_day || 0) + 1)
          )
        };
        
        await updateJourney(currentJourney.id, updates);
      }
      
      await fetchCurrentJourney();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // Complete a reflection gate
  const completeReflectionGate = async (gateId: string, response: string) => {
    try {
      const { error } = await supabase
        .from('reflection_gates')
        .update({ completed: true, response })
        .eq('id', gateId);
        
      if (error) throw error;
      
      await fetchCurrentJourney();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchJourneys();
      fetchCurrentJourney();
    } else {
      setJourneys([]);
      setCurrentJourney(null);
      setCheckIns([]);
      setReflectionGates([]);
    }
  }, [user]);

  return (
    <JourneyContext.Provider
      value={{
        journeys,
        currentJourney,
        checkIns,
        reflectionGates,
        loading,
        error,
        fetchJourneys,
        fetchCurrentJourney,
        createJourney,
        updateJourney,
        createCheckIn,
        completeReflectionGate,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}