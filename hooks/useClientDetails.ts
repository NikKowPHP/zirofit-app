import { useQuery } from '@tanstack/react-query';
import { getClientDetails } from '@/lib/api';

export function useClientDetails(clientId: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => getClientDetails(clientId),
        enabled: !!clientId,
        staleTime: 0, // Always consider data stale
        gcTime: 0, // Don't cache the data
    });

    return { data, isLoading, error };
}
      