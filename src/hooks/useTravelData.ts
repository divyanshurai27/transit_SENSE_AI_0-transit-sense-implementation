import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TravelSearchQuery, TravelOption, DemandForecast, CorridorRisk, FareAlert, FestivalInfo } from '@/lib/types';
import { TravelDataService } from '@/lib/travel-service';

export const useTravelData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const travelService = TravelDataService.getInstance();
  const queryClient = useQueryClient();

  const searchTravelOptions = useCallback(async (query: TravelSearchQuery): Promise<TravelOption[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await queryClient.fetchQuery({
        queryKey: ['searchTravelOptions', query.origin, query.destination, query.departureDate, query.transportMode],
        queryFn: () => travelService.searchTravelOptions(query),
        staleTime: 1000 * 60 * 5, // 5 mins cache
      });
      return results;
    } catch (err) {
      const errorMessage = 'Failed to search travel options';
      setError(errorMessage);
      console.error(errorMessage, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryClient, travelService]);

  const getDemandForecast = useCallback(async (origin: string, destination: string): Promise<DemandForecast[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await queryClient.fetchQuery({
        queryKey: ['demandForecast', origin, destination],
        queryFn: () => travelService.getDemandForecast(origin, destination),
        staleTime: 1000 * 60 * 15, // 15 mins cache
      });
      return results;
    } catch (err) {
      const errorMessage = 'Failed to get demand forecast';
      setError(errorMessage);
      console.error(errorMessage, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryClient, travelService]);

  const getCorridorRisks = useCallback(async (): Promise<CorridorRisk[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await queryClient.fetchQuery({
        queryKey: ['corridorRisks'],
        queryFn: () => travelService.getCorridorRisks(),
        staleTime: 1000 * 60 * 10,
      });
      return results;
    } catch (err) {
      const errorMessage = 'Failed to get corridor risks';
      setError(errorMessage);
      console.error(errorMessage, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryClient, travelService]);

  const getFareAlert = useCallback(async (origin: string, destination: string): Promise<FareAlert | null> => {
    setLoading(true);
    setError(null);
    try {
      const results = await queryClient.fetchQuery({
        queryKey: ['fareAlert', origin, destination],
        queryFn: () => travelService.getFareAlert(origin, destination),
        staleTime: 1000 * 60 * 30,
      });
      return results;
    } catch (err) {
      const errorMessage = 'Failed to get fare alert';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [queryClient, travelService]);

  const getFestivalInfo = useCallback(async (): Promise<FestivalInfo[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await queryClient.fetchQuery({
        queryKey: ['festivalInfo'],
        queryFn: () => travelService.getFestivalInfo(),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });
      return results;
    } catch (err) {
      const errorMessage = 'Failed to get festival information';
      setError(errorMessage);
      console.error(errorMessage, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [queryClient, travelService]);

  const subscribeToAlerts = useCallback(async (email: string, route: string, preferences: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const results = await travelService.subscribeToAlerts(email, route, preferences);
      return results;
    } catch (err) {
      const errorMessage = 'Failed to subscribe to alerts';
      setError(errorMessage);
      console.error(errorMessage, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [travelService]);

  return {
    loading,
    error,
    searchTravelOptions,
    getDemandForecast,
    getCorridorRisks,
    getFareAlert,
    getFestivalInfo,
    subscribeToAlerts
  };
};

export const useTravelSearch = (query: TravelSearchQuery | null) => {
  const [results, setResults] = useState<TravelOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { searchTravelOptions } = useTravelData();

  useEffect(() => {
    if (query) {
      setSearched(true);
      setLoading(true);
      setError(null);
      
      let isMounted = true;
      
      searchTravelOptions(query)
        .then((data) => {
          if (isMounted) {
            setResults(data);
          }
        })
        .catch(err => {
          if (isMounted) {
            const errorMessage = 'Failed to search travel options';
            setError(errorMessage);
            console.error(errorMessage, err);
            setResults([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
        
      return () => {
        isMounted = false;
      };
    } else {
      setResults([]);
      setSearched(false);
      setError(null);
      setLoading(false);
    }
  }, [query, searchTravelOptions]);

  return { results, loading, error, searched };
};
