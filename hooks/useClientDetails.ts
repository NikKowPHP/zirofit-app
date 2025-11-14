import { useQuery } from '@tanstack/react-query';
import { getClientDetails } from '@/lib/api';
import { clientRepository } from '@/lib/repositories/clientRepository';
import { useObservable } from './useObservable';

export function useClientDetails(clientId: string) {
  // First, try to get data from local database
  const localClient = useObservable(
    clientId ? clientRepository.observeClient(clientId) : null,
    [clientId]
  );

  // Also fetch from API for fresh data when online
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['client', clientId, 'api'],
    queryFn: () => getClientDetails(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404s or 500s - client might not exist on server
      if (error?.status === 404 || error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Use local data if available, otherwise use API data
  const data = localClient || apiData;

  return {
    data,
    isLoading: isLoading && !localClient, // Only show loading if no local data
    error: localClient ? null : error, // Don't show API errors if we have local data
    isOffline: !!localClient && !apiData // Indicate if we're using offline data
  };
}
      