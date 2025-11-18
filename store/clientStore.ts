import { create } from 'zustand';
import { clientRepository } from '@/lib/repositories/clientRepository';
import { database } from '@/lib/db';
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
            // Read from local database instead of API
            const clientsCollection = database.collections.get('clients');
            const localClients = await clientsCollection
                .query()
                .fetch();
            set({ clients: localClients as any, isLoading: false, error: null });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    fetchClientDetails: async (clientId: string) => {
        set({ isLoading: true });
        try {
            // Read from local database instead of API
            const clientsCollection = database.collections.get('clients');
            const client = await clientsCollection.find(clientId);
            set({ activeClient: client as any, isLoading: false, error: null });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    init: () => {
        console.log('Client store initialized - using local database');
        useClientStore.getState().fetchClients();
    },
}));

export default useClientStore;
      