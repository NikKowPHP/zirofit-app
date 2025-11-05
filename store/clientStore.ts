import { create } from 'zustand';
import { apiFetch } from '@/lib/api';
import type { Client } from '@/lib/api/types';

type ClientState = {
    clients: Client[];
    activeClient: Client | null;
    isLoading: boolean;
    error: string | null;
    fetchClients: () => Promise<void>;
    fetchClientDetails: (clientId: string) => Promise<void>;
    init: () => void;
};

const useClientStore = create<ClientState>((set) => ({
    clients: [],
    activeClient: null,
    isLoading: false,
    error: null,
    fetchClients: async () => {
        set({ isLoading: true });
        try {
            const clients = await apiFetch('/trainer/clients');
            set({ clients, isLoading: false, error: null });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    fetchClientDetails: async (clientId: string) => {
        set({ isLoading: true });
        try {
            const clientDetails = await apiFetch(`/trainer/clients/${clientId}`);
            set({ activeClient: clientDetails, isLoading: false, error: null });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    init: () => {
        console.log('Client store initialized');
        useClientStore.getState().fetchClients();
    },
}));

export default useClientStore;
      