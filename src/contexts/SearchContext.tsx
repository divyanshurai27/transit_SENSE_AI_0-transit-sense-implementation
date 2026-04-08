import { createContext, useContext, useState, ReactNode } from 'react';
import { TravelSearchQuery, TravelOption, DemandForecast, CorridorRisk, FareAlert, FestivalInfo } from '@/lib/types';

interface SearchContextType {
  // Current search state
  currentSearch: TravelSearchQuery | null;
  searchResults: TravelOption[];
  demandForecast: DemandForecast[];
  corridorRisks: CorridorRisk[];
  fareAlert: FareAlert | null;
  festivals: FestivalInfo[];
  
  // Search state
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
  
  // Actions
  setCurrentSearch: (query: TravelSearchQuery) => void;
  setSearchResults: (results: TravelOption[]) => void;
  setDemandForecast: (forecast: DemandForecast[]) => void;
  setCorridorRisks: (risks: CorridorRisk[]) => void;
  setFareAlert: (alert: FareAlert | null) => void;
  setFestivals: (festivals: FestivalInfo[]) => void;
  setSearching: (isSearching: boolean) => void;
  setSearchError: (error: string | null) => void;
  setHasSearched: (hasSearched: boolean) => void;
  
  // Clear all data
  clearSearchData: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [currentSearch, setCurrentSearch] = useState<TravelSearchQuery | null>(null);
  const [searchResults, setSearchResults] = useState<TravelOption[]>([]);
  const [demandForecast, setDemandForecast] = useState<DemandForecast[]>([]);
  const [corridorRisks, setCorridorRisks] = useState<CorridorRisk[]>([]);
  const [fareAlert, setFareAlert] = useState<FareAlert | null>(null);
  const [festivals, setFestivals] = useState<FestivalInfo[]>([]);
  const [isSearching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const clearSearchData = () => {
    setCurrentSearch(null);
    setSearchResults([]);
    setDemandForecast([]);
    setCorridorRisks([]);
    setFareAlert(null);
    setFestivals([]);
    setSearching(false);
    setSearchError(null);
    setHasSearched(false);
  };

  const value: SearchContextType = {
    // State
    currentSearch,
    searchResults,
    demandForecast,
    corridorRisks,
    fareAlert,
    festivals,
    isSearching,
    searchError,
    hasSearched,
    
    // Actions
    setCurrentSearch,
    setSearchResults,
    setDemandForecast,
    setCorridorRisks,
    setFareAlert,
    setFestivals,
    setSearching,
    setSearchError,
    setHasSearched,
    clearSearchData,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
