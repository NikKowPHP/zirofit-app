import { create } from 'zustand';
import { apiFetch } from '@/lib/api';
import type { TrainerProgram } from '@/lib/api/types';

type ProgramState = {
    programs: TrainerProgram[];
    isLoading: boolean;
    error: string | null;
    fetchPrograms: () => Promise<void>;
    init: () => void;
};

const useProgramStore = create<ProgramState>((set) => ({
    programs: [],
    isLoading: false,
    error: null,
    fetchPrograms: async () => {
        set({ isLoading: true });
        try {
            const programs = await apiFetch('/trainer/programs');
            set({ programs, isLoading: false, error: null });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    init: () => {
        console.log('Program store initialized');
        useProgramStore.getState().fetchPrograms();
    },
}));

export default useProgramStore;
      