import { TravelSearchQuery, TravelOption, DemandForecast, CorridorRisk, FareAlert, FestivalInfo, RecommendationResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error || response.statusText || 'API request failed');
  }

  return response.json() as Promise<T>;
}

function parseDemandForecast(data: DemandForecast[]): DemandForecast[] {
  return data.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));
}

function parseFareAlert(data: FareAlert): FareAlert {
  return {
    ...data,
    priceHistory: data.priceHistory.map((item) => ({
      ...item,
      date: new Date(item.date),
    })),
  };
}

export class TravelDataService {
  private static instance: TravelDataService;

  static getInstance(): TravelDataService {
    if (!TravelDataService.instance) {
      TravelDataService.instance = new TravelDataService();
    }
    return TravelDataService.instance;
  }

  async searchTravelOptions(query: TravelSearchQuery): Promise<TravelOption[]> {
    return apiFetch<TravelOption[]>('/search', {
      method: 'POST',
      body: JSON.stringify({
        origin: query.origin,
        destination: query.destination,
        transportMode: query.transportMode,
        departureDate: query.departureDate?.toISOString(),
        returnDate: query.returnDate?.toISOString(),
      }),
    });
  }

  async getDemandForecast(origin: string, destination: string): Promise<DemandForecast[]> {
    const data = await apiFetch<DemandForecast[]>(
      `/demand-forecast?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    );
    return parseDemandForecast(data);
  }

  async getCorridorRisks(): Promise<CorridorRisk[]> {
    return apiFetch<CorridorRisk[]>('/corridor-risks');
  }

  async getFareAlert(origin: string, destination: string): Promise<FareAlert> {
    const data = await apiFetch<FareAlert>(
      `/fare-alert?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    );
    return parseFareAlert(data);
  }

  async getFestivalInfo(): Promise<FestivalInfo[]> {
    return apiFetch<FestivalInfo[]>('/festivals');
  }

  async subscribeToAlerts(email: string, route: string, preferences: any): Promise<boolean> {
    const response = await apiFetch<{ success: boolean }>('/alerts', {
      method: 'POST',
      body: JSON.stringify({ email, route, preferences }),
    });
    return response.success;
  }

  async getRecommendations(): Promise<RecommendationResponse> {
    return apiFetch<RecommendationResponse>('/recommendations');
  }

  async acceptRecommendation(id: string): Promise<boolean> {
    const response = await apiFetch<{ success: boolean }>(`/recommendations/${id}/accept`, {
      method: 'POST',
    });
    return response.success;
  }

  async rejectRecommendation(id: string): Promise<boolean> {
    const response = await apiFetch<{ success: boolean }>(`/recommendations/${id}/reject`, {
      method: 'POST',
    });
    return response.success;
  }
}
