import { create } from 'zustand';
// import { apiFetch } from '@/lib/api';

// Define types based on backend schema
export type ClientSummary = {
    id: string;
    name: string;
    avatar_url?: string;
};

export type ClientDetails = ClientSummary & {
    // ... more detailed fields
    email: string;
};

type ClientState = {
    clients: ClientSummary[];
    activeClient: ClientDetails | null;
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
            // const clients = await apiFetch('/clients');
            // set({ clients, isLoading: false });
            console.log("Fetching clients...");
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
    fetchClientDetails: async (clientId: string) => {
        set({ isLoading: true });
        try {
            // const clientDetails = await apiFetch(`/clients/${clientId}`);
            // set({ activeClient: clientDetails, isLoading: false });
            console.log(`Fetching client details for ${clientId}...`);
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
      