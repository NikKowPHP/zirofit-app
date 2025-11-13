import { create } from 'zustand';
import * as api from '@/lib/api';
import type { WorkoutSession as ApiWorkoutSession, ClientExerciseLog as ApiClientExerciseLog } from '@/lib/api/types';

const REST_DURATION = 60; // seconds

// Define your types. These should match your database schema.
type ClientExerciseLog = ApiClientExerciseLog;
type WorkoutExercise = { id: string; name: string; };
type StoreWorkoutSession = ApiWorkoutSession & { name: string; exercises: WorkoutExercise[], logs: ClientExerciseLog[] };

type WorkoutState = {
  workoutSession: StoreWorkoutSession | null;
  isLoading: boolean;
  error: string | null;
  isResting: boolean;
  restTimerValue: number;
  checkActiveSession: () => Promise<void>;
  startWorkout: (templateId: string) => Promise<void>;
  addExercise: (exerciseId: string) => Promise<void>;
  logSet: (logData: Omit<ClientExerciseLog, 'id' | 'workout_session_id'>) => Promise<void>;
  stopResting: () => void;
  finishWorkout: () => Promise<void>;
};

const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workoutSession: null,
  isLoading: false,
  error: null,
  isResting: false,
  restTimerValue: 0,

  checkActiveSession: async () => {
    set({ isLoading: true });
    try {
      const session = await api.getActiveWorkoutSession() as any;
      set({ 
        workoutSession: session ? { 
          ...session, 
          name: session.name || 'Workout', 
          exercises: (session.exercises || []) as WorkoutExercise[], 
          logs: (session.logs || []) as ClientExerciseLog[]
        } : null, 
        isLoading: false 
      });
    } catch (error) {
      // It's okay if there's no active session, so we don't set an error state here
      console.log("No active session found.");
      set({ workoutSession: null, isLoading: false });
    }
  },

  startWorkout: async (templateId: string) => {
    set({ isLoading: true });
    try {
      const session = await api.startWorkoutSession({ templateId });
      set({ 
        workoutSession: { 
          ...session, 
          name: session.name || 'Workout', 
          exercises: (session.exercises || []) as WorkoutExercise[], 
          logs: (session.logs || []) as ClientExerciseLog[]
        }, 
        isLoading: false 
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  addExercise: async (exerciseId: string) => {
    const currentSession = get().workoutSession;
    if (!currentSession) return;

    set({ isLoading: true });
    try {
      const updatedSession = await api.addExerciseToLiveSession(currentSession.id, { exercise_id: exerciseId });
      set({ 
        workoutSession: { 
          ...updatedSession, 
          name: updatedSession.name || currentSession.name, 
          exercises: (updatedSession.exercises || []) as WorkoutExercise[], 
          logs: (updatedSession.logs || []) as ClientExerciseLog[]
        }, 
        isLoading: false 
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  logSet: async (logData) => {
    const currentSession = get().workoutSession;
    if (!currentSession) return;

    // Optimistic update
    const tempLog = { ...logData, id: `temp-${Date.now()}`, workout_session_id: currentSession.id };
    set(state => ({
      workoutSession: state.workoutSession ? {
        ...state.workoutSession,
        logs: [...(state.workoutSession.logs || []), tempLog],
      } : null,
      isResting: true,
      restTimerValue: REST_DURATION,
    }));

    try {
      const newLog = await api.logSet({
        reps: logData.sets[0].reps,
        weight: logData.sets[0].weight,
        exercise_id: logData.exercise_id,
        workout_session_id: currentSession.id
      } as any);
      // Replace temp log with real one from API
      set(state => ({
        workoutSession: state.workoutSession ? {
            ...state.workoutSession,
            logs: state.workoutSession.logs.map(log => log.id === tempLog.id ? newLog : log) as ClientExerciseLog[],
        } : null,
      }));
    } catch (e: any) {
      console.error("Failed to log set:", e.message);
      // Revert optimistic update
      set(state => ({
        error: "Failed to save set. Please try again.",
        workoutSession: state.workoutSession ? {
            ...state.workoutSession,
            logs: ((state.workoutSession.logs || []) as ClientExerciseLog[]).filter(log => log.id !== tempLog.id),
        } : null,
      }));
    }
  },

  stopResting: () => {
    set({ isResting: false, restTimerValue: 0 });
  },

  finishWorkout: async () => {
    const currentSession = get().workoutSession;
    if (!currentSession) return;

    try {
      await api.finishWorkoutSession({ sessionId: currentSession.id });
      set({ workoutSession: null, isResting: false });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));

export default useWorkoutStore;
      