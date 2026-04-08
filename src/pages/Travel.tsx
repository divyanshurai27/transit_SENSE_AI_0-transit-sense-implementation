import { useState, useEffect } from 'react';
import JourneyPlannerForm from "@/components/travel/JourneyPlannerForm";
import TravelResults from "@/components/travel/TravelResults";
import DemandForecastCard from "@/components/travel/DemandForecastCard";
import CorridorRiskMap from "@/components/travel/CorridorRiskMap";
import AlternativeOptionsPanel from "@/components/travel/AlternativeOptionsPanel";
import FareWatchWidget from "@/components/travel/FareWatchWidget";
import TripAlertSignup from "@/components/travel/TripAlertSignup";
import FestivalTravelGuide from "@/components/travel/FestivalTravelGuide";
import Navigation from "@/components/layout/Navigation";
import { TravelSearchQuery, TravelOption, DemandForecast, CorridorRisk, FareAlert, FestivalInfo } from '@/lib/types';
import { useTravelData, useTravelSearch } from '@/hooks/useTravelData';
import { useDebounce } from '@/hooks/useDebounce';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSearchContext } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

const Travel = () => {
  // Set page title using custom hook
  usePageTitle('TransitSense - Travel Planning');
  
  // Shared search context
  const {
    currentSearch,
    searchResults,
    demandForecast,
    corridorRisks,
    fareAlert,
    festivals,
    isSearching,
    searchError,
    hasSearched,
    setCurrentSearch,
    setSearchResults,
    setDemandForecast,
    setCorridorRisks,
    setFareAlert,
    setFestivals,
    setSearching,
    setSearchError,
    setHasSearched,
  } = useSearchContext();
  
  // Local state for UI
  const [selectedTab, setSelectedTab] = useState('search');
  
  // Local data fetching hooks
  const { 
    searchTravelOptions,
    getDemandForecast, 
    getCorridorRisks, 
    getFareAlert, 
    getFestivalInfo,
    subscribeToAlerts
  } = useTravelData();

  const debouncedSearch = useDebounce(async (query: TravelSearchQuery) => {
    setSearching(true);
    setSearchError(null);
    setHasSearched(true);
    setCurrentSearch(query);
    
    try {
      // Search for travel options and load additional data in parallel
      const [results, forecast, fare] = await Promise.all([
        searchTravelOptions(query),
        getDemandForecast(query.origin, query.destination),
        getFareAlert(query.origin, query.destination)
      ]);
      
      setSearchResults(results);
      setDemandForecast(forecast);
      setFareAlert(fare);
      
      // Switch to results tab after data is loaded
      setSelectedTab('results');
    } catch (error) {
      setSearchError('Failed to search for travel options');
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  }, 300);

  const handleSearch = (query: TravelSearchQuery) => {
    debouncedSearch(query);
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const [risks, festivalData] = await Promise.all([
        getCorridorRisks(),
        getFestivalInfo()
      ]);
      setCorridorRisks(risks);
      setFestivals(festivalData);
    };
    loadInitialData();
  }, [getCorridorRisks, getFestivalInfo]);

  const handleBookOption = (option: TravelOption) => {
    console.log('Booking option:', option);
    // In a real app, this would navigate to booking page
    alert(`Booking ${option.provider} ${option.mode} from ${currentSearch?.origin} to ${currentSearch?.destination}`);
  };

  const handleSubscribe = async (data: any) => {
    const success = await subscribeToAlerts(data.email, `${currentSearch?.origin} → ${currentSearch?.destination}`, data.preferences);
    if (success) {
      alert('Successfully subscribed to alerts!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">TransitSense Travel Portal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your journey with AI-powered crowd forecasting and real-time surge alerts
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Live Demand Tracking
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Surge Predictions
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Festival Insights
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {searchError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="results" disabled={!hasSearched || isSearching}>
              Results {hasSearched && `(${searchResults.length})`}
            </TabsTrigger>
            <TabsTrigger value="forecast" disabled={!currentSearch}>Forecast</TabsTrigger>
            <TabsTrigger value="risks">Corridor Risks</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Journey Planner Form */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Search className="h-5 w-5" />
                Plan Your Journey
              </h2>
              <JourneyPlannerForm onSearch={handleSearch} loading={isSearching} />
            </section>

            {/* Quick Stats */}
            {corridorRisks.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">High Risk Corridors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {corridorRisks.filter(r => r.riskScore > 75).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently experiencing high demand</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Festivals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {festivals.filter(f => {
                        const [start, end] = f.dates.split(' - ');
                        return true; // Simplified check
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Affecting travel this month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Fare Increase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">+24%</div>
                    <p className="text-xs text-muted-foreground">Due to current demand</p>
                  </CardContent>
                </Card>
              </section>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <TravelResults 
              options={searchResults}
              loading={isSearching}
              error={searchError}
              onBookOption={handleBookOption}
            />
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            {currentSearch && demandForecast.length > 0 && (
              <>
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">Demand Forecast</h2>
                  <DemandForecastCard
                    route={`${currentSearch.origin} → ${currentSearch.destination}`}
                    riskLevel={demandForecast[0]?.riskLevel || 'MODERATE'}
                    demandScore={demandForecast[0]?.demandScore || 50}
                    forecastSeries={demandForecast.map(item => ({
                      date: item.date,
                      demand: item.demandScore
                    }))}
                  />
                </section>

                {fareAlert && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Fare Monitoring</h2>
                    <FareWatchWidget
                      route={fareAlert.route}
                      currentFare={fareAlert.currentFare}
                      baseFare={fareAlert.baseFare}
                      fairPriceCeiling={fareAlert.fairPriceCeiling}
                    />
                  </section>
                )}

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">Alternative Travel Options</h2>
                  <AlternativeOptionsPanel
                    originalQuery={{
                      origin: currentSearch.origin, 
                      destination: currentSearch.destination,
                      departureDate: currentSearch.departureDate
                    }}
                    alternatives={[
                      { 
                        date: new Date(currentSearch.departureDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        route: `${currentSearch.origin} → ${currentSearch.destination} → Alternative`, 
                        crowdLevel: 'LOW', 
                        fareRange: '₹2,500-3,500' 
                      },
                      { 
                        date: new Date(currentSearch.departureDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                        route: `${currentSearch.origin} → Via City → ${currentSearch.destination}`, 
                        crowdLevel: 'MODERATE', 
                        fareRange: '₹3,000-4,000' 
                      },
                    ]}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">Stay Updated</h2>
                  <TripAlertSignup
                    prefillRoute={{ origin: currentSearch.origin, destination: currentSearch.destination }}
                    onSubscribe={handleSubscribe}
                  />
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">National Corridor Risk Map</h2>
              <CorridorRiskMap corridors={corridorRisks} />
            </section>
          </TabsContent>

          <TabsContent value="festivals" className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Festival Travel Guides</h2>
              <FestivalTravelGuide festivals={festivals} />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Travel;
