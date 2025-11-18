import { useState, useEffect } from 'react';
import { clientRepository } from '@/lib/repositories/clientRepository';
import { database } from '@/lib/db';
import type { Client } from '@/lib/api/types';
import ClientModel from '@/lib/db/models/Client';

export function useClientDetails(clientId: string) {
  const [data, setData] = useState<ClientModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // First, try to get the client immediately (synchronous)
    const clientsCollection = database.collections.get<ClientModel>('clients');
    clientsCollection.find(clientId).then((client) => {
      if (client) {
        setData(client);
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });

    // Then subscribe to changes
    const observable = clientRepository.observeClient(clientId);
    const subscription = observable.subscribe((client: ClientModel) => {
      setData(client);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [clientId]);

  return {
    data: data as Client | null,
    isLoading,
    error: null,
    isOffline: false
  };
}
      