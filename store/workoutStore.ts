import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define your types. These should match your database schema.
type WorkoutSession = { id: string; name: string; exercises: any[] };
type ClientExerciseLog = { id: string; reps: number; weight: number; workout_session_id: string; exercise_id: string };

type WorkoutState = {
  workoutSession: WorkoutSession | null;
  isResting: boolean;
  restTimerValue: number;
  channel: RealtimeChannel | null;
  startWorkout: (session: WorkoutSession) => void;
  logSetOptimistic: (log: Omit<ClientExerciseLog, 'id'>) => void;
  finishWorkout: () => void;
  // ... other actions
};

const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workoutSession: null,
  isResting: false,
  restTimerValue: 0,
  channel: null,

  startWorkout: (session) => {
    set({ workoutSession: session });
    const channel = supabase.channel(`workout_session:${session.id}`);

    channel
      .on<ClientExerciseLog>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ClientExerciseLog', filter: `workout_session_id=eq.${session.id}` },
        (payload) => {
          console.log('New log from trainer!', payload.new);
          // Here you would update the workoutSession state with the new log
          // This ensures the client's UI updates if a trainer adds a log remotely.
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to workout session channel!');
        }
        if (err) {
            console.error("Subscription error", err)
        }
      });
      
    set({ channel });
  },

  logSetOptimistic: async (log) => {
    const newLog = { ...log, id: `temp-${Date.now()}` };

    // Optimistically update UI
    // In a real app, you'd find the correct exercise and add the log to it.
    console.log('Optimistically logging set:', newLog);
    
    // Call the actual API
    const { error } = await supabase.from('ClientExerciseLog').insert(log);

    if (error) {
      console.error('Failed to save log:', error);
      // Here you would handle the error, e.g., show a toast and revert the optimistic update.
    }
  },

  finishWorkout: () => {
    const { channel } = get();
    if (channel) {
      supabase.removeChannel(channel);
    }
    set({ workoutSession: null, channel: null });
  },
}));

export default useWorkoutStore;
      