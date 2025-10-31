import { useQuery } from '@tanstack/react-query';
import { getClientDetails } from '@/lib/api';

export function useClientDetails(clientId: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => getClientDetails(clientId),
        enabled: !!clientId,
    });

    return { data, isLoading, error };
}
      