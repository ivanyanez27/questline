import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Journey, CheckIn, ReflectionGate, monitorDatabaseOperations } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

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

  const fetchJourneys = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await monitorDatabaseOperations.select(
        'journeys',
        supabase
          .from('journeys')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      );

      if (error) throw error;
      setJourneys(data || []);
    } catch (err) {
      setError((err as Error).message);
      toast.error('Failed to fetch journeys');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentJourney = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
        throw error;
      }

      setCurrentJourney(data || null);

      if (data) {
        const [checkInsResponse, gatesResponse] = await Promise.all([
          supabase
            .from('check_ins')
            .select('*')
            .eq('journey_id', data.id)
            .order('day', { ascending: true }),
          supabase
            .from('reflection_gates')
            .select('*')
            .eq('journey_id', data.id)
            .order('day', { ascending: true })
        ]);

        if (checkInsResponse.error) throw checkInsResponse.error;
        if (gatesResponse.error) throw gatesResponse.error;

        setCheckIns(checkInsResponse.data || []);
        setReflectionGates(gatesResponse.data || []);
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error('Failed to fetch current journey');
    } finally {
      setLoading(false);
    }
  };

  const createJourney = async (journeyData: Partial<Journey>) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'habit', 'duration', 'theme'];
      const missingFields = requiredFields.filter(field => !journeyData[field as keyof typeof journeyData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare journey data with all required fields
      const newJourney = {
        ...journeyData,
        user_id: user.id,
        started_at: new Date().toISOString(),
        current_day: 0,
        streak: 0,
        truth_score: 0
      };

      // Create journey
      const { data, error } = await supabase
        .from('journeys')
        .insert([newJourney])
        .select()
        .single();

      if (error) throw error;

      // Create reflection gates
      if (data) {
        const gates = [];
        const duration = journeyData.duration || 30;
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
          const { error: gatesError } = await supabase
            .from('reflection_gates')
            .insert(gates);

          if (gatesError) throw gatesError;
        }
      }

      await fetchJourneys();
      toast.success('Journey created successfully!');
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const updateJourney = async (id: string, updates: Partial<Journey>) => {
    try {
      const { error } = await supabase
        .from('journeys')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchJourneys();
      if (currentJourney?.id === id) {
        await fetchCurrentJourney();
      }

      toast.success('Journey updated successfully');
      return { error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { error };
    }
  };

  const createCheckIn = async (checkInData: Partial<CheckIn>) => {
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert([{ ...checkInData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

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
      const error = err as Error;
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const completeReflectionGate = async (gateId: string, response: string) => {
    try {
      const { error } = await supabase
        .from('reflection_gates')
        .update({ completed: true, response })
        .eq('id', gateId);

      if (error) throw error;

      await fetchCurrentJourney();
      toast.success('Reflection completed successfully');
      return { error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { error };
    }
  };

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