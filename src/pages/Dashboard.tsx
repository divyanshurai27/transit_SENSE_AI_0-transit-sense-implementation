import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DemandForecastCommand from "@/components/dashboard/DemandForecastCommand";
import CorridorRiskMatrix from "@/components/dashboard/CorridorRiskMatrix";
import CorridorDrillDown from "@/components/dashboard/CorridorDrillDown";
import CapacityRecommendationCards from "@/components/dashboard/CapacityRecommendationCards";
import TerminalDensityMonitor from "@/components/dashboard/TerminalDensityMonitor";
import SurgePricingOversight from "@/components/dashboard/SurgePricingOversight";
import HistoricalAnalyticsPanel from "@/components/dashboard/HistoricalAnalyticsPanel";
import Navigation from "@/components/layout/Navigation";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSearchContext } from "@/contexts/SearchContext";

const Dashboard = () => {
  // Set page title using custom hook
  usePageTitle('TransitSense - Dashboard');

  // Shared search context
  const {
    currentSearch,
    searchResults,
    demandForecast,
    corridorRisks,
    fareAlert,
    festivals,
    hasSearched,
    isSearching
  } = useSearchContext();

  const [activeSection, setActiveSection] = useState("demand-forecast");
  const [selectedCorridor, setSelectedCorridor] = useState<any>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleRowClick = (corridor: any) => {
    setSelectedCorridor(corridor);
  };

  const handleCloseDrillDown = () => {
    setSelectedCorridor(null);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "demand-forecast":
        return <DemandForecastCommand />;
      case "risk-matrix":
        return <CorridorRiskMatrix onRowClick={handleRowClick} />;
      case "capacity-recs":
        return <CapacityRecommendationCards />;
      case "terminal-density":
        return <TerminalDensityMonitor />;
      case "surge-oversight":
        return <SurgePricingOversight />;
      case "analytics":
        return <HistoricalAnalyticsPanel />;
      default:
        return <DemandForecastCommand />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection}
        onNavigate={handleNavigate}
        user={{ name: "Authority User", role: "Transport Planner" }}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Authority Planning Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Real-time transit analytics and capacity planning tools
            </p>
          </div>

          {/* Search Summary */}
          {hasSearched && currentSearch && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Current Travel Search Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-blue-700">Route</div>
                  <div className="text-lg font-bold text-blue-900">
                    {currentSearch.origin} → {currentSearch.destination}
                  </div>
                  <div className="text-sm text-blue-600">
                    {new Date(currentSearch.departureDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700">Search Results</div>
                  <div className="text-lg font-bold text-blue-900">{searchResults.length} options</div>
                  <div className="text-sm text-blue-600">
                    {isSearching ? 'Searching...' : 'Complete'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700">Risk Assessment</div>
                  <div className="text-lg font-bold text-blue-900">
                    {demandForecast.length > 0 ? demandForecast[0].riskLevel : 'No data'}
                  </div>
                  <div className="text-sm text-blue-600">
                    {demandForecast.length > 0 ? `Demand Score: ${demandForecast[0].demandScore}%` : 'No forecast data'}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => window.location.href = '/travel'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  View Travel Details
                </button>
                {fareAlert && (
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                    Fare Alert: {fareAlert.currentFare > fareAlert.baseFare ? '+' : ''}{Math.round(((fareAlert.currentFare - fareAlert.baseFare) / fareAlert.baseFare) * 100)}% vs base fare
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Content */}
          <div className="space-y-8">
            {renderActiveSection()}
          </div>

        </div>
      </div>

      {/* Corridor Drill Down Modal */}
      {selectedCorridor && (
        <CorridorDrillDown 
          corridor={selectedCorridor}
          onClose={handleCloseDrillDown}
        />
      )}
    </div>
  );
};

export default Dashboard;
