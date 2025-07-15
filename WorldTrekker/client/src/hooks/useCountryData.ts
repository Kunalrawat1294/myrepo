import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import { Country } from '../types/country';

export const useCountryData = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: apiService.fetchAllCountries,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useWikipediaSummary = (countryName: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['wikipedia', countryName],
    queryFn: () => apiService.fetchWikipediaSummary(countryName),
    enabled: enabled && !!countryName,
    retry: 1,
  });
};

export const useCountryImages = (countryName: string, category: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['images', countryName, category],
    queryFn: () => apiService.fetchUnsplashImages(`${countryName} ${category}`),
    enabled: enabled && !!countryName,
    retry: 1,
  });
};
