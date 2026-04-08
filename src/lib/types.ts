export interface TravelSearchQuery {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  transportMode: 'all' | 'train' | 'bus' | 'flight';
}

export interface TravelOption {
  id: string;
  provider: string;
  mode: 'train' | 'bus' | 'flight';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  crowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  rating: number;
  amenities: string[];
}

export interface DemandForecast {
  date: Date;
  demandScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  expectedPrice: number;
  alternativeRoutes: number;
  hasFestival?: boolean;
  weatherAlert?: boolean;
}

export interface CorridorRisk {
  origin: string;
  destination: string;
  riskScore: number;
  riskLevel?: string;
  transportMode: 'train' | 'bus' | 'flight';
  currentDemand: number;
  capacity: number;
  incidents: number;
}

export interface FareAlert {
  route: string;
  currentFare: number;
  baseFare: number;
  fairPriceCeiling: number;
  priceHistory: Array<{
    date: Date;
    price: number;
  }>;
  prediction: 'stable' | 'increasing' | 'decreasing';
  cheapestDay?: Date | string | null;
  priceIncreasePercent?: string;
}

export interface FestivalInfo {
  name: string;
  dates: string;
  affectedCorridors: string[];
  historicalCrowdLevel: number;
  travelTips: string;
  region: string;
  expectedTravelers: number;
}

export interface Recommendation {
  id: string;
  corridor: string;
  date: string;
  recommendation: string;
  confidence: number;
  passengersRelieved: number;
  status: "accepted" | "under-review" | "rejected";
  ministry: string;
  urgency: "high" | "medium" | "low";
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  kpis: {
    total: number;
    accepted: number;
    underReview: number;
    passengersRelieved: number;
  };
}
