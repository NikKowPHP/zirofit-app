import { act } from '@testing-library/react-native';
import useWorkoutStore from './workoutStore';
import * as api from '@/lib/api';
import type { WorkoutSession as ApiWorkoutSession, ClientExerciseLog as ApiClientExerciseLog } from '@/lib/api/types';

// Mock the API module
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Define local types that extend the API types
type ClientExerciseLog = ApiClientExerciseLog;
type WorkoutExercise = { id: string; name: string; };
type WorkoutSession = ApiWorkoutSession & { name: string; exercises: WorkoutExercise[], logs: ClientExerciseLog[] };

const mockSession: WorkoutSession = {
  id: 'session1',
  user_id: 'user1',
  status: 'active',
  started_at: new Date().toISOString(),
  name: 'Test Workout',
  exercises: [{ id: 'ex1', name: 'Push Ups' }],
  logs: [],
};

describe('workoutStore', () => {
    // Reset store before each test
    beforeEach(() => {
        act(() => {
            useWorkoutStore.setState(useWorkoutStore.getState());
        });
        jest.clearAllMocks();
    });

    it('should handle startWorkout successfully', async () => {
        mockedApi.startWorkoutSession.mockResolvedValue(mockSession);
        
        await act(async () => {
            await useWorkoutStore.getState().startWorkout('template1');
        });

        const state = useWorkoutStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.workoutSession).toEqual(mockSession);
        expect(state.error).toBeNull();
        expect(mockedApi.startWorkoutSession).toHaveBeenCalledWith('template1');
    });

    it('should handle startWorkout failure', async () => {
        const error = new Error('Failed to start');
        mockedApi.startWorkoutSession.mockRejectedValue(error);
        
        await act(async () => {
            await useWorkoutStore.getState().startWorkout('template1');
        });

        const state = useWorkoutStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.workoutSession).toBeNull();
        expect(state.error).toBe(error.message);
    });

    it('should handle logSet with optimistic update and success', async () => {
        // Start with an active session
        act(() => {
            useWorkoutStore.setState({ workoutSession: mockSession });
        });
        
        const logData = { 
          client_id: 'user1', 
          exercise_id: 'ex1', 
          sets: [{ reps: 10, weight: 50 }], 
          completed_at: new Date().toISOString() 
        };
        const newLogFromApi: ClientExerciseLog = { 
          id: 'log1', 
          client_id: 'user1', 
          exercise_id: 'ex1', 
          workout_session_id: 'session1',
          sets: [{ reps: 10, weight: 50 }],
          completed_at: new Date().toISOString()
        };
        
        mockedApi.logSet.mockResolvedValue(newLogFromApi);

        await act(async () => {
            await useWorkoutStore.getState().logSet(logData);
        });

        const state = useWorkoutStore.getState();
        expect(state.isResting).toBe(true);
        // Check optimistic log
        expect(state.workoutSession?.logs.some(log => log.id.startsWith('temp-'))).toBe(false);
        // Check final log from API
        expect(state.workoutSession?.logs).toContainEqual(newLogFromApi);
    });
    
    it('should revert optimistic update on logSet failure', async () => {
        act(() => {
            useWorkoutStore.setState({ workoutSession: mockSession });
        });
        
        const logData = { 
          client_id: 'user1', 
          exercise_id: 'ex1', 
          sets: [{ reps: 10, weight: 50 }], 
          completed_at: new Date().toISOString() 
        };
        
        mockedApi.logSet.mockRejectedValue(new Error('API failed'));

        await act(async () => {
            await useWorkoutStore.getState().logSet(logData);
        });
        
        const state = useWorkoutStore.getState();
        expect(state.workoutSession?.logs.length).toBe(0);
        expect(state.error).toBe("Failed to save set. Please try again.");
    });


    it('should handle finishWorkout successfully', async () => {
        act(() => {
            useWorkoutStore.setState({ workoutSession: mockSession });
        });

        mockedApi.finishWorkoutSession.mockResolvedValue(mockSession);

        await act(async () => {
            await useWorkoutStore.getState().finishWorkout();
        });

        const state = useWorkoutStore.getState();
        expect(state.workoutSession).toBeNull();
        expect(state.isResting).toBe(false);
    });
});
      