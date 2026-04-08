import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TravelSearchQuery } from "@/lib/types";

interface JourneyPlannerFormProps {
  onSearch: (query: TravelSearchQuery) => void;
  loading?: boolean;
}

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", 
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik"
];

const JourneyPlannerForm = ({ onSearch, loading = false }: JourneyPlannerFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [transportMode, setTransportMode] = useState<TravelSearchQuery['transportMode']>("all");
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");

  const filteredOriginCities = cities.filter(city => 
    city.toLowerCase().includes(originSearch.toLowerCase())
  );
  
  const filteredDestinationCities = cities.filter(city => 
    city.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const handleSearch = () => {
    if (origin && destination && departureDate) {
      onSearch({
        origin,
        destination,
        departureDate,
        returnDate,
        transportMode
      });
    }
  };

  const swapCities = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginSearch(destination);
    setDestinationSearch(origin);
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin */}
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin city" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search cities..."
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              {filteredOriginCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label htmlFor="destination">To</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Search cities..."
                      value={destinationSearch}
                      onChange={(e) => setDestinationSearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {filteredDestinationCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapCities}
              className="mt-6"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Return Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate ? format(returnDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Transport Mode */}
      <div className="space-y-2">
        <Label>Mode of Transport</Label>
        <div className="flex flex-wrap gap-2">
          {(["all", "train", "bus", "flight"] as const).map((mode) => (
            <Button
              key={mode}
              variant={transportMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setTransportMode(mode)}
              className="capitalize"
            >
              {mode === "all" ? "All" : mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <div className="space-y-2">
        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={!origin || !destination || !departureDate || loading}
        >
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Searching...' : 'Check Surge Risk'}
        </Button>
        
        {origin && destination && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>Real-time crowd prediction and fare analysis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyPlannerForm;
