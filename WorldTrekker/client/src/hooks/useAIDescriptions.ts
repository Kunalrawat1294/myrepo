import { useQuery } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export const useAIDescriptions = (countryName: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ai-descriptions', countryName],
    queryFn: () => aiService.generateCountryDescriptions(countryName),
    enabled: enabled && !!countryName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - descriptions don't change often
    retry: 1,
  });
};